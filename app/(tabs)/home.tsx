import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { WalletCard } from '@/components/wallet/WalletCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { TokenCard } from '@/components/ui/TokenCard';
import { colors, commonStyles, spacing, typography } from '@/utils/theme';
import { getMockTokens, getMockTransactions, TokenBalance } from '@/utils/wallet';
import { ArrowDown, ArrowUpRight, Plus, Repeat } from 'lucide-react-native';

export default function HomeScreen() {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [tokens, setTokens] = useState<TokenBalance[]>(getMockTokens());

  // Mock wallet address
  const walletAddress = '0x3dC4696671ca3a4C03D1D44B0b0287B5873f768C';

  // Toggle balance visibility
  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  // Copy wallet address to clipboard
  const copyAddress = () => {
    // In a real app, you would use Clipboard API
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  // Navigate to Send screen
  const navigateToSend = () => {
    router.push('/home/send');
  };

  // Navigate to Receive screen
  const navigateToReceive = () => {
    router.push('/home/receive');
  };

  // Navigate to Swap screen
  const navigateToSwap = () => {
    router.push('/swap');
  };

  // Show add token modal
  const showAddTokenModal = () => {
    Alert.alert('Add Token', 'This would open the add token modal');
  };

  // Handle token press
  const handleTokenPress = (token: TokenBalance) => {
    router.push({
      pathname: '/token/[id]',
      params: { id: token.id }
    });
  };

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(300).delay(100)}>
          <WalletCard
            balance="1.45"
            balanceUsd="4,371.22"
            address={walletAddress}
            onPressAddress={copyAddress}
            onPressEye={toggleBalanceVisibility}
            isBalanceHidden={isBalanceHidden}
          />
        </Animated.View>
        
        <View style={styles.actionsContainer}>
          <ActionButton
            icon={<ArrowUpRight />}
            label="Send"
            onPress={navigateToSend}
            style={styles.actionButton}
          />
          <ActionButton
            icon={<ArrowDown />}
            label="Receive"
            onPress={navigateToReceive}
            style={styles.actionButton}
          />
          <ActionButton
            icon={<Repeat />}
            label="Swap"
            onPress={navigateToSwap}
            style={styles.actionButton}
          />
        </View>
        
        <View style={styles.tokensHeader}>
          <Text style={styles.sectionTitle}>Tokens</Text>
          <TouchableOpacity 
            style={styles.addTokenButton} 
            onPress={showAddTokenModal}
            activeOpacity={0.7}
          >
            <Plus size={18} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tokensList}>
          {tokens.map((token) => (
            <TokenCard
              key={token.id}
              token={{
                id: token.id,
                name: token.name,
                symbol: token.symbol,
                iconUrl: token.iconUrl,
                balance: token.balance,
                balanceUsd: token.balanceUsd,
                priceChange: token.priceChange,
              }}
              onPress={handleTokenPress}
            />
          ))}
        </View>
        
        <LinearGradient
          colors={[colors.primary.fade, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.accent}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.deep,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 100, // Extra padding for tab bar
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  tokensHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  addTokenButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokensList: {
    marginBottom: spacing.lg,
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