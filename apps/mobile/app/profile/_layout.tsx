import { Stack } from 'expo-router';
import { colors } from '../../styles';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="edit"
        options={{
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
