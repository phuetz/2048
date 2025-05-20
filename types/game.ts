export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  id: string;
  position: Position;
  value: number;
  previousPosition: Position | null;
  isNew: boolean;
  isMerged: boolean;
  mergedFrom: Tile[] | null;
}

export type GridCell = Tile | null;

export interface Grid {
  cells: GridCell[][];
  size: number;
  cellContent: (position: Position) => GridCell;
  cellOccupied: (position: Position) => boolean;
  cellAvailable: (position: Position) => boolean;
  availableCells: () => Position[];
  withinBounds: (position: Position) => boolean;
}

export interface GameState {
  grid: Grid;
  size: number;
  over: boolean;
  won: boolean;
  keepPlaying: boolean;
  previousState: Grid | null;
  previousScore: number;
}

export interface MoveResult {
  grid: Grid;
  moved: boolean;
  scoreGain: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Traversals {
  x: number[];
  y: number[];
}

export interface FarthestPosition {
  farthest: Position;
  next: Position;
}