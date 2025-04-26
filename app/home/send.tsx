import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

import { Button } from '@/components/ui/Button';
import { colors, commonStyles, spacing, typography, borderRadius } from '@/utils/theme';
import { ArrowLeft, ChevronDown, Scan } from 'lucide-react-native';
import { sendToken, TokenBalance } from '@/utils/wallet';

export default function SendScreen() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState({
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '1.45',
    iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  });
  const [loading, setLoading] = useState(false);

  // Calculate USD value based on entered amount
  const getUsdValue = () => {
    const value = parseFloat(amount) || 0;
    return (value * 3014.64).toFixed(2); // Mock ETH price
  };

  // Handle scanning QR code
  const handleScan = () => {
    Alert.alert('Scan QR Code', 'This would open the camera to scan a QR code');
  };

  // Open token selector
  const openTokenSelector = () => {
    Alert.alert('Select Token', 'This would open the token selection modal');
  };

  // Send transaction
  const handleSend = async () => {
    // Basic validation
    if (!recipient) {
      Alert.alert('Error', 'Please enter a recipient address');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // In a real app, you would validate the address format and amount against balance
    
    setLoading(true);
    
    try {
      // Send the transaction
      await sendToken(amount, selectedToken.symbol, recipient);
      
      // Show success and navigate back
      Alert.alert(
        'Transaction Sent',
        `You've sent ${amount} ${selectedToken.symbol} to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          }
        ]
      );
    } catch (error) {
      console.error('Transaction failed:', error);
      Alert.alert('Error', 'Failed to send transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft color={colors.text.primary} size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Send</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient</Text>
            <View style={styles.addressInputContainer}>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter wallet address"
                placeholderTextColor={colors.text.hint}
                value={recipient}
                onChangeText={setRecipient}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScan}
                activeOpacity={0.7}
              >
                <Scan color={colors.text.primary} size={20} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Asset</Text>
            <TouchableOpacity
              style={styles.tokenSelector}
              onPress={openTokenSelector}
              activeOpacity={0.7}
            >
              <View style={styles.tokenIcon}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <Text style={styles.tokenSymbol}>{selectedToken.symbol}</Text>
              </View>
              <Text style={styles.tokenName}>{selectedToken.name}</Text>
              <ChevronDown color={colors.text.secondary} size={20} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.0"
                placeholderTextColor={colors.text.hint}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.currencySymbol}>{selectedToken.symbol}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.usdValue}>
                ${getUsdValue()} USD
              </Text>
              <TouchableOpacity
                onPress={() => setAmount(selectedToken.balance)}
                activeOpacity={0.7}
              >
                <Text style={styles.maxButton}>
                  Max: {selectedToken.balance} {selectedToken.symbol}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.feeContainer}>
            <Text style={styles.feeLabel}>Network Fee</Text>
            <Text style={styles.feeValue}>~0.0002 ETH ($0.60)</Text>
          </View>
          
          <Button
            title="Send Transaction"
            onPress={handleSend}
            loading={loading}
            fullWidth
            style={styles.sendButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
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
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  addressInput: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  scanButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  tokenIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  tokenSymbol: {
    ...typography.body,
    color: colors.text.primary,
    fontFamily: 'Inter-Medium',
  },
  tokenName: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  amountInput: {
    ...typography.h2,
    color: colors.text.primary,
    flex: 1,
    paddingVertical: spacing.md,
  },
  currencySymbol: {
    ...typography.h3,
    color: colors.text.secondary,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  usdValue: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  maxButton: {
    ...typography.bodySmall,
    color: colors.primary.default,
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  feeLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  feeValue: {
    ...typography.body,
    color: colors.text.primary,
  },
  sendButton: {
    marginTop: spacing.md,
  },
});