import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence } from 'react-native-reanimated';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

export function ScoreBoard({ score, bestScore }: ScoreBoardProps) {
  const [previousScore, setPreviousScore] = React.useState(score);
  const additionOpacity = useSharedValue(0);
  const additionTranslateY = useSharedValue(0);
  const [scoreAddition, setScoreAddition] = React.useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (score > previousScore) {
      // Ensure only one timeout is active at a time
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setScoreAddition(score - previousScore);
      // Animate score addition
      additionOpacity.value = 1;
      additionTranslateY.value = 0;
      
      // Animation sequence
      additionOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 500 })
      );
      
      additionTranslateY.value = withTiming(-30, { duration: 600 });

      // Update previous score after animation
      timeoutRef.current = setTimeout(() => {
        setPreviousScore(score);
        setScoreAddition(0);
      }, 600);
    }
  }, [score, previousScore]);

  const additionStyle = useAnimatedStyle(() => {
    return {
      opacity: additionOpacity.value,
      transform: [{ translateY: additionTranslateY.value }]
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        {scoreAddition > 0 && (
          <Animated.Text style={[styles.scoreAddition, additionStyle]}>
            +{scoreAddition}
          </Animated.Text>
        )}
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>BEST</Text>
        <Text style={styles.scoreValue}>{bestScore}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  scoreContainer: {
    position: 'relative',
    backgroundColor: '#bbada0',
    borderRadius: 6,
    padding: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#eee4da',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreAddition: {
    position: 'absolute',
    top: -20,
    color: 'rgba(119, 110, 101, 0.9)',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
