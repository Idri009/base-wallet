import { StyleSheet } from 'react-native';

// Colors
export const colors = {
  // Primary colors
  primary: {
    default: '#00FF88',
    light: '#33FF9F',
    dark: '#00CC6E',
    fade: 'rgba(0, 255, 136, 0.1)',
  },
  // Background colors
  background: {
    deep: '#121212',
    default: '#1E1E1E',
    light: '#2A2A2A',
    card: '#242424',
  },
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    hint: '#777777',
    disabled: '#555555',
  },
  // Status colors
  status: {
    success: '#00DD8A',
    warning: '#FFB800',
    error: '#FF4D4D',
    info: '#0099FF',
  },
  // UI element colors
  ui: {
    border: '#333333',
    divider: '#2A2A2A',
    input: '#2C2C2C',
  },
  // Token/Base specific
  base: {
    brand: '#0052FF',
    brandFade: 'rgba(0, 82, 255, 0.1)',
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const typography = {
  h1: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.primary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    lineHeight: 24,
  },
};

// Border radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.deep,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.deep,
  },
  screenContainer: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background.deep,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.ui.input,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});