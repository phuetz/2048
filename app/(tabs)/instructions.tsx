import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePreferences } from '@/hooks/usePreferences';
import { FontAwesome } from '@expo/vector-icons';

export default function InstructionsScreen() {
  const { theme } = usePreferences();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>How to Play 2048</Text>

        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="flag-checkered" size={20} color={theme.tile512} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>The Goal</Text>
          </View>
          <Text style={[styles.text, { color: theme.secondary }]}>
            Combine tiles with the same numbers to create a tile with the number 2048!
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="hand-pointer-o" size={20} color={theme.tile256} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>How to Move</Text>
          </View>
          <Text style={[styles.text, { color: theme.secondary }]}>
            Swipe in any direction (up, down, left, right) to move all tiles in that direction.
            Tiles with the same number will combine into one when they touch.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="line-chart" size={20} color={theme.tile128} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Scoring</Text>
          </View>
          <Text style={[styles.text, { color: theme.secondary }]}>
            Each time two tiles combine, you earn points equal to the value of the new tile.
            Try to get the highest score possible!
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="gamepad" size={20} color={theme.tile64} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Controls</Text>
          </View>
          <Text style={[styles.text, { color: theme.secondary }]}>
            • Swipe up, down, left, or right to move tiles in that direction
          </Text>
          <Text style={[styles.text, { color: theme.secondary }]}>
            • Use the "Undo" button to reverse your last move
          </Text>
          <Text style={[styles.text, { color: theme.secondary }]}>
            • Use the "New Game" button to start over
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="lightbulb-o" size={20} color={theme.tile32} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Tips</Text>
          </View>
          <Text style={[styles.text, { color: theme.secondary }]}>
            • Try to keep your highest tiles in one corner
          </Text>
          <Text style={[styles.text, { color: theme.secondary }]}>
            • Plan several moves ahead
          </Text>
          <Text style={[styles.text, { color: theme.secondary }]}>
            • Don't let your grid fill up without a plan
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="trophy" size={20} color={theme.tile2048} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Winning</Text>
          </View>
          <Text style={[styles.text, { color: theme.secondary }]}>
            When you create a 2048 tile, you win! But you can keep playing to reach even higher scores and tiles.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
  },
});