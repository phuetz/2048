import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStats } from '@/hooks/useStats';
import { usePreferences } from '@/hooks/usePreferences';
import { getAchievementProgress } from '@/utils/achievements';
import { FontAwesome } from '@expo/vector-icons';

export default function StatsScreen() {
  const { stats, achievements } = useStats();
  const { theme } = usePreferences();
  const achievementProgress = getAchievementProgress(achievements);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: theme.text }]}>Statistics</Text>

        {/* Main Stats */}
        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <FontAwesome name="trophy" size={24} color={theme.tile512} />
              <Text style={[styles.statLabel, { color: theme.secondary }]}>Best Score</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{stats.bestScore}</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome name="gamepad" size={24} color={theme.tile256} />
              <Text style={[styles.statLabel, { color: theme.secondary }]}>Games Played</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{stats.gamesPlayed}</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <FontAwesome name="star" size={24} color={theme.tile128} />
              <Text style={[styles.statLabel, { color: theme.secondary }]}>Games Won</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{stats.gamesWon}</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome name="fire" size={24} color={theme.tile64} />
              <Text style={[styles.statLabel, { color: theme.secondary }]}>Best Streak</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{stats.bestStreak}</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <FontAwesome name="square" size={24} color={theme.tile2048} />
              <Text style={[styles.statLabel, { color: theme.secondary }]}>Highest Tile</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{stats.highestTile || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome name="bar-chart" size={24} color={theme.primary} />
              <Text style={[styles.statLabel, { color: theme.secondary }]}>Total Score</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {stats.totalScore.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Win Rate */}
        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Performance</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressLabel, { color: theme.secondary }]}>Win Rate</Text>
              <Text style={[styles.progressValue, { color: theme.text }]}>
                {stats.gamesPlayed > 0
                  ? `${Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%`
                  : '0%'}
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.cell }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.tile128,
                    width: `${stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed) * 100 : 0}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <View style={styles.achievementHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
            <Text style={[styles.achievementProgress, { color: theme.secondary }]}>
              {achievementProgress.unlocked}/{achievementProgress.total} ({achievementProgress.percentage}%)
            </Text>
          </View>

          <View style={[styles.progressBar, { backgroundColor: theme.cell, marginBottom: 20 }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.tile512,
                  width: `${achievementProgress.percentage}%`,
                },
              ]}
            />
          </View>

          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementItem,
                {
                  backgroundColor: achievement.unlocked ? theme.cell : 'transparent',
                  borderColor: theme.cell,
                  borderWidth: achievement.unlocked ? 0 : 1,
                },
              ]}
            >
              <View style={styles.achievementIcon}>
                <FontAwesome
                  name={achievement.unlocked ? 'trophy' : 'lock'}
                  size={20}
                  color={achievement.unlocked ? theme.tile512 : theme.secondary}
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementName,
                    {
                      color: achievement.unlocked ? theme.text : theme.secondary,
                    },
                  ]}
                >
                  {achievement.name}
                </Text>
                <Text
                  style={[
                    styles.achievementDescription,
                    { color: theme.secondary },
                  ]}
                >
                  {achievement.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementProgress: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
