import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePreferences } from '@/hooks/usePreferences';

interface GameControlsProps {
  onRestart: () => void;
  onUndo: () => void;
}

export function GameControls({ onRestart, onUndo }: GameControlsProps) {
  const { theme } = usePreferences();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
        onPress={onRestart}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>New Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
        onPress={onUndo}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Undo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});