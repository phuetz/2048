import React, { memo } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withSpring,
  FadeIn,
  Layout,
  SlideInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { usePreferences } from '@/hooks/usePreferences';
import { getTileColor, getTileTextColor } from '@/constants/theme';

interface TileProps {
  value: number;
  x: number;
  y: number;
  cellSize: number;
  cellMargin: number;
  isNew?: boolean;
  isMerged?: boolean;
}

function TileComponent({ value, x, y, cellSize, cellMargin, isNew, isMerged }: TileProps) {
  const { theme } = usePreferences();

  // Animation values
  const scale = useSharedValue(isNew ? 0 : 1);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isNew) {
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, {
          damping: 15,
          stiffness: 150,
        })
      );
    } else if (isMerged) {
      scale.value = withSequence(
        withSpring(1.15, {
          damping: 10,
          stiffness: 200,
        }),
        withSpring(1, {
          damping: 12,
          stiffness: 150,
        })
      );
      rotation.value = withSequence(
        withTiming(2, { duration: 100 }),
        withTiming(-2, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [isNew, isMerged, scale, rotation]);

  // Calculate position
  const left = y * (cellSize + cellMargin);
  const top = x * (cellSize + cellMargin);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });

  // Determine font size based on value
  const getFontSize = () => {
    if (value >= 1024) return Platform.OS === 'android' ? 18 : 20;
    if (value >= 128) return Platform.OS === 'android' ? 22 : 24;
    return Platform.OS === 'android' ? 28 : 32;
  };

  const backgroundColor = getTileColor(value, theme);
  const textColor = getTileTextColor(value, theme);

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: cellSize,
          height: cellSize,
          left,
          top,
          backgroundColor,
        },
        animatedStyle,
      ]}
      layout={Layout.springify()}
      entering={ZoomIn.springify()}
    >
      <Text style={[
        styles.tileText,
        {
          fontSize: getFontSize(),
          color: textColor,
          fontFamily: Platform.select({
            android: 'sans-serif-condensed',
            default: undefined
          })
        },
      ]}>
        {value}
      </Text>
    </Animated.View>
  );
}

// Memoize the tile component to prevent unnecessary re-renders
export const Tile = memo(TileComponent);

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    borderRadius: 6,
    justifyContent: 'center',
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
  tileText: {
    fontWeight: 'bold',
  },
});