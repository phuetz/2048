import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePreferences } from '@/hooks/usePreferences';
import { useGame } from '@/hooks/useGame';
import { GridSize } from '@/types/game';

export default function SettingsScreen() {
  const { preferences, theme, updateTheme, updateGridSize, updateSoundEnabled, updateHapticsEnabled } = usePreferences();
  const { setGridSize, setHapticsEnabled } = useGame();

  const handleThemeToggle = () => {
    updateTheme(preferences.theme === 'light' ? 'dark' : 'light');
  };

  const handleGridSizeChange = (size: GridSize) => {
    updateGridSize(size);
    setGridSize(size);
  };

  const handleSoundToggle = () => {
    updateSoundEnabled(!preferences.soundEnabled);
  };

  const handleHapticsToggle = () => {
    const newValue = !preferences.hapticsEnabled;
    updateHapticsEnabled(newValue);
    setHapticsEnabled(newValue);
  };

  const gridSizes: GridSize[] = [3, 4, 5, 6];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: theme.secondary }]}>
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={preferences.theme === 'dark'}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.secondary, true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? theme.buttonText : undefined}
            />
          </View>
        </View>

        {/* Game Settings */}
        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Game Settings</Text>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Grid Size</Text>
              <Text style={[styles.settingDescription, { color: theme.secondary }]}>
                Choose the size of the game board
              </Text>
            </View>
          </View>

          <View style={styles.gridSizeContainer}>
            {gridSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.gridSizeButton,
                  {
                    backgroundColor: preferences.gridSize === size ? theme.primary : theme.cell,
                    borderColor: theme.primary,
                  }
                ]}
                onPress={() => handleGridSizeChange(size)}
              >
                <Text
                  style={[
                    styles.gridSizeText,
                    {
                      color: preferences.gridSize === size ? theme.buttonText : theme.text,
                      fontWeight: preferences.gridSize === size ? 'bold' : 'normal',
                    }
                  ]}
                >
                  {size}x{size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Audio & Haptics */}
        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Feedback</Text>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Sound Effects</Text>
              <Text style={[styles.settingDescription, { color: theme.secondary }]}>
                Play sounds during gameplay
              </Text>
            </View>
            <Switch
              value={preferences.soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: theme.secondary, true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? theme.buttonText : undefined}
            />
          </View>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Haptic Feedback</Text>
              <Text style={[styles.settingDescription, { color: theme.secondary }]}>
                Vibrate on moves and merges
              </Text>
            </View>
            <Switch
              value={preferences.hapticsEnabled}
              onValueChange={handleHapticsToggle}
              trackColor={{ false: theme.secondary, true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? theme.buttonText : undefined}
            />
          </View>
        </View>

        {/* Info Section */}
        <View style={[styles.section, { backgroundColor: theme.scoreBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
          <View style={styles.setting}>
            <Text style={[styles.settingDescription, { color: theme.text }]}>
              2048 Enhanced Edition
            </Text>
            <Text style={[styles.settingDescription, { color: theme.secondary }]}>
              Version 2.0.0
            </Text>
          </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  gridSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    gap: 8,
  },
  gridSizeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  gridSizeText: {
    fontSize: 16,
  },
});
