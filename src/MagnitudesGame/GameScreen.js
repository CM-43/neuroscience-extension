import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MagnitudesGame.css'; // similar styling as the tower game

const TOTAL_ROUNDS = 10;

const GameScreen = ({onComplete}) => {
  const navigate = useNavigate();

  const [roundIndex, setRoundIndex] = useState(0);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [roundData, setRoundData] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // On mount, generate all rounds data (10 questions)
    // Ensure at least one fraction and one circle appears
    let generated = generateAllRounds();
    setRoundData(generated);
  }, []);

  useEffect(() => {
    if (roundData.length === TOTAL_ROUNDS) {
      // Wait for 1 second white screen, then show question
      const whiteScreenTimeout = setTimeout(() => {
        setShowWhiteScreen(false);
        startTimer();
      }, 500);
      return () => clearTimeout(whiteScreenTimeout);
    }
  }, [roundData, roundIndex]);

  useEffect(() => {
    // If time runs out and user hasn't chosen
    if (timeLeft <= 0 && !showWhiteScreen && roundData.length === TOTAL_ROUNDS) {
      recordChoice(null);
    }
  }, [timeLeft, showWhiteScreen, roundData]);

  const startTimer = () => {
    setTimeLeft(5);
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

  const currentRound = roundData[roundIndex] || null;

  const recordChoice = (choice) => {
    // Choice: 1 or 2 or null (if timed out)
    if (timerRef.current) clearInterval(timerRef.current);
    if (!currentRound) return;
    let updatedRound = { ...currentRound };

    updatedRound.userChoice = choice;
    updatedRound.correct = choice === updatedRound.correctOption;

    // Save to localStorage
    let savedData = JSON.parse(localStorage.getItem('magnitudesGame')) || [];
    savedData[roundIndex] = updatedRound;
    localStorage.setItem('magnitudesGame', JSON.stringify(savedData));

    // Move to next round
    const nextRound = roundIndex + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      // All rounds complete
      setTimeout(() => {
        onComplete();
        navigate('../end-transition');
      }, 500);
    } else {
      setShowWhiteScreen(true);
      setRoundIndex(nextRound);
    }
  };

  const handleOptionClick = (optionNumber) => {
    if (showWhiteScreen) return;
    recordChoice(optionNumber);
  };

  if (!currentRound) {
    return <div className="magnitudes-game">Loading...</div>;
  }

  const questionNumber = roundIndex + 1;

  return (
    <div className="magnitudes-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">

        {showWhiteScreen ? (
          <div style={{ background: '#fff', width: '100%', height: '100%' }}></div>
        ) : (
          <>
            <div className="game-header-mag">
              <div className="question-number">{questionNumber}/10</div>
              <div className="time-left">Time left: {timeLeft}</div>
            </div>
            <div className="prompt-text">
              {currentRound.type === 'fraction'
                ? 'Pick the side with the larger fraction:'
                : 'Pick the side with the higher proportion of YELLOW dots:'}
            </div>
            <div className="options-container">
              <div className="option-box" onClick={() => handleOptionClick(1)}>
                {currentRound.type === 'fraction'
                  ? renderFractionOption(currentRound.option1)
                  : renderCircleOption(currentRound.option1)}
              </div>
              <div className="option-box" onClick={() => handleOptionClick(2)}>
                {currentRound.type === 'fraction'
                  ? renderFractionOption(currentRound.option2)
                  : renderCircleOption(currentRound.option2)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper functions

function generateAllRounds() {
  let rounds = [];
  let fractionCount = 0;
  let circleCount = 0;

  // Generate 10 rounds ensuring at least one fraction and one circle
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    let type;
    if (i === 9) {
      // Last round, ensure we have both types appeared at least once
      if (fractionCount === 0) type = 'fraction';
      else if (circleCount === 0) type = 'circle';
    }
    if (!type) {
      type = Math.random() < 0.5 ? 'fraction' : 'circle';
    }

    let roundData;
    if (type === 'fraction') {
      roundData = generateFractionRound();
      fractionCount++;
    } else {
      roundData = generateCircleRound();
      circleCount++;
    }

    rounds.push({ round: i+1, type, ...roundData });
  }

  return rounds;
}

function generateFractionRound() {
  // Generate two distinct fractions
  let fraction1, fraction2;
  do {
    fraction1 = randomFraction();
    fraction2 = randomFraction();
  } while (!fractionsValidAndDifferent(fraction1, fraction2));

  // Determine which fraction is larger
  let val1 = fraction1.numerator / fraction1.denominator;
  let val2 = fraction2.numerator / fraction2.denominator;

  let correctOption = val1 > val2 ? 1 : 2;

  return {
    option1: fraction1,
    option2: fraction2,
    correctOption
  };
}

function randomFraction() {
  const numerator = Math.floor(Math.random() * 49) + 1;  // 1 to 49
  let denominator = Math.floor(Math.random() * (50 - 2 + 1)) + 2; // 2 to 50
  // Ensure denominator > numerator
  while (denominator <= numerator) {
    denominator = Math.floor(Math.random() * (50 - 2 + 1)) + 2; // 2 to 50
    while (denominator > 50) denominator = 50;
    denominator = Math.floor(Math.random() * (50 - 2 + 1)) + 2; // 2 to 50

  }
  return { numerator, denominator };
}

function fractionsValidAndDifferent(frac1, frac2) {
  const val1 = frac1.numerator / frac1.denominator;
  const val2 = frac2.numerator / frac2.denominator;
  // Must not be equal fractions
  if (Math.abs(val1 - val2) < 0.0001) return false;
  return true;
}

function generateCircleRound() {
  let option1, option2;
  do {
    option1 = randomCircleSet();
    option2 = randomCircleSet();
  } while (!circleSetsValidAndDifferent(option1, option2));

  // Determine which has higher proportion of yellow
  let val1 = option1.yellowCount / (option1.yellowCount + option1.blueCount);
  let val2 = option2.yellowCount / (option2.yellowCount + option2.blueCount);
  let correctOption = val1 > val2 ? 1 : 2;

  return {
    option1,
    option2,
    correctOption
  };
}

function randomCircleSet() {
  const yellowCount = Math.floor(Math.random() * 20) + 1; // 1–20
  const blueCount = Math.floor(Math.random() * 20) + 1;
  // We have yellow and blue circles. We must place them randomly.
  // For simplicity, just generate positions and if overlap, retry. 
  // Here we'll do a simplified approach (not a perfect no-overlap solution, but a best attempt).

  const circles = [];
  const totalCount = yellowCount + blueCount;
  // Let's pick sizes: minSize = 10px radius, maxSize = minSize*6 = 60px radius
  // Actually, let's just keep all dots same size to simplify. The instructions say largest can be max 6 times smallest.
  // Let's assume smallest = 10px radius and largest = 60px. We'll randomly vary size?
  // For simplicity, let's just pick a random size for all circles between 10 and 60.
  // A more complex approach would be needed in production. We'll do a single size approach for now.
  
  const minSize = 3; 
  const maxSize = 18;
  // We'll pick a random size for each circle. 
  for (let i = 0; i < totalCount; i++) {
    let isYellow = i < yellowCount;
    let color = isYellow ? '#C6BC4E' : '#8EB1E9';

    let placed = false;
    let attempts = 0;
    let radius = Math.floor(Math.random()*(maxSize-minSize+1))+minSize;
    while(!placed && attempts < 10000) {
      const x = Math.random()*(245-(radius*2)) + radius;
      const y = Math.random()*(245  -(radius*2)) + radius;
      // Check overlap
      if (!circles.some(c => distance(c.x,c.y,x,y) < c.radius+radius+5)) {
        circles.push({ color, x, y, radius });
        placed = true;
      }
      attempts++;
    }
    if (!placed) {
      // If we cannot place non-overlapping after some tries, just place anyway (fallback)
      circles.push({ color, x: radius+10, y: radius+10, radius });
    }
  }

  return {
    yellowCount,
    blueCount,
    circles
  };
}

function distance(x1,y1,x2,y2){
  return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function circleSetsValidAndDifferent(opt1, opt2) {
  let val1 = opt1.yellowCount/(opt1.yellowCount+opt1.blueCount);
  let val2 = opt2.yellowCount/(opt2.yellowCount+opt2.blueCount);
  // Must not be equal
  if (Math.abs(val1 - val2) < 0.0001) return false;
  return true;
}

// Render helpers

function renderFractionOption(option) {
  return (
    <div className="fraction-container">
      <div className="fraction-top">{option.numerator}</div>
      <div className="fraction-line"></div>
      <div className="fraction-bottom">{option.denominator}</div>
    </div>
  );
}

function renderCircleOption(option) {
  return (
    <div className="circle-container">
      {option.circles.map((c,i) => (
        <div key={i}
          className="circle-dot"
          style={{
            backgroundColor: c.color,
            position: 'absolute',
            borderRadius: '50%',
            left: `${c.x - c.radius}px`,
            top: `${c.y - c.radius}px`,
            width: `${c.radius*2}px`,
            height: `${c.radius*2}px`,
            border: '0px solid #333'
          }}
        ></div>
      ))}
    </div>
  );
}

export default GameScreen;
