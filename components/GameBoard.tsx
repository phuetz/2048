import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tile } from './Tile';
import { useWindowDimensions } from 'react-native';
import { Grid } from '@/types/game';

interface GameBoardProps {
  grid: Grid;
  size: number;
  onSwipe: (direction: number) => void;
}

// Lower threshold for more responsive touch
const SWIPE_THRESHOLD = Platform.OS === 'android' ? 20 : 20;
// Lower velocity threshold for more responsive touch
const SWIPE_VELOCITY_THRESHOLD = Platform.OS === 'android' ? 150 : 120;

export function GameBoard({ grid, size, onSwipe }: GameBoardProps) {
  // Calculate board dimensions based on screen size
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const screenSize = isPortrait ? width : height;
  const boardSize = Math.min(screenSize - 40, 500);
  const cellSize = (boardSize - (size + 1) * 15) / size;
  const cellMargin = 15;

  // Improved swipe gesture handling
  const swipeGesture = Gesture.Pan()
    .minDistance(10)  // Lower minimum distance for better sensitivity
    .activeOffsetX([-5, 5])  // More sensitive activation threshold
    .activeOffsetY([-5, 5])  // More sensitive activation threshold
    .minVelocity(SWIPE_VELOCITY_THRESHOLD)
    .onEnd((event) => {
      // Allow gesture handling on all platforms
      const { translationX, translationY, velocityX, velocityY } = event;
      
      // Handle diagonal swipes more gracefully
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);

      // Ensure minimum movement for gesture recognition
      if (Math.max(absX, absY) < SWIPE_THRESHOLD) {
        return;
      }
      
      // Determine primary direction of swipe
      const isHorizontal = absX > absY;
      
      if (isHorizontal) {
        // Horizontal swipe (1: right, 3: left)
        onSwipe(translationX > 0 ? 1 : 3);
      } else {
        // Vertical swipe (0: up, 2: down)
        onSwipe(translationY > 0 ? 2 : 0);
      }
    });

  // Keyboard event handling (for web)
  React.useEffect(() => {
    if (Platform.OS !== 'web') return;

    function handleKeyDown(event: KeyboardEvent) {
      const keyMap: Record<string, number> = {
        'ArrowUp': 0,
        'ArrowRight': 1,
        'ArrowDown': 2,
        'ArrowLeft': 3,
        'w': 0,
        'd': 1,
        's': 2,
        'a': 3
      };

      const direction = keyMap[event.key];
      if (typeof direction === 'number') {
        event.preventDefault();
        onSwipe(direction);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSwipe]);

  // Generate rows and cells for the grid
  const renderCells = () => {
    const rows = [];
    
    for (let x = 0; x < size; x++) {
      const row = [];
      
      for (let y = 0; y < size; y++) {
        row.push(
          <View 
            key={`cell-${x}-${y}`} 
            style={[
              styles.cell, 
              { 
                width: cellSize, 
                height: cellSize,
                marginRight: y < size - 1 ? cellMargin : 0,
              }
            ]} 
          />
        );
      }
      
      rows.push(
        <View 
          key={`row-${x}`} 
          style={[
            styles.row, 
            { 
              marginBottom: x < size - 1 ? cellMargin : 0,
            }
          ]}
        >
          {row}
        </View>
      );
    }
    
    return rows;
  };

  // Map tiles to their positions
  const renderTiles = () => {
    const tiles = [];
    
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const tile = grid.cellContent({ x, y });
        
        if (tile) {
          tiles.push(
            <Tile
              key={`tile-${tile.id}-${tile.position.x}-${tile.position.y}`}
              value={tile.value}
              x={tile.position.x}
              y={tile.position.y}
              cellSize={cellSize}
              cellMargin={cellMargin}
              isNew={tile.isNew}
              isMerged={tile.isMerged}
            />
          );
        }
      }
    }
    
    return tiles;
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={swipeGesture}>
        <View style={[styles.boardContainer, { width: boardSize, height: boardSize }]}>
          {/* Grid background */}
          <View style={styles.grid}>{renderCells()}</View>
          
          {/* Tiles */}
          <View style={styles.tileContainer}>{renderTiles()}</View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    position: 'relative',
    backgroundColor: '#bbada0',
    borderRadius: 6,
    padding: 15,
  },
  grid: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    backgroundColor: 'rgba(238, 228, 218, 0.35)',
    borderRadius: 3,
  },
  tileContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
  },
});