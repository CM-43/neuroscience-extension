// GameScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LettersGame.css';

const TOTAL_LETTERS = 40;
const TOTAL_REPEATS = 10;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const GameScreen = ({onComplete}) => {
  const navigate = useNavigate();
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showLetter, setShowLetter] = useState(false);
  const [timing, setTiming] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [falseAlarmCount, setFalseAlarmCount] = useState(0);
  const intervalRef = useRef(null);
  const displayTimeoutRef = useRef(null);
  const blankTimeoutRef = useRef(null);

  useEffect(() => {
    // Load timing config
    fetch(process.env.PUBLIC_URL + '/lettersTiming.json')
      .then(res => res.json())
      .then(data => {
        setTiming(data);
      });
  }, []);

  useEffect(() => {
    // Generate sequence once timing is ready
    if (timing) {
      const seq = generateSequence(TOTAL_LETTERS, TOTAL_REPEATS);
      setSequence(seq);
      // Start the display process after initialWaitMs
      setTimeout(() => {
        showNextLetter(0);
      }, timing.initialWaitMs);
    }
  }, [timing]);

useEffect(() => {
  const handleKeyDown = (e) => {
    e.preventDefault();
    if (e.code == 'Space' && currentIndex >= 0 && currentIndex < sequence.length && showLetter) {
      if (isRepeat(sequence, currentIndex)) {
        setCorrectCount(prev => prev + 1);
        localStorage.setItem('lettersGame', JSON.stringify({
          correct: correctCount,
          falseAlarm: falseAlarmCount
        }));
      } else {
        setFalseAlarmCount(prev => prev + 1);
        localStorage.setItem('lettersGame', JSON.stringify({
          correct: correctCount,
          falseAlarm: falseAlarmCount
        }));
      }
    }
    
  };


  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentIndex, showLetter, sequence]);

  const showNextLetter = (index) => {
    if (index >= TOTAL_LETTERS) {
      // done all letters
      endGame();
      return;
    }
    setCurrentIndex(index);
    setShowLetter(true);
    // show letter for displayTimeMs
    displayTimeoutRef.current = setTimeout(() => {
      setShowLetter(false);
      // blank screen for blankTimeMs
      blankTimeoutRef.current = setTimeout(() => {
        showNextLetter(index+1);
      }, timing.blankTimeMs);
    }, timing.displayTimeMs);
  };

  const endGame = () => {
    // Save results

    setTimeout(() => {
      onComplete();
      navigate('../end-transition');
    }, 500);
  };

  return (
    <div className="letters-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        {showLetter && currentIndex >= 0 && currentIndex < sequence.length ? (
          <div className="letter-display">{sequence[currentIndex]}</div>
        ) : null}
      </div>
    </div>
  );
};

function generateSequence(total, repeats) {
  // We need a sequence of 40 letters with exactly 10 repeats defined as sequence[i] = sequence[i-2].
  // Strategy:
  // 1) Start by generating a random sequence of letters with no restrictions.
  // 2) Insert repeats at random positions (>=2) until we have 10 repeats.
  // We'll do a direct construction approach:
  let seq = [];
  let repeatPositions = pickRandomPositionsForRepeats(total, repeats);
  
  for (let i=0; i<total; i++) {
    if (repeatPositions.has(i)) {
      // seq[i] should be seq[i-2]
      seq[i] = seq[i-2];
    } else {
      // choose a random letter different from the one that would cause unintended repeats
      // Actually, no need to avoid anything special, as long as we ensure chosen letter is random
      // It's okay to randomly pick a letter, even if by chance it creates a repeat not in repeatPositions?
      // The specification says always 10 times to press spacebar. We must ensure exactly 10 repeats.
      // To ensure exactly 10 repeats, we must ensure that no accidental repeats occur.
      // We'll pick a random letter from A-Z and check if it would create a repeat at i if i>=2:
      let letter;
      do {
        letter = LETTERS[Math.floor(Math.random()*26)];
      } while (i>=2 && seq[i-2] === letter && !repeatPositions.has(i)); 
      // If i>=2 and seq[i-2] == letter and this position is not supposed to be a repeat, pick another letter.
      seq[i] = letter;
    }
  }

  return seq;
}

function pickRandomPositionsForRepeats(total, repeats) {
  // repeats must occur at positions i>=2
  // We'll pick 10 distinct positions from [2..39] because 0-based indexing: the first repeat can appear at i=2 (3rd letter)
  let validPositions = [];
  for (let i=2; i<total; i++) {
    validPositions.push(i);
  }
  shuffleArray(validPositions);
  let chosen = new Set(validPositions.slice(0,repeats));
  return chosen;
}

function shuffleArray(arr) {
  for (let i=arr.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function isRepeat(seq, i) {
  if (i<2) return false;
  return seq[i] === seq[i-2];
}

export default GameScreen;
