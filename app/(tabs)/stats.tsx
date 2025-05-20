import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function StatsScreen() {
  const [bestScore, setBestScore] = React.useState(0);
  const [gamesPlayed, setGamesPlayed] = React.useState(0);
  const [statsLoaded, setStatsLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const isFocused = useIsFocused();

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [storedBestScore, storedGamesPlayed] = await Promise.all([
        AsyncStorage.getItem('bestScore'),
        AsyncStorage.getItem('gamesPlayed')
      ]);
      
      if (storedBestScore) {
        setBestScore(parseInt(storedBestScore));
      }
      
      if (storedGamesPlayed) {
        setGamesPlayed(parseInt(storedGamesPlayed));
      }
      
      setStatsLoaded(true);
    } catch (error) {
      console.error('Failed to load stats from storage', error);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      loadStats();
    }
  }, [isFocused, loadStats]);

  const resetStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        AsyncStorage.setItem('bestScore', '0'),
        AsyncStorage.setItem('gamesPlayed', '0')
      ]);
      
      setBestScore(0);
      setGamesPlayed(0);
    } catch (error) {
      console.error('Failed to reset stats', error);
      setError('Failed to reset statistics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Game Statistics</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#776e65" />
          <Text style={styles.loadingText}>Loading stats...</Text>
        </View>
      ) : statsLoaded ? (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Best Score</Text>
            <Text style={styles.statValue}>{bestScore}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Games Played</Text>
            <Text style={styles.statValue}>{gamesPlayed}</Text>
          </View>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetStats}>
            <Text style={styles.resetButtonText}>Reset Statistics</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#776e65',
    marginVertical: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#776e65',
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: '#ffc9c9',
    padding: 15,
    borderRadius: 6,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#d85959',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8f7a66',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 20,
  },
  statItem: {
    backgroundColor: '#eee4da',
    borderRadius: 6,
    padding: 20,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 18,
    color: '#776e65',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#776e65',
  },
  resetButton: {
    backgroundColor: '#8f7a66',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});