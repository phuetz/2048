import { Achievement } from '@/types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game by reaching 2048',
    unlocked: false,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Win a game in under 5 minutes',
    unlocked: false,
  },
  {
    id: 'tile_4096',
    name: 'Beyond 2048',
    description: 'Create a 4096 tile',
    unlocked: false,
  },
  {
    id: 'tile_8192',
    name: 'Tile Master',
    description: 'Create an 8192 tile',
    unlocked: false,
  },
  {
    id: 'score_100k',
    name: 'Century Club',
    description: 'Score 100,000 points in a single game',
    unlocked: false,
  },
  {
    id: 'score_500k',
    name: 'Half Million',
    description: 'Score 500,000 points in a single game',
    unlocked: false,
  },
  {
    id: 'games_10',
    name: 'Getting Started',
    description: 'Play 10 games',
    unlocked: false,
  },
  {
    id: 'games_100',
    name: 'Dedicated Player',
    description: 'Play 100 games',
    unlocked: false,
  },
  {
    id: 'games_1000',
    name: 'Ultimate Champion',
    description: 'Play 1000 games',
    unlocked: false,
  },
  {
    id: 'win_streak_5',
    name: 'Winning Streak',
    description: 'Win 5 games in a row',
    unlocked: false,
  },
  {
    id: 'win_streak_10',
    name: 'Unstoppable',
    description: 'Win 10 games in a row',
    unlocked: false,
  },
  {
    id: 'grid_3x3_win',
    name: 'Small Grid Master',
    description: 'Win on a 3x3 grid',
    unlocked: false,
  },
  {
    id: 'grid_5x5_win',
    name: 'Large Grid Champion',
    description: 'Win on a 5x5 grid',
    unlocked: false,
  },
  {
    id: 'grid_6x6_win',
    name: 'Mega Grid Hero',
    description: 'Win on a 6x6 grid',
    unlocked: false,
  },
  {
    id: 'no_undo_win',
    name: 'Perfect Play',
    description: 'Win a game without using undo',
    unlocked: false,
  },
];

export function checkAchievements(
  gameState: any,
  score: number,
  stats: any,
  achievements: Achievement[]
): Achievement[] {
  const updatedAchievements = [...achievements];

  // Check first win
  if (gameState.won && stats.gamesWon === 1) {
    unlockAchievement(updatedAchievements, 'first_win');
  }

  // Check high tiles
  const highestTile = getHighestTile(gameState.grid);
  if (highestTile >= 4096) {
    unlockAchievement(updatedAchievements, 'tile_4096');
  }
  if (highestTile >= 8192) {
    unlockAchievement(updatedAchievements, 'tile_8192');
  }

  // Check score achievements
  if (score >= 100000) {
    unlockAchievement(updatedAchievements, 'score_100k');
  }
  if (score >= 500000) {
    unlockAchievement(updatedAchievements, 'score_500k');
  }

  // Check games played
  if (stats.gamesPlayed >= 10) {
    unlockAchievement(updatedAchievements, 'games_10');
  }
  if (stats.gamesPlayed >= 100) {
    unlockAchievement(updatedAchievements, 'games_100');
  }
  if (stats.gamesPlayed >= 1000) {
    unlockAchievement(updatedAchievements, 'games_1000');
  }

  // Check win streaks
  if (stats.currentStreak >= 5) {
    unlockAchievement(updatedAchievements, 'win_streak_5');
  }
  if (stats.currentStreak >= 10) {
    unlockAchievement(updatedAchievements, 'win_streak_10');
  }

  return updatedAchievements;
}

function unlockAchievement(achievements: Achievement[], id: string) {
  const achievement = achievements.find(a => a.id === id);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
  }
}

function getHighestTile(grid: any): number {
  let highest = 0;
  for (let x = 0; x < grid.size; x++) {
    for (let y = 0; y < grid.size; y++) {
      const tile = grid.cells[x][y];
      if (tile && tile.value > highest) {
        highest = tile.value;
      }
    }
  }
  return highest;
}

export function getAchievementProgress(achievements: Achievement[]): {
  unlocked: number;
  total: number;
  percentage: number;
} {
  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;
  const percentage = Math.round((unlocked / total) * 100);

  return { unlocked, total, percentage };
}
