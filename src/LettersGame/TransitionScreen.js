// TransitionScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LettersGame.css';

const TransitionScreen = ({ text = 'Select "Next" when you are ready to start.' }) => {
  const navigate = useNavigate();
  const handleNext = () => {
    if (text === 'Minigame Complete!') {
      navigate('../summary');
    } else {
      navigate('../game');
    }
  };

  return (
    <div className="letters-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <p
          style={{
            textAlign: 'center',
            marginTop: '200px',
            fontSize: text === 'Minigame Complete!' ? '24px' : '18px',
            fontWeight: text === 'Minigame Complete!' ? 'bold' : 'normal',
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
