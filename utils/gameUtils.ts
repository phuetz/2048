import { Grid, Position, Tile, GridCell, MoveResult, Vector, Traversals, FarthestPosition } from '@/types/game';

// Create a new grid
export function createGrid(size: number): Grid {
  const cells: GridCell[][] = [];
  
  // Initialize cells
  for (let x = 0; x < size; x++) {
    cells[x] = [];
    for (let y = 0; y < size; y++) {
      cells[x][y] = null;
    }
  }
  
  return {
    cells,
    size,
    
    // Helper methods
    cellContent(position: Position): GridCell {
      if (this.withinBounds(position)) {
        return this.cells[position.x][position.y];
      } else {
        return null;
      }
    },
    
    cellOccupied(position: Position): boolean {
      return !!this.cellContent(position);
    },
    
    cellAvailable(position: Position): boolean {
      return !this.cellOccupied(position);
    },
    
    availableCells(): Position[] {
      const cells: Position[] = [];
      
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          if (!this.cells[x][y]) {
            cells.push({ x, y });
          }
        }
      }
      
      return cells;
    },
    
    withinBounds(position: Position): boolean {
      return position.x >= 0 && position.x < this.size &&
             position.y >= 0 && position.y < this.size;
    }
  };
}

// Add a random tile to the grid
export function addRandomTile(grid: Grid): Grid {
  const availableCells = grid.availableCells();
  
  if (availableCells.length > 0) {
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    
    const tile: Tile = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      position: randomCell,
      value,
      previousPosition: null,
      isNew: true,
      isMerged: false,
      mergedFrom: null,
    };
    
    // Place the tile on the grid
    grid.cells[randomCell.x][randomCell.y] = tile;
  }
  
  return grid;
}

// Prepare tiles for moving
export function prepareGrid(grid: Grid): Grid {
  for (let x = 0; x < grid.size; x++) {
    for (let y = 0; y < grid.size; y++) {
      const tile = grid.cells[x][y];
      
      if (tile) {
        // Reset tile states
        tile.previousPosition = { ...tile.position };
        tile.isNew = false;
        tile.isMerged = false;
        tile.mergedFrom = null;
      }
    }
  }
  
  return grid;
}

// Get vector for a direction
export function getVector(direction: number): Vector {
  const vectors: Vector[] = [
    { x: -1, y: 0 },  // Up
    { x: 0, y: 1 },   // Right
    { x: 1, y: 0 },   // Down
    { x: 0, y: -1 },  // Left
  ];
  
  return vectors[direction];
}

// Build traversal orders based on vector
export function buildTraversals(vector: Vector, size: number): Traversals {
  const traversals: Traversals = { x: [], y: [] };
  
  for (let i = 0; i < size; i++) {
    traversals.x.push(i);
    traversals.y.push(i);
  }
  
  // Always traverse from the edge in the direction of the vector
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();
  
  return traversals;
}

// Find the farthest position in a direction
export function findFarthestPosition(grid: Grid, position: Position, vector: Vector): FarthestPosition {
  let previous: Position;
  let current: Position = { ...position };
  
  do {
    previous = { ...current };
    current = {
      x: previous.x + vector.x,
      y: previous.y + vector.y
    };
  } while (grid.withinBounds(current) && grid.cellAvailable(current));
  
  return {
    farthest: previous,
    next: current
  };
}

// Move tiles in a direction
export function moveTiles(grid: Grid, direction: number, size: number): MoveResult {
  const vector = getVector(direction);
  const traversals = buildTraversals(vector, size);
  let moved = false;
  let scoreGain = 0;
  
  // Traverse the grid in the proper order
  traversals.x.forEach(x => {
    traversals.y.forEach(y => {
      const position: Position = { x, y };
      const tile = grid.cellContent(position);
      
      if (tile) {
        const positions = findFarthestPosition(grid, position, vector);
        const next = grid.cellContent(positions.next);
        
        // Check if we can merge
        if (next && next.value === tile.value && !next.isMerged && !tile.isMerged) {
          // Create a merged tile
          const merged: Tile = {
            id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            position: positions.next,
            value: tile.value * 2,
            previousPosition: { ...tile.position },
            isNew: false,
            isMerged: true,
            mergedFrom: [tile, next],
          };
          
          // Remove the original tiles
          grid.cells[tile.position.x][tile.position.y] = null;
          grid.cells[next.position.x][next.position.y] = null;
          
          // Add the merged tile
          grid.cells[positions.next.x][positions.next.y] = merged;
          
          // Update score
          scoreGain += merged.value;
          
          moved = true;
        } else {
          // Move tile if needed
          if (positions.farthest.x !== tile.position.x || positions.farthest.y !== tile.position.y) {
            // Update grid
            grid.cells[tile.position.x][tile.position.y] = null;
            tile.position = { ...positions.farthest };
            grid.cells[positions.farthest.x][positions.farthest.y] = tile;
            
            moved = true;
          }
        }
      }
    });
  });
  
  return { grid, moved, scoreGain };
}

// Check if game is over
export function checkGameOver(grid: Grid, size: number): boolean {
  // If there are empty cells, game is not over
  if (grid.availableCells().length > 0) {
    return false;
  }
  
  // Check for possible merges
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const tile = grid.cells[x][y];
      
      if (tile) {
        // Check all adjacent tiles
        for (let direction = 0; direction < 4; direction++) {
          const vector = getVector(direction);
          const adjacentPosition: Position = {
            x: x + vector.x,
            y: y + vector.y
          };
          
          if (grid.withinBounds(adjacentPosition)) {
            const adjacent = grid.cells[adjacentPosition.x][adjacentPosition.y];
            
            // If we can merge, game is not over
            if (adjacent && adjacent.value === tile.value) {
              return false;
            }
          }
        }
      }
    }
  }
  
  // No moves left
  return true;
}

// Check if player has won
export function checkWin(grid: Grid, target = 2048): boolean {
  for (let x = 0; x < grid.size; x++) {
    for (let y = 0; y < grid.size; y++) {
      const tile = grid.cells[x][y];
      if (tile && tile.value === target) {
        return true;
      }
    }
  }

  return false;
}