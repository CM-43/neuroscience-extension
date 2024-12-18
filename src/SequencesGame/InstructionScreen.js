// InstructionScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SequencesGame.css';

const InstructionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="sequences-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Instructions</h2>
        <p>
          You will be shown 20 sequences of numbers. In each sequence, the 5th number is missing.
        </p>
        <p>
          For each sequence, determine the pattern and input the 5th number; press ENTER once you are done with each sequence.
        </p>
        <p>
          You have 30 seconds for each sequence.
        </p>
        <button className="grey-button" onClick={() => navigate('transition')}>
          Begin Game
        </button>
      </div>
    </div>
  );
};

export default InstructionScreen;
