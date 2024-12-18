import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css';

const games = [
  { id: 1, name: 'Magnitudes Game' },
  { id: 4, name: 'Letters Game' },
  { id: 2, name: 'Sequences Game' },
  { id: 5, name: 'Tower Game 2' },
  { id: 3, name: 'Shapes Game' },
  { id: 6, name: 'Faces Game 2' },

];

const MainMenu = ({ completedGames, onReset }) => {
  return (
    <div className="main-menu">
      <button className="reset-button" onClick={onReset}>
        Reset
      </button>
      <br></br><br></br><br></br>
      <h2>Select the minigame you would like to play:</h2>
      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-item">
            <div
              className={`circle ${
                completedGames.includes(game.id) ? 'completed' : ''
              }`}
            >
              {completedGames.includes(game.id) ? (
                <span>&#10003;</span> // Check mark
              ) : (
                <span>{game.id}</span>
              )}
            </div>
            <Link to={completedGames.includes(game.id) ? `/game/${game.id}/summary`:`/game/${game.id}`} className="game-button">
              {game.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
