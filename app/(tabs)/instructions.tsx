import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InstructionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>How to Play 2048</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The Goal</Text>
          <Text style={styles.text}>
            Combine tiles with the same numbers to create a tile with the number 2048!
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Move</Text>
          <Text style={styles.text}>
            Swipe in any direction (up, down, left, right) to move all tiles in that direction.
            Tiles with the same number will combine into one when they touch.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scoring</Text>
          <Text style={styles.text}>
            Each time two tiles combine, you earn points equal to the value of the new tile.
            Try to get the highest score possible!
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <Text style={styles.text}>
            • Swipe up, down, left, or right to move tiles in that direction
          </Text>
          <Text style={styles.text}>
            • Use the "Undo" button to reverse your last move
          </Text>
          <Text style={styles.text}>
            • Use the "New Game" button to start over
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <Text style={styles.text}>
            • Try to keep your highest tiles in one corner
          </Text>
          <Text style={styles.text}>
            • Plan several moves ahead
          </Text>
          <Text style={styles.text}>
            • Don't let your grid fill up without a plan
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Winning</Text>
          <Text style={styles.text}>
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
    backgroundColor: '#faf8ef',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#776e65',
    lineHeight: 24,
    marginBottom: 8,
  },
});