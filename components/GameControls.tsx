import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GameControlsProps {
  onRestart: () => void;
  onUndo: () => void;
}

export function GameControls({ onRestart, onUndo }: GameControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={onUndo}>
        <Text style={styles.buttonText}>Undo</Text>
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
    backgroundColor: '#8f7a66',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 3,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});