export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  board: string;
  cell: string;
  scoreBackground: string;
  buttonBackground: string;
  buttonText: string;
  overlayBackground: string;
  tile2: string;
  tile4: string;
  tile8: string;
  tile16: string;
  tile32: string;
  tile64: string;
  tile128: string;
  tile256: string;
  tile512: string;
  tile1024: string;
  tile2048: string;
  tileSuper: string;
  tileText: string;
  tileLightText: string;
}

export const lightTheme: ThemeColors = {
  background: '#faf8ef',
  text: '#776e65',
  primary: '#8f7a66',
  secondary: '#bbada0',
  board: '#bbada0',
  cell: 'rgba(238, 228, 218, 0.35)',
  scoreBackground: '#bbada0',
  buttonBackground: '#8f7a66',
  buttonText: '#f9f6f2',
  overlayBackground: 'rgba(238, 228, 218, 0.73)',
  tile2: '#eee4da',
  tile4: '#ede0c8',
  tile8: '#f2b179',
  tile16: '#f59563',
  tile32: '#f67c5f',
  tile64: '#f65e3b',
  tile128: '#edcf72',
  tile256: '#edcc61',
  tile512: '#edc850',
  tile1024: '#edc53f',
  tile2048: '#edc22e',
  tileSuper: '#3c3a32',
  tileText: '#776e65',
  tileLightText: '#f9f6f2',
};

export const darkTheme: ThemeColors = {
  background: '#1a1a1a',
  text: '#e0e0e0',
  primary: '#bb8866',
  secondary: '#665544',
  board: '#4a4a4a',
  cell: 'rgba(68, 68, 68, 0.35)',
  scoreBackground: '#4a4a4a',
  buttonBackground: '#bb8866',
  buttonText: '#1a1a1a',
  overlayBackground: 'rgba(42, 42, 42, 0.85)',
  tile2: '#2d2d2d',
  tile4: '#3a3a3a',
  tile8: '#c47a3f',
  tile16: '#c56033',
  tile32: '#c6452f',
  tile64: '#c62e1b',
  tile128: '#bdaf42',
  tile256: '#bd9c31',
  tile512: '#bd8820',
  tile1024: '#bd750f',
  tile2048: '#bd6200',
  tileSuper: '#8c8a82',
  tileText: '#e0e0e0',
  tileLightText: '#1a1a1a',
};

export function getTileColor(value: number, theme: ThemeColors): string {
  const tileColors: Record<number, string> = {
    2: theme.tile2,
    4: theme.tile4,
    8: theme.tile8,
    16: theme.tile16,
    32: theme.tile32,
    64: theme.tile64,
    128: theme.tile128,
    256: theme.tile256,
    512: theme.tile512,
    1024: theme.tile1024,
    2048: theme.tile2048,
  };

  return tileColors[value] || theme.tileSuper;
}

export function getTileTextColor(value: number, theme: ThemeColors): string {
  return value >= 8 ? theme.tileLightText : theme.tileText;
}
