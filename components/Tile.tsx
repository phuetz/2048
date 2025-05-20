import React, { memo } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  Layout
} from 'react-native-reanimated';

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
  // Animation values
  const scale = useSharedValue(isNew ? 0 : 1);
  
  React.useEffect(() => {
    if (isNew) {
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.1, { duration: 150 }),
        withTiming(1, { duration: 100 })
      );
    } else if (isMerged) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [isNew, isMerged, scale]);

  // Calculate position
  const left = y * (cellSize + cellMargin);
  const top = x * (cellSize + cellMargin);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  // Determine font size based on value
  const getFontSize = () => {
    if (value >= 1024) return Platform.OS === 'android' ? 18 : 20;
    if (value >= 128) return Platform.OS === 'android' ? 22 : 24;
    return Platform.OS === 'android' ? 28 : 32;
  };

  return (
    <Animated.View
      style={[
        styles.tile,
        styles[`tile${value}`] || styles.tileSuper,
        {
          width: cellSize,
          height: cellSize,
          left,
          top,
        },
        animatedStyle,
      ]}
      layout={Layout.springify()}
      entering={FadeIn}
    >
      <Text style={[
        styles.tileText,
        { 
          fontSize: getFontSize(),
          fontFamily: Platform.select({
            android: 'sans-serif-condensed',
            default: undefined
          }) 
        },
        value >= 8 && styles.lightText
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
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    fontWeight: 'bold',
    color: '#776e65',
  },
  lightText: {
    color: '#f9f6f2',
  },
  tile2: {
    backgroundColor: '#eee4da',
  },
  tile4: {
    backgroundColor: '#ede0c8',
  },
  tile8: {
    backgroundColor: '#f2b179',
  },
  tile16: {
    backgroundColor: '#f59563',
  },
  tile32: {
    backgroundColor: '#f67c5f',
  },
  tile64: {
    backgroundColor: '#f65e3b',
  },
  tile128: {
    backgroundColor: '#edcf72',
  },
  tile256: {
    backgroundColor: '#edcc61',
  },
  tile512: {
    backgroundColor: '#edc850',
  },
  tile1024: {
    backgroundColor: '#edc53f',
  },
  tile2048: {
    backgroundColor: '#edc22e',
  },
  tileSuper: {
    backgroundColor: '#3c3a32',
  },
});