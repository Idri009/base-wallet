import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/utils/theme';
import { LinearGradient } from 'expo-linear-gradient';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const buttonStyles = getButtonStyles(variant, size, fullWidth);
  const textStyles = getTextStyles(variant, size);
  
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          color={variant === 'primary' ? colors.background.deep : colors.primary.default} 
          size="small" 
        />
      );
    }

    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={[colors.primary.default, colors.primary.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, buttonStyles]}
        >
          <ButtonContent 
            title={title}
            icon={icon}
            iconPosition={iconPosition}
            textStyles={textStyles}
            textStyle={textStyle}
          />
        </LinearGradient>
      );
    }

    return (
      <ButtonContent 
        title={title}
        icon={icon}
        iconPosition={iconPosition}
        textStyles={textStyles}
        textStyle={textStyle}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[
        variant !== 'primary' && buttonStyles,
        styles.button,
        props.disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

interface ButtonContentProps {
  title: string;
  icon?: React.ReactNode;
  iconPosition: 'left' | 'right';
  textStyles: TextStyle;
  textStyle?: TextStyle;
}

function ButtonContent({ title, icon, iconPosition, textStyles, textStyle }: ButtonContentProps) {
  return (
    <>
      {icon && iconPosition === 'left' && icon}
      <Text style={[textStyles, icon && { marginLeft: iconPosition === 'right' ? 0 : spacing.sm, marginRight: iconPosition === 'left' ? 0 : spacing.sm }, textStyle]}>
        {title}
      </Text>
      {icon && iconPosition === 'right' && icon}
    </>
  );
}

function getButtonStyles(variant: ButtonVariant, size: ButtonSize, fullWidth: boolean): ViewStyle {
  const baseStyle: ViewStyle = {
    borderRadius: size === 'small' ? borderRadius.sm : borderRadius.md,
    paddingVertical: size === 'small' ? spacing.sm : size === 'medium' ? spacing.md : spacing.lg,
    paddingHorizontal: size === 'small' ? spacing.md : size === 'medium' ? spacing.lg : spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
  };

  switch (variant) {
    case 'primary':
      return baseStyle;
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: colors.background.light,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary.default,
      };
    case 'ghost':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    case 'danger':
      return {
        ...baseStyle,
        backgroundColor: colors.status.error,
      };
    default:
      return baseStyle;
  }
}

function getTextStyles(variant: ButtonVariant, size: ButtonSize): TextStyle {
  const baseStyle: TextStyle = {
    ...typography.button,
    fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 18,
    fontFamily: 'Inter-SemiBold',
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        color: colors.background.deep,
      };
    case 'secondary':
      return {
        ...baseStyle,
        color: colors.text.primary,
      };
    case 'outline':
    case 'ghost':
      return {
        ...baseStyle,
        color: colors.primary.default,
      };
    case 'danger':
      return {
        ...baseStyle,
        color: colors.text.primary,
      };
    default:
      return baseStyle;
  }
}

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});