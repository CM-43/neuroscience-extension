// SummaryScreen.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShapesGame.css';

const SummaryScreen = () => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('shapesGame'));
    if (!data || data.length < 14) {
      navigate('../');
      return;
    }
    setGameData(data);
  }, [navigate]);

  if (!gameData) {
    return <div>Loading...</div>;
  }

  const totalCorrect = gameData.filter(d => d.correct).length;
  
  // Calculate average time in milliseconds
  const totalTime = gameData.reduce((sum, round) => sum + round.timeTaken, 0);

  const avgTime = totalTime / gameData.length;
  // round the average time to increments of 50
  const roundedAvgTime = Math.round(avgTime / 50) * 50;
  // add a , separator to the average time
  const formattedAvgTime = roundedAvgTime.toLocaleString();

  return (
    <div className="shapes-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Score Report</h2>
        <div className="summary-stats">
          <div className="summary-item">
            <div className="summary-title">Total Correct</div>
            <div className="summary-value" style={{backgroundColor:'#D4EDDA', border:'1.5px solid #b4b4b4'}}>{totalCorrect}/{gameData.length}</div>
          </div>
          <div className="summary-item">
            <div className="summary-title">Average Time</div>
            <div className="summary-value">{formattedAvgTime} Msec</div>
          </div>
        </div>

       
        <div className="summary-buttons">
          <button
            className="grey-buttons"
            onClick={() => navigate('../strategy-tips')}
          >
            Strategy & Tips
          </button>
          <button
            className="grey-buttons"
            onClick={() => {
              navigate('../');
              localStorage.removeItem('shapesGame');
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;
