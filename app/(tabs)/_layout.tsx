import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color, size }) => <FontAwesome name="gamepad" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="instructions"
        options={{
          title: 'How to Play',
          tabBarIcon: ({ color, size }) => <FontAwesome name="question-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <FontAwesome name="trophy" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}