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

export type ThemeMode = 'light' | 'dark';
export type GridSize = 3 | 4 | 5 | 6;
export type GameMode = 'classic' | 'timeAttack';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  cost: number;
  uses: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
  totalScore: number;
  bestStreak: number;
  currentStreak: number;
  totalPlayTime: number;
  highestTile: number;
  achievements: Achievement[];
}

export interface GamePreferences {
  theme: ThemeMode;
  gridSize: GridSize;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  gameMode: GameMode;
}

export interface TimeAttackState {
  timeRemaining: number;
  isActive: boolean;
  targetScore: number;
}