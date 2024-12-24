import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LettersGame.css';

const GameScreen = ({ onComplete }) => {
  const navigate = useNavigate();

  // ------------- State -------------
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showLetter, setShowLetter] = useState(false);
  const [timing, setTiming] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [falseAlarmCount, setFalseAlarmCount] = useState(0);

  // ------------- Refs -------------
  const intervalRef = useRef(null);
  const displayTimeoutRef = useRef(null);
  const blankTimeoutRef = useRef(null);
  const handleKeyDownRef = useRef(null);

  // ------------- Constants -------------
  const TOTAL_LETTERS = 40;
  const TOTAL_REPEATS = 10;
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // ---------------- Effects ----------------

  // Load timing config once
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/lettersTiming.json')
      .then((res) => res.json())
      .then((data) => {
        setTiming(data);
      });
  }, []);

  // Generate sequence & start showing letters once timing is ready
  useEffect(() => {
    if (!timing) return;

    const seq = generateSequence(TOTAL_LETTERS, TOTAL_REPEATS);
    setSequence(seq);

    // Wait initialWaitMs, then start the cycle
    displayTimeoutRef.current = setTimeout(() => {
      showNextLetter(0);
    }, timing.initialWaitMs);

    // Cleanup if unmounts
    return () => {
      clearTimeout(displayTimeoutRef.current);
    };
  }, [timing]);

  // Keydown event listener: Press Space to detect repeats
  useEffect(() => {
    // Define the handler
    const handleKeyDown = (e) => {
      // Avoid page scroll on space
      e.preventDefault();

      // Only if currentIndex is valid and a letter is being shown
      if (e.code === 'Space' && currentIndex >= 0 && currentIndex < sequence.length && showLetter) {
        if (isRepeat(sequence, currentIndex)) {
          setCorrectCount((prev) => prev + 1);
          localStorage.setItem('lettersGame', JSON.stringify({
            correct: correctCount + 1,      // add 1 here since we just incremented
            falseAlarm: falseAlarmCount
          }));
        } else {
          setFalseAlarmCount((prev) => prev + 1);
          localStorage.setItem('lettersGame', JSON.stringify({
            correct: correctCount,
            falseAlarm: falseAlarmCount + 1  // add 1 here
          }));
        }
      }
    };

    // Store ref to remove it later
    handleKeyDownRef.current = handleKeyDown;

    // Attach event
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, showLetter, sequence, correctCount, falseAlarmCount]);

  // ---------------- Handlers ----------------

  // Called to show each letter in the sequence
  const showNextLetter = (index) => {
    if (index >= TOTAL_LETTERS) {
      endGame();
      return;
    }

    setCurrentIndex(index);
    setShowLetter(true);

    // Show letter for displayTimeMs
    displayTimeoutRef.current = setTimeout(() => {
      setShowLetter(false);

      // Then blank for blankTimeMs
      blankTimeoutRef.current = setTimeout(() => {
        showNextLetter(index + 1);
      }, timing.blankTimeMs);

    }, timing.displayTimeMs);
  };

  // Called after all letters shown
  const endGame = () => {
    // Final save to localStorage if needed
    if (!localStorage.getItem('lettersGame')) {
      localStorage.setItem('lettersGame', JSON.stringify({
        correct: correctCount,
        falseAlarm: falseAlarmCount
      }));
    }
    // Navigate away
    setTimeout(() => {
      onComplete();
      navigate('../end-transition');
    }, 500);
  };

  // Clear everything if user goes to Menu
  const handleMenuClick = () => {
    // 1) Clear intervals/timeouts
    clearInterval(intervalRef.current);
    clearTimeout(displayTimeoutRef.current);
    clearTimeout(blankTimeoutRef.current);

    // 2) Remove keydown listener
    if (handleKeyDownRef.current) {
      window.removeEventListener('keydown', handleKeyDownRef.current);
    }

    // 3) Optionally clear any partial data
    //    e.g., localStorage.removeItem('lettersGame');
    //    or just keep partial data. Up to you.

    // 4) Navigate to menu
    navigate('/');
  };

  // ---------------- Utility Functions ----------------
  function generateSequence(total, repeats) {
    // Exactly `repeats` positions will be i-2 repeats
    let seq = [];
    const repeatPositions = pickRandomPositionsForRepeats(total, repeats);

    for (let i = 0; i < total; i++) {
      if (repeatPositions.has(i)) {
        // seq[i] should be seq[i-2]
        seq[i] = seq[i - 2];
      } else {
        let letter;
        do {
          letter = LETTERS[Math.floor(Math.random() * 26)];
        } while (i >= 2 && seq[i - 2] === letter && !repeatPositions.has(i));
        seq[i] = letter;
      }
    }
    return seq;
  }

  function pickRandomPositionsForRepeats(total, repeats) {
    let validPositions = [];
    for (let i = 2; i < total; i++) {
      validPositions.push(i);
    }
    shuffleArray(validPositions);
    let chosen = new Set(validPositions.slice(0, repeats));
    return chosen;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function isRepeat(seq, i) {
    if (i < 2) return false;
    return seq[i] === seq[i - 2];
  }

  // ---------------- Render ----------------

  return (
    <div className="letters-game">
      <button className="menu-button" onClick={handleMenuClick}>
        Menu
      </button>
      <div className="game-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {showLetter && currentIndex >= 0 && currentIndex < sequence.length ? (
          <div className="letter-display">{sequence[currentIndex]}</div>
        ) : null}
      </div>
    </div>
  );
};

export default GameScreen;
