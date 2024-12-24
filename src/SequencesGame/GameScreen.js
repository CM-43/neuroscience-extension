// GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SequencesGame.css';
import sequencesData from './sequencesData.json';

const TOTAL_ROUNDS = 20;
const TIME_PER_ROUND = 30; // seconds

const GameScreen = ({onComplete}) => {
  const navigate = useNavigate();
  const [roundIndex, setRoundIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND);
  const [currentSequence, setCurrentSequence] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedSequences, setSelectedSequences] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // fetch the sequencesData.json from the public folder
//    const sequencesData = fetch ('/sequencesData.json') 

    // On mount, pick random 20 distinct sequences from the ~50
    const allSequences = sequencesData.Sheet1;
    const chosen = pickRandomSequences(allSequences, TOTAL_ROUNDS);
    setSelectedSequences(chosen);
  }, []);

  useEffect(() => {
    if (selectedSequences.length === TOTAL_ROUNDS) {
      // Start first round
      loadRound(roundIndex);
    }
  }, [selectedSequences]);

  useEffect(() => {
    if (timeLeft <= 0 && currentSequence) {
      // Time ran out, record answer as null or empty
      recordRound(null);
    }
  }, [timeLeft, currentSequence]);

  const startTimer = () => {
    setTimeLeft(TIME_PER_ROUND);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newVal = prev - 1;
        if (newVal < 0) {
          clearInterval(timerRef.current);
          return 0;
        }
        return newVal;
      });
    }, 1000);
  };

  const loadRound = (index) => {
    const seq = selectedSequences[index];
    const seqNumbers = seq["Sequence"].split(',').map(s => parseInt(s.trim(),10));
    setCurrentSequence({
      round: index + 1,
      sequence: seqNumbers,
      pattern: seq["Pattern / Logic"],
      fifthNumber: seq["5th Number"]
    });
    setUserAnswer('');
    startTimer();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const submitAnswer = () => {
    const answerNum = userAnswer.trim() === '' ? null : parseInt(userAnswer,10);
    recordRound(answerNum);
  };

  const recordRound = (answer) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const roundData = {
      round: currentSequence.round,
      sequence: currentSequence.sequence,
      pattern: currentSequence.pattern,
      fifthNumber: currentSequence.fifthNumber,
      userAnswer: answer
    };

    let savedData = JSON.parse(localStorage.getItem('sequencesGame')) || [];
    savedData[roundIndex] = roundData;
    localStorage.setItem('sequencesGame', JSON.stringify(savedData));

    const nextRound = roundIndex + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      // Done all rounds
      setTimeout(() => {
        onComplete();
        navigate('../end-transition');
      }, 500);
    } else {
      setRoundIndex(nextRound);
      loadRound(nextRound);
    }
  };

  if (!currentSequence) {
    return <div className="sequences-game">Loading...</div>;
  }

  const questionNumber = roundIndex + 1;

  return (
    <div className="sequences-game" onKeyDown={handleKeyDown} tabIndex="0">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <div className="game-header-mag">
          <div className="question-number">{questionNumber}/20</div>
          <div className="time-left" >⏱️ {Math.floor(timeLeft/60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
        </div>
        <div className="prompt-text" style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px' }}>
          Input the 5th number to complete the sequence, then press ENTER
        </div>
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
          {currentSequence.sequence.map((num, i) => (
            <div key={i} className="number-box">
              {num}
            </div>
          ))}
          <input
            type="text"
            className="number-box-input"
            placeholder={`Input`}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </div>

      </div>
    </div>
  );
};

function pickRandomSequences(all, count) {
  const shuffled = [...all].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default GameScreen;
