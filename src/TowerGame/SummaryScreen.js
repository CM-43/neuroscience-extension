// TowerGame/SummaryScreen.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TowerGame.css';

const SummaryScreen = () => {
  const navigate = useNavigate();

  const [gameStats, setGameStats] = useState(null);
  const [gameCondition, setGameCondition] = useState(true);
  // remove towerGame from local storage


  useEffect(() => {
    if (!localStorage.getItem('towerGame')) {
      navigate('../');
    }
    else{
    const stats = JSON.parse(localStorage.getItem('towerGame'));
    if (stats.totalTime === 120) {
      setGameCondition(false);
    }
    setGameStats(stats);}
  }, []);

  if (!gameStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tower-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Score Report</h2>
        <div className='red-note' style={{opacity: gameCondition === false ? '100' : '0'}}>You did not complete the minigame!</div>
        <div className="summary-grid-tower">
          <div className="summary-item">
            <div className="summary-title">Planning Time:</div>
            <div className="summary-value">
              {Math.floor(gameStats.planningTime / 60)}:
              {('0' + (gameStats.planningTime % 60)).slice(-2)}
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-title">Total Time to Solve:</div>
            <div className="summary-value">
              {Math.floor(gameStats.totalTime / 60)}:
              {('0' + (gameStats.totalTime % 60)).slice(-2)}
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-title">Number of Steps:</div>
            <div className="summary-value">{gameStats.totalMoves}</div>
          </div>
        </div>
        <div className="summary-buttons">
          <button
            className="grey-buttons"
            onClick={ 
              () => navigate('../strategy-tips')}
          >
            Strategy & Tips
          </button>
          <button
            className="grey-buttons"
            onClick={() =>
               {navigate('../')
                localStorage.removeItem('towerGame')}
               }
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;
