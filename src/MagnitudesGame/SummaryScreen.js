import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MagnitudesGame.css'; // Same or similar styling as the game screen
import { Scrollbar } from 'react-scrollbars-custom';


const SummaryScreen = () => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalRoundData, setModalRoundData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('magnitudesGame'));
    if (!data || data.length < 10) {
      // If no data or incomplete, navigate away
      navigate('../');
      return;
    }
    setGameData(data);
  }, [navigate]);

  if (!gameData) {
    return <div>Loading...</div>;
  }

  // Calculate aggregates
  const totalCorrect = gameData.filter(d => d.correct).length;
  const fractionRounds = gameData.filter(d => d.type === 'fraction');
  const circleRounds = gameData.filter(d => d.type === 'circle');

  const fractionCorrect = fractionRounds.filter(d => d.correct).length;
  const circleCorrect = circleRounds.filter(d => d.correct).length;

  const handleClickView = (roundData) => {
    setModalRoundData(roundData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalRoundData(null);
  };

  return (
    <div className="magnitudes-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <h2>Score Report</h2>
        <div className="summary-stats">
          <div className="summary-item">
            <div className="summary-title">Total Correct:</div>
            <div className="summary-value" style={{ backgroundColor: '#D4EDDA', border: '1.5px solid #b4b4b4' }}>{totalCorrect}/10</div>
          </div>
          <div className="summary-item">
            <div className="summary-title">Fractions Correct:</div>
            <div className="summary-value">{fractionCorrect}/{fractionRounds.length}</div>
          </div>
          <div className="summary-item" style={{ marginBottom: '0px' }}>
            <div className="summary-title">Circles Correct:</div>
            <div className="summary-value">{circleCorrect}/{circleRounds.length}</div>
          </div>
        </div>
        <div className='summary-table'>
          <table>
            <thead>
              <tr>
                <th>Round #</th>
                <th>Type</th>
                <th>Option 1 (Left)*</th>
                <th>Option 2 (Right)*</th>
                <th>Choice Correct?</th>
              </tr>
            </thead>
            <tbody >
              {gameData.map((round, index) => {
                const chosenIsLeft = round.userChoice === 1;
                const chosenIsRight = round.userChoice === 2;

                // Format options
                let opt1Text, opt2Text;
                if (round.type === 'fraction') {
                  opt1Text = `${round.option1.numerator}/${round.option1.denominator}`;
                  opt2Text = `${round.option2.numerator}/${round.option2.denominator}`;
                } else {
                  // Circle
                  const total1 = round.option1.yellowCount + round.option1.blueCount;
                  const total2 = round.option2.yellowCount + round.option2.blueCount;
                  opt1Text = `${round.option1.yellowCount}/${total1}`;
                  opt2Text = `${round.option2.yellowCount}/${total2}`;
                }

                return (
                  <tr key={index}>
                    <td>{round.round}</td>
                    <td>
                      {round.type === 'fraction' ? 'Fraction' : 'Circle'}
                      {round.type === 'circle' && (
                        <span
                          className="click-to-view"
                          onClick={() => handleClickView(round)}
                          style={{ marginLeft: '5px', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          (click to view)
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: chosenIsLeft ? 'bold' : 'normal' }}>{opt1Text}</td>
                    <td style={{ fontWeight: chosenIsRight ? 'bold' : 'normal' }}>{opt2Text}</td>
                    <td style={{ backgroundColor: round.correct ? '#D4EDDA' : '#F8D7DA', padding: '0px' }}>
                      <span style={{ color: round.correct ? 'green' : 'red', fontWeight: 'bold', fontSize: '28px', padding: '0px' }}>{round.correct ? '✓' : 'X'}</span>


                    </td>
                  </tr>
                );
              })}
            </tbody>


          </table>

        </div>
        <span style={{ paddingLeft: '30px', opacity: '0.8' }}> <i> * Chosen options are bolded; for circle rounds, the fractions represent the proportion of circles that are yellow</i></span>
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
              localStorage.removeItem('magnitudesGame');
            }}
          >
            Play Again
          </button>
        </div>
      </div>
      {showModal && modalRoundData && (
          <div className="modal-overlay">
              <div className="modal-box">
                <div className='preview-box'>
                  <div className="option-box circle-preview">
                    {modalRoundData.option1.circles.map((c, i) => (
                      <div key={i}
                        style={{
                          backgroundColor: c.color,
                          position: 'absolute',
                          borderRadius: '50%',
                          left: `${c.x - c.radius}px`,
                          top: `${c.y - c.radius}px`,
                          width: `${c.radius * 2}px`,
                          height: `${c.radius * 2}px`,
                          border: '0px solid #333'
                        }}
                      ></div>


                    ))}
                  </div>
                  <p style={{ opacity: modalRoundData.userChoice === 1 ? '1' : '0' }}>You picked this</p>

                </div>
                <div className='preview-box'>
                  <div className="option-box circle-preview" >
                    {modalRoundData.option2.circles.map((c, i) => (
                      <div key={i}
                        style={{
                          backgroundColor: c.color,
                          position: 'absolute',
                          borderRadius: '50%',
                          left: `${c.x - c.radius}px`,
                          top: `${c.y - c.radius}px`,
                          width: `${c.radius * 2}px`,
                          height: `${c.radius * 2}px`,
                          border: '0px solid #333'
                        }}
                      ></div>
                    ))}
                  </div>
                  <p style={{ opacity: modalRoundData.userChoice === 1 ? '0' : '1' }}>You picked this</p>
                </div>

              </div>
              <button className="close-button" onClick={closeModal}>X</button>

            </div>


        )}

    </div>
  );
};

export default SummaryScreen;
