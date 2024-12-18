// GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShapesGame.css';

const TOTAL_ROUNDS = 14;
const TIME_PER_ROUND = 45; // seconds

// Correct answers mapping
const correctAnswers = {
  1: 2,
  2: 4,
  3: 1,
  4: 2,
  5: 4,
  6: 3,
  7: 1,
  8: 5,
  9: 5,
  10: 3,
  11: 4,
  12: 1,
  13: 3,
  14: 2
};

const GameScreen = ({onComplete}) => {
  const navigate = useNavigate();
  const [roundIndex, setRoundIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND);
  const [roundOrder, setRoundOrder] = useState([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // On mount, create a randomized order of rounds [1..14]
    const allRounds = Array.from({ length: TOTAL_ROUNDS }, (_, i) => i + 1);
    shuffleArray(allRounds);
    setRoundOrder(allRounds);
  }, []);

  useEffect(() => {
    if (roundOrder.length === TOTAL_ROUNDS) {
      loadRound(roundIndex);
    }
  }, [roundOrder]);

  useEffect(() => {
    if (timeLeft <= 0 && currentRoundNumber !== null) {
      // Time out
      recordAnswer(null);
    }
  }, [timeLeft, currentRoundNumber]);

  const startTimer = () => {
    setTimeLeft(TIME_PER_ROUND);
    setStartTime(Date.now());
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  };

  const loadRound = (index) => {
    const rnd = roundOrder[index];
    setCurrentRoundNumber(rnd);
    startTimer();
  };

  const handleOptionClick = (option) => {
    recordAnswer(option);
  };

  const recordAnswer = (option) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const correctOption = correctAnswers[currentRoundNumber];
    const isCorrect = option === correctOption;
    const timeTaken = Date.now() - startTime; // milliseconds

    const roundData = {
      round: roundIndex + 1,
      displayedRound: currentRoundNumber,
      correctAnswer: correctOption,
      userChoice: option,
      correct: isCorrect,
      timeTaken
    };

    let savedData = JSON.parse(localStorage.getItem('shapesGame')) || [];
    savedData[roundIndex] = roundData;
    localStorage.setItem('shapesGame', JSON.stringify(savedData));

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

  if (currentRoundNumber === null) {
    return <div className="shapes-game">Loading...</div>;
  }

  const questionNumber = roundIndex + 1;

  const mainImage = `Shapes_Rectangle ${currentRoundNumber}.png`;
  const options = Array.from({ length: 5 }, (_, i) => `Shapes_Rectangle ${currentRoundNumber}-${i + 1}.png`);

  return (
    <div className="shapes-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <div className="game-header-mag">
          <div className="question-number">{questionNumber}/{TOTAL_ROUNDS}</div>
          <div className="time-left">⏱️ {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <img src={process.env.PUBLIC_URL + '/images/' + mainImage} alt="main" style={{ width: '300px', height: '150px' }} />
        </div>
        <div className="prompt-text" style={{ fontSize: '28px', fontWeight: 'bold', margin: '20px' }}>
          Select the shape hidden in the pattern         </div>
        <div className="options-row">
          {options.map((optSrc, idx) => (
            <div key={idx} className="option-box" onClick={() => handleOptionClick(idx + 1)}>
              <div className='option-image'>              <img src={process.env.PUBLIC_URL + '/images/' + optSrc} alt={`option ${idx + 1}`} style={{ maxWidth: '120px',maxHeight:'120px',border:'0px solid'}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export default GameScreen;
