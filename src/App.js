// App.js
import React, { useState,useEffect } from 'react';
import { HashRouter  as Router, Route, Routes } from 'react-router-dom';
import MainMenu from './MainMenu';
import Login from './Login/Login';
import MagnitudesGame from './MagnitudesGame/MagnitudesGame';


// Import other games as needed

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [completedGames, setCompletedGames] = useState([]);

  useEffect(() => {
    // Check login status from localStorage
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    // Load completed games from localStorage
    const savedCompletedGames = JSON.parse(localStorage.getItem('completedGamesExtension')) || [];
    setCompletedGames(savedCompletedGames);
  }, []);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleGameCompletion = (gameId) => {
    if (!completedGames.includes(gameId)) {
      const updatedCompletedGames = [...completedGames, gameId];
      setCompletedGames(updatedCompletedGames);
      // Save to localStorage
      localStorage.setItem('completedGamesExtension', JSON.stringify(updatedCompletedGames));
    }
  };

  const handleReset = () => {
    setCompletedGames([]);
    localStorage.removeItem('completedGamesExtension');
  };





  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainMenu completedGames={completedGames} onReset={handleReset} />}
        />
        <Route
          path="/game/1/*"
          element={< MagnitudesGame onComplete={() => handleGameCompletion(1)} />}
        />
        <Route
          path="/game/2/*"
          // element={<SequencesGame onComplete={() => handleGameCompletion(2)} />}
        />
        <Route
          path="/game/3/*"
          // element={<ShapesGame onComplete={() => handleGameCompletion(3)} />}
        />
        <Route
          path="/game/4/*"
          // element={< LettersGame onComplete={() => handleGameCompletion(4)} />}
        />
        <Route
          path="/game/5/*"
          // element={< TowerGame2 onComplete={() => handleGameCompletion(5)} />}
        />
        <Route
          path="/game/6/*"
          // element={<FacesGame2 onComplete={() => handleGameCompletion(6)} />}
        />

        {/* Add routes for other games */}
      </Routes>
    </Router>
  );
}

export default App;
