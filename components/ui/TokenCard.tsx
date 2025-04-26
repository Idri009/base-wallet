import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { borderRadius, colors, commonStyles, spacing, typography } from '@/utils/theme';
import { BlurView } from 'expo-blur';
import { ArrowUpRight, TrendingUp } from 'lucide-react-native';

export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  balance: string;
  balanceUsd: string;
  priceChange: number;
}

interface TokenCardProps {
  token: TokenData;
  onPress: (token: TokenData) => void;
}

export function TokenCard({ token, onPress }: TokenCardProps) {
  const isPriceUp = token.priceChange >= 0;

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress(token)}
      android_ripple={{ color: colors.primary.fade }}
    >
      <BlurView intensity={20} tint="dark" style={styles.blurView}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image source={{ uri: token.iconUrl }} style={styles.icon} />
          </View>
          
          <View style={styles.details}>
            <View style={commonStyles.rowBetween}>
              <Text style={styles.symbol}>{token.symbol}</Text>
              <Text style={styles.balance}>{token.balance}</Text>
            </View>
            
            <View style={commonStyles.rowBetween}>
              <Text style={styles.name}>{token.name}</Text>
              <Text style={styles.balanceUsd}>${token.balanceUsd}</Text>
            </View>
          </View>
          
          <View style={styles.priceChangeContainer}>
            <View style={[
              styles.priceChange,
              { backgroundColor: isPriceUp ? colors.status.success + '20' : colors.status.error + '20' }
            ]}>
              <TrendingUp 
                size={14} 
                color={isPriceUp ? colors.status.success : colors.status.error} 
                style={{ transform: [{ rotate: isPriceUp ? '0deg' : '180deg' }] }}
              />
              <Text style={[
                styles.priceChangeText,
                { color: isPriceUp ? colors.status.success : colors.status.error }
              ]}>
                {Math.abs(token.priceChange).toFixed(2)}%
              </Text>
            </View>
            <ArrowUpRight size={16} color={colors.text.hint} style={styles.detailIcon} />
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  blurView: {
    overflow: 'hidden',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: 42,
    height: 42,
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
  },
  symbol: {
    ...typography.subtitle,
    color: colors.text.primary,
  },
  name: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  balance: {
    ...typography.body,
    color: colors.text.primary,
  },
  balanceUsd: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
  },
  priceChangeText: {
    ...typography.caption,
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  detailIcon: {
    opacity: 0.6,
  }
});