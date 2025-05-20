import React from 'react';
import { GameContext } from '@/context/GameContext';

export function useGame() {
  const context = React.useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
}