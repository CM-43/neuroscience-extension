// SequencesGame.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InstructionScreen from './InstructionScreen';
import TransitionScreen from './TransitionScreen';
import GameScreen from './GameScreen';
import SummaryScreen from './SummaryScreen';
import StrategyTipsScreen from './StrategyTipsScreen';

const SequencesGame = ({onComplete}) => {
  return (
    <Routes>
      <Route path="/" element={<InstructionScreen />} />
      <Route path="transition" element={<TransitionScreen />} />
      <Route path="game" element={<GameScreen onComplete={onComplete} />} />
      <Route
        path="end-transition"
        element={<TransitionScreen text="Minigame Complete!" />}
      />
      <Route path="summary" element={<SummaryScreen />} />
      <Route
        path="strategy-tips"
        element={<StrategyTipsScreen url="1nOU9KXQ71G8PUNq3QwWdZk9dWpr1JZ_fVPXGr72h-mU" />}
      />
    </Routes>
  );
};

export default SequencesGame;
