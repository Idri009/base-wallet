import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  View 
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/utils/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
}

export function ActionButton({ 
  icon, 
  label, 
  onPress, 
  style, 
  variant = 'primary' 
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.container, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          isPrimary 
            ? [colors.primary.default, colors.primary.dark]
            : [colors.background.light, colors.background.light]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <View style={styles.iconWrapper}>
          {React.cloneElement(icon as React.ReactElement, { 
            color: isPrimary ? colors.background.deep : colors.text.primary,
            size: 22
          })}
        </View>
      </LinearGradient>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
});