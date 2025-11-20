import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence } from 'react-native-reanimated';
import { usePreferences } from '@/hooks/usePreferences';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

export function ScoreBoard({ score, bestScore }: ScoreBoardProps) {
  const { theme } = usePreferences();
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
      <View style={[styles.scoreContainer, { backgroundColor: theme.scoreBackground }]}>
        <Text style={[styles.scoreLabel, { color: theme.tileLightText }]}>SCORE</Text>
        <Text style={[styles.scoreValue, { color: theme.buttonText }]}>{score}</Text>
        {scoreAddition > 0 && (
          <Animated.Text style={[styles.scoreAddition, additionStyle, { color: theme.primary }]}>
            +{scoreAddition}
          </Animated.Text>
        )}
      </View>

      <View style={[styles.scoreContainer, { backgroundColor: theme.scoreBackground }]}>
        <Text style={[styles.scoreLabel, { color: theme.tileLightText }]}>BEST</Text>
        <Text style={[styles.scoreValue, { color: theme.buttonText }]}>{bestScore}</Text>
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
    borderRadius: 8,
    padding: 12,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  scoreAddition: {
    position: 'absolute',
    top: -20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
