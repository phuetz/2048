import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from '@/context/GameContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { StatsProvider } from '@/context/StatsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PreferencesProvider>
          <StatsProvider>
            <GameProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </GameProvider>
          </StatsProvider>
        </PreferencesProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}