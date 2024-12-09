// ArrowsGame/InstructionScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MagnitudesGame.css';

const InstructionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="magnitudes-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Instructions</h2>
        <p>
          You will be shown 2 items each round for a total of 10 rounds; the items can be either fractions or an image with
          both yellow and green dots. You will have 5 seconds each round to pick 1 of the 2 items.

          <ol style={{ paddingLeft: '20px', paddingBottom: '0px' }}>
            <li>  If it is a fraction, pick the larger fraction.
            </li>
            <li>
               If it is an image, pick the one with the higher proportion of yellow dots.            <br />
            </li>
          </ol>
        </p>
        <button className="grey-button" onClick={() => navigate('transition')}>
          Begin Game
        </button>
      </div>
    </div>
  );
};

export default InstructionScreen;
