// TowerGame/TransitionScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TowerGame.css';

const TransitionScreen = ({ text = 'Select "Next" when you are ready to start.' }) => {
  const navigate = useNavigate();



  // read local storage and check if total time is less than 120 seconds
  // if less than 120 seconds, display "Minigame Over!"
  // if more than 120 seconds, display "Minigame Complete!"
  const stats = JSON.parse(localStorage.getItem('towerGame'));

  const handleNext = () => {
    if (text === 'Minigame Complete!' || text === 'Minigame Over!') {
      if (stats.totalTime === 120) {
        text = 'Minigame Over!';
      }
      navigate('../summary');
    } else {
      navigate('../game');
    }
  };

  return (
    <div className="tower-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <p
          style={{
            textAlign: 'center',
            marginTop: '200px',
            fontSize: text === 'Minigame Complete!' || text === 'Minigame Over!' ? '24px' : '18px',
            fontWeight: text === 'Minigame Complete!' || text === 'Minigame Over!' ? 'bold' : 'normal',
          }}
        >
          {text}
        </p>
        <button className="grey-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TransitionScreen;
