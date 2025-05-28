import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, spacing, typography, borderRadius } from '@/utils/theme';
import { ArrowDown, ArrowUpRight, Calendar, ChevronRight, Filter, Repeat } from 'lucide-react-native';
import { getMockTransactions, Transaction } from '@/utils/wallet';

export default function HistoryScreen() {
  const [transactions] = useState<Transaction[]>(getMockTransactions());
  const [activeFilter, setActiveFilter] = useState<'all' | 'send' | 'receive' | 'swap'>('all');

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
      
      {/* <ChevronRight size={16} color={colors.text.hint} /> */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={[styles.filterChip, activeFilter === 'all' && styles.activeFilterChip]}
            onPress={() => setActiveFilter('all')}
          >
            <Calendar size={16} color={activeFilter === 'all' ? colors.primary.default : colors.text.secondary} />
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterChip, activeFilter === 'send' && styles.activeFilterChip]}
            onPress={() => setActiveFilter('send')}
          >
            <ArrowUpRight size={16} color={activeFilter === 'send' ? colors.primary.default : colors.text.secondary} />
            <Text style={[styles.filterText, activeFilter === 'send' && styles.activeFilterText]}>Sent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterChip, activeFilter === 'receive' && styles.activeFilterChip]}
            onPress={() => setActiveFilter('receive')}
          >
            <ArrowDown size={16} color={activeFilter === 'receive' ? colors.primary.default : colors.text.secondary} />
            <Text style={[styles.filterText, activeFilter === 'receive' && styles.activeFilterText]}>Received</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterChip, activeFilter === 'swap' && styles.activeFilterChip]}
            onPress={() => setActiveFilter('swap')}
          >
            <Repeat size={16} color={activeFilter === 'swap' ? colors.primary.default : colors.text.secondary} />
            <Text style={[styles.filterText, activeFilter === 'swap' && styles.activeFilterText]}>Swaps</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[colors.primary.fade, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.accent}
          />
          
          {transactions
            .filter(t => activeFilter === 'all' || t.type === activeFilter)
            .map(renderTransaction)}
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
  title: {
    ...typography.h2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.light,
  },
  activeFilterChip: {
    backgroundColor: colors.primary.fade,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  activeFilterText: {
    color: colors.primary.default,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
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