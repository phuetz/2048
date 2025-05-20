import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface GameMessageProps {
  won: boolean;
  over: boolean;
  onRestart: () => void;
  onUndo: () => void;
  onKeepPlaying: () => void;
}

export function GameMessage({ won, over, onRestart, onUndo, onKeepPlaying }: GameMessageProps) {
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      <Text style={styles.message}>{won ? 'You Win!' : 'Game Over!'}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={onUndo}>
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
        
        {won && (
          <TouchableOpacity style={styles.button} onPress={onKeepPlaying}>
            <Text style={styles.buttonText}>Keep Going</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Platform.select({
      android: 'rgba(238, 228, 218, 0.85)',
      default: 'rgba(238, 228, 218, 0.73)'
    }),
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  message: {
    fontSize: Platform.OS === 'android' ? 42 : 48,
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: Platform.OS === 'android' ? 15 : 20,
    fontFamily: Platform.select({
      android: 'sans-serif-condensed',
      default: undefined
    }),
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    gap: 10,
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