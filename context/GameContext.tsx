import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { GameState, Position, Tile, GridCell, GridSize } from '@/types/game';
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
  gridSize: GridSize;
  hapticsEnabled: boolean;
  move: (direction: number) => void;
  restart: () => void;
  undo: () => void;
  keepPlaying: () => void;
  setGridSize: (size: GridSize) => void;
  setHapticsEnabled: (enabled: boolean) => void;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gridSize, setGridSizeState] = useState<GridSize>(4);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
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

  // Load game data from storage
  useEffect(() => {
    const loadGameData = async () => {
      try {
        // Load best score
        const storedScore = await AsyncStorage.getItem('bestScore');
        if (storedScore) {
          setBestScore(parseInt(storedScore));
        }

        // Load preferences
        const storedPrefs = await AsyncStorage.getItem('gamePreferences');
        if (storedPrefs) {
          const prefs = JSON.parse(storedPrefs);
          setGridSizeState(prefs.gridSize || 4);
          setHapticsEnabledState(prefs.hapticsEnabled !== false);
        }

        // Load saved game state
        const savedGame = await AsyncStorage.getItem('savedGameState');
        if (savedGame) {
          const parsed = JSON.parse(savedGame);
          setGameState(parsed.gameState);
          setScore(parsed.score);
        }

        setInitialized(true);
      } catch (error) {
        console.error('Failed to load game data', error);
        setInitialized(true);
      }
    };

    loadGameData();
  }, []);

  // Initialize game only after loading stored data
  useEffect(() => {
    if (initialized && !gameState.grid.cells.some(row => row.some(cell => cell !== null))) {
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

  // Auto-save game state
  useEffect(() => {
    const saveGameState = async () => {
      try {
        await AsyncStorage.setItem('savedGameState', JSON.stringify({
          gameState,
          score,
        }));
      } catch (error) {
        console.error('Failed to save game state', error);
      }
    };

    if (initialized) {
      saveGameState();
    }
  }, [gameState, score, initialized]);

  // Initialize game with two random tiles
  const initGame = useCallback(() => {
    let newGrid = createGrid(gridSize);
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);

    setGameState({
      grid: newGrid,
      size: gridSize,
      over: false,
      won: false,
      keepPlaying: false,
      previousState: null,
      previousScore: 0,
    });

    setScore(0);
  }, [gridSize]);

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
      // Haptic feedback for movement
      if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Add a new random tile
      grid = addRandomTile(grid);

      // Update score
      const newScore = score + result.scoreGain;
      setScore(newScore);

      // Haptic feedback for merge (stronger if score gained)
      if (result.scoreGain > 0 && hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Update best score if needed
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
    }

    // Check if won
    const won = checkWin(grid) && !gameState.won;

    // Haptic feedback for winning
    if (won && hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Check if game over regardless of movement
    const over = !won && checkGameOver(grid, gameState.size);

    // Haptic feedback for game over
    if (over && hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    if (result.moved) {
      // Update game state after a move
      setGameState(prevState => ({
        ...prevState,
        grid,
        over,
        won: won || prevState.won,
        previousState: previousGrid,
        previousScore,
      }));
    } else {
      // No movement - just update over and win status
      setGameState(prevState => ({
        ...prevState,
        over,
        won: won || prevState.won,
      }));
    }

    if (over) {
      incrementGamesPlayed();
    }
  }, [gameState, score, bestScore, hapticsEnabled]);

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

  // Update grid size
  const setGridSize = useCallback((size: GridSize) => {
    setGridSizeState(size);
    // Restart game with new size
    setTimeout(() => {
      let newGrid = createGrid(size);
      newGrid = addRandomTile(newGrid);
      newGrid = addRandomTile(newGrid);

      setGameState({
        grid: newGrid,
        size: size,
        over: false,
        won: false,
        keepPlaying: false,
        previousState: null,
        previousScore: 0,
      });

      setScore(0);
    }, 0);
  }, []);

  // Update haptics enabled
  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setHapticsEnabledState(enabled);
  }, []);

  const contextValue = {
    gameState,
    score,
    bestScore,
    gridSize,
    hapticsEnabled,
    move,
    restart,
    undo,
    keepPlaying,
    setGridSize,
    setHapticsEnabled,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
}