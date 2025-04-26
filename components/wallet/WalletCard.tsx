import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, colors, commonStyles, spacing, typography } from '@/utils/theme';
import { Copy, EyeIcon, EyeOffIcon } from 'lucide-react-native';

interface WalletCardProps {
  balance: string;
  balanceUsd: string;
  address: string;
  onPressAddress: () => void;
  onPressEye: () => void;
  isBalanceHidden: boolean;
}

export function WalletCard({
  balance,
  balanceUsd,
  address,
  onPressAddress,
  onPressEye,
  isBalanceHidden,
}: WalletCardProps) {
  // Format address to show first and last 4 characters
  const formattedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <LinearGradient
      colors={[colors.background.light, colors.background.default]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.balanceContainer}>
        <Pressable
          onPress={onPressEye}
          hitSlop={10}
          style={styles.eyeButton}
        >
          {isBalanceHidden ? (
            <EyeOffIcon size={18} color={colors.text.secondary} />
          ) : (
            <EyeIcon size={18} color={colors.text.secondary} />
          )}
        </Pressable>
        
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>
          {isBalanceHidden ? '••••••' : balance} ETH
        </Text>
        <Text style={styles.balanceUsd}>
          {isBalanceHidden ? '$•••••' : `$${balanceUsd}`}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <Pressable
        style={styles.addressContainer}
        onPress={onPressAddress}
        android_ripple={{ color: colors.background.light }}
      >
        <Text style={styles.addressLabel}>Wallet Address</Text>
        <View style={commonStyles.row}>
          <Text style={styles.address}>{formattedAddress}</Text>
          <Copy size={14} color={colors.primary.default} style={styles.copyIcon} />
        </View>
      </Pressable>
      
      <LinearGradient
        colors={[colors.primary.fade, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accent}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  balanceContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  balanceValue: {
    ...typography.h1,
    color: colors.text.primary,
    fontFamily: 'Inter-Bold',
  },
  balanceUsd: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ui.divider,
    marginVertical: spacing.md,
  },
  addressContainer: {
    alignItems: 'center',
    padding: spacing.xs,
  },
  addressLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  address: {
    ...typography.body,
    color: colors.text.primary,
    fontFamily: 'Inter-Medium',
  },
  copyIcon: {
    marginLeft: spacing.xs,
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 4,
  },
});