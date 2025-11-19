import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameStats, Achievement } from '@/types/game';
import { ACHIEVEMENTS, checkAchievements } from '@/utils/achievements';

interface StatsContextType {
  stats: GameStats;
  achievements: Achievement[];
  updateStats: (won: boolean, score: number, highestTile: number) => void;
  resetStats: () => void;
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestScore: 0,
  totalScore: 0,
  bestStreak: 0,
  currentStreak: 0,
  totalPlayTime: 0,
  highestTile: 0,
  achievements: ACHIEVEMENTS,
};

export const StatsContext = createContext<StatsContextType>({} as StatsContextType);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  // Load stats from storage
  useEffect(() => {
    const loadStats = async () => {
      try {
        const storedStats = await AsyncStorage.getItem('gameStats');
        if (storedStats) {
          const parsed = JSON.parse(storedStats);
          setStats(parsed);
          if (parsed.achievements) {
            setAchievements(parsed.achievements);
          }
        }
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    };

    loadStats();
  }, []);

  // Save stats to storage when they change
  useEffect(() => {
    const saveStats = async () => {
      try {
        const statsToSave = { ...stats, achievements };
        await AsyncStorage.setItem('gameStats', JSON.stringify(statsToSave));
      } catch (error) {
        console.error('Failed to save stats', error);
      }
    };

    saveStats();
  }, [stats, achievements]);

  const updateStats = useCallback((won: boolean, score: number, highestTile: number) => {
    setStats(prevStats => {
      const newStreak = won ? prevStats.currentStreak + 1 : 0;
      const newStats = {
        ...prevStats,
        gamesPlayed: prevStats.gamesPlayed + 1,
        gamesWon: won ? prevStats.gamesWon + 1 : prevStats.gamesWon,
        bestScore: Math.max(prevStats.bestScore, score),
        totalScore: prevStats.totalScore + score,
        currentStreak: newStreak,
        bestStreak: Math.max(prevStats.bestStreak, newStreak),
        highestTile: Math.max(prevStats.highestTile, highestTile),
      };

      // Check for new achievements
      const updatedAchievements = checkAchievements(
        { won, grid: { size: 4, cells: [] } },
        score,
        newStats,
        achievements
      );
      setAchievements(updatedAchievements);

      return newStats;
    });
  }, [achievements]);

  const resetStats = useCallback(async () => {
    setStats(defaultStats);
    setAchievements(ACHIEVEMENTS);
    try {
      await AsyncStorage.removeItem('gameStats');
    } catch (error) {
      console.error('Failed to reset stats', error);
    }
  }, []);

  const contextValue = {
    stats,
    achievements,
    updateStats,
    resetStats,
  };

  return <StatsContext.Provider value={contextValue}>{children}</StatsContext.Provider>;
}
