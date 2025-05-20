import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '@/hooks/useGame';
import { GameBoard } from '@/components/GameBoard';
import { ScoreBoard } from '@/components/ScoreBoard';
import { GameMessage } from '@/components/GameMessage';
import { GameControls } from '@/components/GameControls';

export default function GameScreen() {
  const {
    gameState,
    score,
    bestScore,
    move,
    restart,
    undo,
    keepPlaying,
  } = useGame();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, Platform.OS === 'android' && styles.titleAndroid]}>2048</Text>
        <ScoreBoard score={score} bestScore={bestScore} />
      </View>

      <View style={styles.gameContainer}>
        <GameBoard
          grid={gameState.grid}
          size={gameState.size}
          onSwipe={move}
        />
        
        {(gameState.over || (gameState.won && !gameState.keepPlaying)) && (
          <GameMessage
            won={gameState.won}
            over={gameState.over}
            onRestart={restart}
            onUndo={undo}
            onKeepPlaying={keepPlaying}
          />
        )}
      </View>

      <GameControls onRestart={restart} onUndo={undo} />

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {Platform.OS === 'web' 
            ? 'Use arrow keys or swipe to move tiles' 
            : 'Swipe to move tiles'}
        </Text>
        <Text style={styles.instructionText}>Join the tiles with the same number!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      android: '#fff8ef',
      default: '#faf8ef'
    }),
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Platform.OS === 'android' ? 10 : 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#776e65',
  },
  titleAndroid: {
    fontSize: 42,
    fontFamily: Platform.select({
      android: 'sans-serif-condensed',
      default: undefined
    }),
  },
  gameContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Platform.OS === 'android' ? 10 : 20,
  },
  instructions: {
    marginTop: Platform.OS === 'android' ? 10 : 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#776e65',
    fontSize: Platform.OS === 'android' ? 14 : 16,
    marginBottom: 5,
    fontFamily: Platform.select({
      android: 'sans-serif',
      default: undefined
    }),
  },
});