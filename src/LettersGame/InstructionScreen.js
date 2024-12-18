// InstructionScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LettersGame.css';

const InstructionScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="letters-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Instructions</h2>
        <p>
          You will be shown a sequence of 40 letters, one at a time.
       <br></br>
          Press the spacebar if you see a letter that appeared 2 letters before. For example, if you are shown A, D, G, D, G, K, you would press the spacebar when you see the second ‘D’ and the second ‘G’.
        </p>
        <button className="grey-button" onClick={() => navigate('transition')}>
          Begin Game
        </button>
      </div>
    </div>
  );
};

export default InstructionScreen;
