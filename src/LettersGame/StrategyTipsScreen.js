// StrategyTipsScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LettersGame.css';

const StrategyTipsScreen = ({ url }) => {
  const navigate = useNavigate();
  const src = `https://docs.google.com/document/d/${url}/preview?embedded=false&tab=t.0`;

  return (
    <div className="letters-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Strategy & Tips</h2>
        <iframe className="tips-box" src={src}
          style={{height: '300px', width: '90%'}}
        > </iframe>
        <button
          className="grey-button"
          onClick={() => navigate('../summary')}
        >
          Back to Report
        </button>
      </div>
    </div>
  );
};

export default StrategyTipsScreen;
