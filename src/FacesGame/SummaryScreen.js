// FacesGame/SummaryScreen.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FacesGame.css';

const SummaryScreen = () => {
  const navigate = useNavigate();
  if (localStorage.getItem('facesGame') === null) {
    navigate('../');
  }
  const [userResponses, setUserResponses] = useState([]);

  useEffect(() => {
    const responses = JSON.parse(localStorage.getItem('facesGame')) || [];
    setUserResponses(responses);
  }, []);

  const totalWithText = userResponses.filter((resp) => resp.category === 'withText').length;
  const correctWithText = userResponses.filter(
    (resp) => resp.category === 'withText' && resp.isCorrect
  ).length;

  const totalWithoutText = userResponses.filter((resp) => resp.category === 'withoutText').length;
  const correctWithoutText = userResponses.filter(
    (resp) => resp.category === 'withoutText' && resp.isCorrect
  ).length;

  return (
    <div className="faces-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Score Report</h2>
        <div className="summary-content">
          <div className="summary-item">
            <div className="summary-title">Image with text - Correct</div>
            <div className="summary-value">
              {correctWithText}/{totalWithText}
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-title">Image only - Correct</div>
            <div className="summary-value">
              {correctWithoutText}/{totalWithoutText}
            </div>
          </div>
        </div>
        <div className="summary-buttons">
          <button
            className="grey-buttons"
            onClick={() => navigate('../strategy-tips')}
          >
            Strategy & Tips
          </button>
          <button
            className="grey-buttons"
            onClick={() => {navigate('../');
            localStorage.removeItem('facesGame');}
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
