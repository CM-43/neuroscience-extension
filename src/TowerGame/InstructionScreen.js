// TowerGame/InstructionScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TowerGame.css';

const InstructionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="tower-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>

      <div className="game-box">
        <h2>Instructions</h2>
        <p>
          You will be given 2 sets of 3 towers each, and your goal is to match
          the bottom set to the top set within 2 minutes.
        </p>
        <ol>
          <li>
            To move a disk, click on it to lift it, then click on a tower to
            move it to said tower (note: you can only move the top-most disk,
            and the disk will be moved to the top of the target tower)
          </li>
          <li>
            Undo a move by clicking on{' '}
            <span className="light-blue-button" style={{padding:'3px 30px',lineHeight:'1'}}>Undo</span>
          </li>
          <li>
            Start over by clicking on{' '}
            <span className="dark-blue-button" style={{padding:'3px 30px',lineHeight:'1'}}>Restart</span>
          </li>
        </ol>
        <button className="grey-button" onClick={() => navigate('transition')}>
          Begin Game
        </button>
      </div>
    </div>
  );
};

export default InstructionScreen;
