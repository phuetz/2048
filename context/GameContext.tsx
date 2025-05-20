import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Position, Tile, GridCell } from '@/types/game';
import { 
  createGrid,
  addRandomTile,
  moveTiles,
  checkGameOver,
  checkWin,
  prepareGrid
} from '@/utils/gameUtils';

interface GameContextType {
  gameState: GameState;
  score: number;
  bestScore: number;
  move: (direction: number) => void;
  restart: () => void;
  undo: () => void;
  keepPlaying: () => void;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialGrid = createGrid(4);
    return {
      grid: initialGrid,
      size: 4,
      over: false,
      won: false,
      keepPlaying: false,
      previousState: null,
      previousScore: 0,
    };
  });
  
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Load best score from storage
  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const storedScore = await AsyncStorage.getItem('bestScore');
        if (storedScore) {
          setBestScore(parseInt(storedScore));
        }
        
        // Only initialize the game after loading the best score
        setInitialized(true);
      } catch (error) {
        console.error('Failed to load best score', error);
        // Still mark as initialized to prevent the app from hanging
        setInitialized(true);
      }
    };

    loadBestScore();
  }, []);

  // Initialize game only after loading stored data
  useEffect(() => {
    if (initialized) {
      initGame();
    }
  }, [initialized]);

  // Save best score to storage when it changes
  useEffect(() => {
    const saveBestScore = async () => {
      try {
        await AsyncStorage.setItem('bestScore', bestScore.toString());
      } catch (error) {
        console.error('Failed to save best score', error);
      }
    };

    if (bestScore > 0) {
      saveBestScore();
    }
  }, [bestScore]);

  // Initialize game with two random tiles
  const initGame = useCallback(() => {
    let newGrid = createGrid(4);
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    
    setGameState({
      grid: newGrid,
      size: 4,
      over: false,
      won: false,
      keepPlaying: false,
      previousState: null,
      previousScore: 0,
    });
    
    setScore(0);
  }, []);

  // Move tiles in a direction
  const move = useCallback((direction: number) => {
    if (!gameState || gameState.over || (gameState.won && !gameState.keepPlaying)) {
      return;
    }

    // Save current state for undo
    const previousGrid = {
      ...gameState.grid,
      cells: gameState.grid.cells.map(row => [...row])
    };
    const previousScore = score;

    // Prepare tiles for movement
    let grid = prepareGrid(gameState.grid);
    
    // Move tiles
    const result = moveTiles(grid, direction, gameState.size);
    grid = result.grid;
    
    if (result.moved) {
      // Add a new random tile
      grid = addRandomTile(grid);
      
      // Update score
      const newScore = score + result.scoreGain;
      setScore(newScore);
      
      // Update best score if needed
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
      
      // Check if won
      const won = checkWin(grid) && !gameState.won;
      
      // Check if game over
      const over = !won && checkGameOver(grid, gameState.size);
      
      // Update game state
      setGameState(prevState => ({
        ...prevState,
        grid,
        over,
        won: won || prevState.won,
        previousState: previousGrid,
        previousScore,
      }));
      
      // Count games played
      if (over) {
        incrementGamesPlayed();
      }
    }
  }, [gameState, score, bestScore]);

  // Restart the game
  const restart = useCallback(() => {
    incrementGamesPlayed();
    initGame();
  }, [initGame]);

  // Undo the last move
  const undo = useCallback(() => {
    if (gameState?.previousState) {
      setGameState(prevState => ({
        ...prevState,
        grid: prevState.previousState!,
        over: false,
        won: false,
        previousState: null,
      }));
      
      setScore(gameState.previousScore);
    }
  }, [gameState]);

  // Keep playing after winning
  const keepPlaying = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      keepPlaying: true,
      over: false,
    }));
  }, []);

  // Increment games played counter
  const incrementGamesPlayed = useCallback(async () => {
    try {
      const gamesPlayed = await AsyncStorage.getItem('gamesPlayed') || '0';
      const newCount = parseInt(gamesPlayed) + 1;
      await AsyncStorage.setItem('gamesPlayed', newCount.toString());
      return newCount;
    } catch (error) {
      console.error('Failed to update games played count', error);
      return 0;
    }
  }, []);

  const contextValue = {
    gameState,
    score,
    bestScore,
    move,
    restart,
    undo,
    keepPlaying,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
}