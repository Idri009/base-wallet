import { Stack } from 'expo-router';
import { colors } from '@/utils/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.deep },
        animation: 'fade',
      }}
    />
  );
}