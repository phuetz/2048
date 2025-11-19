import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GamePreferences, ThemeMode, GridSize, GameMode } from '@/types/game';
import { ThemeColors, lightTheme, darkTheme } from '@/constants/theme';

interface PreferencesContextType {
  preferences: GamePreferences;
  theme: ThemeColors;
  updateTheme: (theme: ThemeMode) => void;
  updateGridSize: (size: GridSize) => void;
  updateSoundEnabled: (enabled: boolean) => void;
  updateHapticsEnabled: (enabled: boolean) => void;
  updateGameMode: (mode: GameMode) => void;
}

const defaultPreferences: GamePreferences = {
  theme: 'light',
  gridSize: 4,
  soundEnabled: true,
  hapticsEnabled: true,
  gameMode: 'classic',
};

export const PreferencesContext = createContext<PreferencesContextType>({} as PreferencesContextType);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<GamePreferences>(defaultPreferences);
  const [theme, setTheme] = useState<ThemeColors>(lightTheme);

  // Load preferences from storage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem('gamePreferences');
        if (stored) {
          const loadedPrefs = JSON.parse(stored);
          setPreferences(loadedPrefs);
          setTheme(loadedPrefs.theme === 'dark' ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error('Failed to load preferences', error);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to storage when they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem('gamePreferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save preferences', error);
      }
    };

    savePreferences();
  }, [preferences]);

  const updateTheme = useCallback((newTheme: ThemeMode) => {
    setPreferences(prev => ({ ...prev, theme: newTheme }));
    setTheme(newTheme === 'dark' ? darkTheme : lightTheme);
  }, []);

  const updateGridSize = useCallback((size: GridSize) => {
    setPreferences(prev => ({ ...prev, gridSize: size }));
  }, []);

  const updateSoundEnabled = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, soundEnabled: enabled }));
  }, []);

  const updateHapticsEnabled = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, hapticsEnabled: enabled }));
  }, []);

  const updateGameMode = useCallback((mode: GameMode) => {
    setPreferences(prev => ({ ...prev, gameMode: mode }));
  }, []);

  const contextValue = {
    preferences,
    theme,
    updateTheme,
    updateGridSize,
    updateSoundEnabled,
    updateHapticsEnabled,
    updateGameMode,
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
}
