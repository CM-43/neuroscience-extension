// InstructionScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ShapesGame.css';

const InstructionScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="shapes-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Instructions</h2>
        <p>
          You will be shown a sequence of 14 rectangles with unique patterns, and you need to identify the shape hidden within the rectangle.
        <br></br>
          You will have 45 seconds to find each shape.
        </p>
        <button className="grey-button" onClick={() => navigate('transition')}>
          Begin Game
        </button>
      </div>
    </div>
  );
};

export default InstructionScreen;
