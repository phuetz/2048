import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeIn, BounceIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { usePreferences } from '@/hooks/usePreferences';

interface GameMessageProps {
  won: boolean;
  over: boolean;
  onRestart: () => void;
  onUndo: () => void;
  onKeepPlaying: () => void;
}

export function GameMessage({ won, over, onRestart, onUndo, onKeepPlaying }: GameMessageProps) {
  const { theme } = usePreferences();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (won) {
      // Victory celebration animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        3
      );
    }
  }, [won]);

  const animatedMessageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      style={[styles.container, { backgroundColor: theme.overlayBackground }]}
    >
      <Animated.Text
        style={[
          styles.message,
          { color: won ? theme.tile512 : theme.text },
          animatedMessageStyle
        ]}
      >
        {won ? '🎉 You Win! 🎉' : 'Game Over!'}
      </Animated.Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.buttonBackground }]}
          onPress={onRestart}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.buttonBackground }]}
          onPress={onUndo}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Undo</Text>
        </TouchableOpacity>

        {won && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onKeepPlaying}
          >
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Keep Going</Text>
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  message: {
    fontSize: Platform.OS === 'android' ? 44 : 52,
    fontWeight: 'bold',
    marginBottom: Platform.OS === 'android' ? 20 : 24,
    fontFamily: Platform.select({
      android: 'sans-serif-condensed',
      default: undefined
    }),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    gap: 12,
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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});