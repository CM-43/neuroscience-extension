// SummaryScreen.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SequencesGame.css';

const SummaryScreen = () => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('sequencesGame'));
    if (!data || data.length < 20) {
      // If no data or incomplete, navigate away
      navigate('../');
      return;
    }
    setGameData(data);
  }, [navigate]);

  if (!gameData) {
    return <div>Loading...</div>;
  }

  // Calculate total correct
  const totalCorrect = gameData.filter(d => d.userAnswer === d.fifthNumber).length;

  return (
    <div className="sequences-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Score Report</h2>
        <div className="summary-stats">
          <div className="summary-item">
            <div className="summary-title">Total Correct:</div>
            <div className="summary-value" style={{backgroundColor:'#D4EDDA', border:'1.5px solid #b4b4b4'}}>{totalCorrect}/20</div>
          </div>
        </div>
        <div className="summary-table">
        <table >
          <thead>
            <tr>
              <th>#</th>
              <th>Sequence</th>
              <th>Pattern / Logic</th>
              <th>5<sup>th</sup> Number</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {gameData.map((round, index) => {
              const correct = round.userAnswer === round.fifthNumber;
              const answerDisplay = round.userAnswer !== null ? round.userAnswer : '-';
              return (
                <tr key={index}>
                  <td style={{width:'50px'}}>{round.round}</td>
                  <td  style={{fontWeight:'bold'}}>{round.sequence.join(', ')}</td>
                  <td style={{ fontSize: '16px', maxWidth: '200px' }}>{round.pattern}</td>
                  <td style={{fontWeight:'bold'}}>{round.fifthNumber}</td>
                  <td
                    style={{
                      backgroundColor: correct ? '#D4EDDA' : '#F8D7DA',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    {answerDisplay}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
              localStorage.removeItem('sequencesGame');
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
