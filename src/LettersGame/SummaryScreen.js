// SummaryScreen.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LettersGame.css';

const SummaryScreen = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('lettersGame'));
    if (!stored) {
      navigate('../');
      return;
    }
    setData(stored);
  }, [navigate]);

  if (!data) return <div>Loading...</div>;

  const { correct, falseAlarm } = data;

  return (
    <div className="letters-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Score Report</h2>
        <div className="summary-stats">
          <div className="summary-item">
            <div className="summary-title">Total Correct:</div>
            <div className="summary-value" style={{backgroundColor:'#D4EDDA', border:'1.5px solid #b4b4b4'}}>{correct}/10</div>
          </div>
          <div className="summary-item">
            <div className="summary-title">Total Incorrect<br></br>
            (i.e., false alarms)</div>
            <div className="summary-value">{falseAlarm}</div>
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
            onClick={() => {
              navigate('../');
              localStorage.removeItem('lettersGame');
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;
