import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, spacing, typography, borderRadius } from '@/utils/theme';
import { ArrowDown, ArrowLeft, ArrowUpRight, ChevronRight, Repeat } from 'lucide-react-native';
import { getMockTokens, getMockTransactions, TokenBalance, Transaction } from '@/utils/wallet';

export default function TokenScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [token] = useState<TokenBalance | undefined>(
    getMockTokens().find(t => t.id === id)
  );
  const [transactions] = useState<Transaction[]>(
    getMockTransactions().filter(t => t.token === token?.symbol)
  );

  if (!token) {
    return null;
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight size={16} color={colors.status.error} />;
      case 'receive':
        return <ArrowDown size={16} color={colors.status.success} />;
      case 'swap':
        return <Repeat size={16} color={colors.primary.default} />;
      default:
        return null;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransaction = (transaction: Transaction) => (
    <TouchableOpacity 
      key={transaction.id}
      style={styles.transactionItem}
      activeOpacity={0.7}
    >
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[
        styles.transactionIcon,
        {
          backgroundColor: 
            transaction.type === 'send' ? colors.status.error + '20' :
            transaction.type === 'receive' ? colors.status.success + '20' :
            colors.primary.fade
        }
      ]}>
        {getTransactionIcon(transaction.type)}
      </View>
      
      <View style={styles.transactionInfo}>
        <View style={commonStyles.rowBetween}>
          <Text style={styles.transactionType}>
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </Text>
          <Text style={styles.transactionAmount}>
            {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.tokenSymbol}
          </Text>
        </View>
        
        <View style={commonStyles.rowBetween}>
          <Text style={styles.transactionDate}>{formatDate(transaction.timestamp)}</Text>
          <Text style={styles.transactionStatus}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <ChevronRight size={16} color={colors.text.hint} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{token.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[colors.primary.fade, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.accent}
          />
          
          <View style={styles.tokenCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.tokenHeader}>
              <View style={styles.tokenIconContainer}>
                <Image source={{ uri: token.iconUrl }} style={styles.tokenIcon} />
              </View>
              <View>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenName}>{token.name}</Text>
              </View>
            </View>
            
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balanceValue}>{token.balance} {token.symbol}</Text>
              <Text style={styles.balanceUsd}>${token.balanceUsd} USD</Text>
            </View>
            
            <View style={styles.priceInfo}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.priceValue}>${token.priceUsd}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>24h Change</Text>
                <Text style={[
                  styles.priceValue,
                  { color: token.priceChange >= 0 ? colors.status.success : colors.status.error }
                ]}>
                  {token.priceChange >= 0 ? '+' : ''}{token.priceChange}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/home/send')}
            >
              <ArrowUpRight size={24} color={colors.text.primary} />
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/home/receive')}
            >
              <ArrowDown size={24} color={colors.text.primary} />
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/swap')}
            >
              <Repeat size={24} color={colors.text.primary} />
              <Text style={styles.actionText}>Swap</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsContainer}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.map(renderTransaction)}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.deep,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
  },
  content: {
    flex: 1,
  },
  tokenCard: {
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.ui.border,
    overflow: 'hidden',
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  tokenIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.light,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  tokenIcon: {
    width: '100%',
    height: '100%',
  },
  tokenSymbol: {
    ...typography.h3,
    color: colors.text.primary,
  },
  tokenName: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  balanceContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  balanceValue: {
    ...typography.h1,
    color: colors.text.primary,
  },
  balanceUsd: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  priceInfo: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  priceItem: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  priceLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  priceValue: {
    ...typography.body,
    color: colors.text.primary,
    fontFamily: 'Inter-Medium',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.background.light,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    width: 100,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  transactionsContainer: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.ui.border,
    overflow: 'hidden',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    ...typography.body,
    color: colors.text.primary,
  },
  transactionAmount: {
    ...typography.body,
    color: colors.text.primary,
    fontFamily: 'Inter-Medium',
  },
  transactionDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  transactionStatus: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  accent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: 150,
    borderBottomLeftRadius: 150,
    opacity: 0.2,
  },
});