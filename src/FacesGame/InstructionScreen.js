// FacesGame/InstructionScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FacesGame.css';

const InstructionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="faces-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Instructions</h2>
        <p>
          You will be presented with 14 images displaying different facial expressions, and your goal is to choose the word that best describes each person’s emotions.
        </p>
        <p>
          The images can be split into 2 categories:<br></br>

          1. Images with descriptions (30 seconds each): Images accompanied by a short story explaining the context of the facial expression.
          <br></br>
          2. Images without descriptions (7 seconds each): Standalone images without any accompanying text.

        </p>
        <p>
          <br></br>
        <i><b>Note:</b> Unlike the base game, Faces Game 2 is randomized – play a few times for different facial expressions.</i></p>

        <button className="grey-button" onClick={() => navigate('transition')}>
          Begin Game
        </button>
      </div>
    </div>
  );
};

export default InstructionScreen;
