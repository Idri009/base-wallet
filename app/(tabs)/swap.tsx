import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  interpolate,
  withSequence
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { colors, commonStyles, spacing, typography, borderRadius } from '@/utils/theme';
import { ArrowDownUp, ChevronDown, Info, Settings } from 'lucide-react-native';
import { swapTokens } from '@/utils/wallet';

interface TokenOption {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  iconUrl: string;
  price: number;
}

export default function SwapScreen() {
  // Animation values
  const rotateAnim = useSharedValue(0);
  const swapAnim = useSharedValue(0);
  
  // Form state
  const [fromToken, setFromToken] = useState<TokenOption>({
    id: '1',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '1.45',
    iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    price: 3014.64
  });
  
  const [toToken, setToToken] = useState<TokenOption>({
    id: '2',
    name: 'USD Coin',
    symbol: 'USDC',
    balance: '530.82',
    iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    price: 1.00
  });
  
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Calculate swap amount when fromAmount changes
  const calculateToAmount = (amount: string) => {
    const value = parseFloat(amount) || 0;
    const exchangeRate = fromToken.price / toToken.price;
    return (value * exchangeRate).toFixed(6);
  };
  
  // Calculate fromAmount when toAmount changes
  const calculateFromAmount = (amount: string) => {
    const value = parseFloat(amount) || 0;
    const exchangeRate = toToken.price / fromToken.price;
    return (value * exchangeRate).toFixed(6);
  };
  
  // Handle from amount change
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value));
  };
  
  // Handle to amount change
  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    setFromAmount(calculateFromAmount(value));
  };
  
  // Swap token positions
  const handleSwapTokens = () => {
    // Trigger animations
    rotateAnim.value = withSequence(
      withTiming(1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withTiming(0, { duration: 0 })
    );
    
    swapAnim.value = withSequence(
      withTiming(1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withTiming(0, { duration: 0 })
    );
    
    // Swap tokens and amounts after animation
    setTimeout(() => {
      const tempToken = fromToken;
      setFromToken(toToken);
      setToToken(tempToken);
      
      const tempAmount = fromAmount;
      setFromAmount(toAmount);
      setToAmount(tempAmount);
    }, 150);
  };
  
  // Handle swap action
  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      Alert.alert('Error', 'Please enter an amount to swap');
      return;
    }
    
    setLoading(true);
    
    try {
      // Execute the swap
      await swapTokens(fromAmount, fromToken.symbol, toToken.symbol);
      
      // Show success
      Alert.alert(
        'Swap Successful',
        `You've swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
        [{ text: 'OK' }]
      );
      
      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
      Alert.alert('Error', 'Failed to execute swap. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Open token selector
  const openTokenSelector = (type: 'from' | 'to') => {
    Alert.alert(`Select ${type === 'from' ? 'From' : 'To'} Token`, 'This would open the token selection modal');
  };
  
  // Open settings
  const openSettings = () => {
    Alert.alert('Swap Settings', 'This would open slippage and other swap settings');
  };
  
  // Animated styles
  const rotateStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      rotateAnim.value,
      [0, 1],
      [0, 180]
    );
    
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });
  
  const fromTokenStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      swapAnim.value,
      [0, 0.5, 1],
      [0, 80, 0]
    );
    
    return {
      transform: [{ translateY }],
      opacity: interpolate(swapAnim.value, [0, 0.5, 1], [1, 0, 1]),
    };
  });
  
  const toTokenStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      swapAnim.value,
      [0, 0.5, 1],
      [0, -80, 0]
    );
    
    return {
      transform: [{ translateY }],
      opacity: interpolate(swapAnim.value, [0, 0.5, 1], [1, 0, 1]),
    };
  });

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Swap</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={openSettings}
            activeOpacity={0.7}
          >
            <Settings color={colors.text.primary} size={20} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.swapCard}>
          <LinearGradient
            colors={[colors.primary.fade, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          />
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          
          {/* From Token */}
          <Animated.View style={[styles.tokenSection, fromTokenStyle]}>
            <Text style={styles.sectionLabel}>From</Text>
            <View style={styles.tokenRow}>
              <TouchableOpacity
                style={styles.tokenSelector}
                onPress={() => openTokenSelector('from')}
                activeOpacity={0.7}
              >
                <Text style={styles.tokenSymbol}>{fromToken.symbol}</Text>
                <ChevronDown size={16} color={colors.text.secondary} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.amountInput}
                placeholder="0.0"
                placeholderTextColor={colors.text.hint}
                value={fromAmount}
                onChangeText={handleFromAmountChange}
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>
                Balance: {fromToken.balance} {fromToken.symbol}
              </Text>
              <TouchableOpacity
                onPress={() => handleFromAmountChange(fromToken.balance)}
                activeOpacity={0.7}
              >
                <Text style={styles.maxButton}>MAX</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          {/* Swap Button */}
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={handleSwapTokens}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.background.light, colors.background.default]}
              style={styles.swapButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Animated.View style={rotateStyle}>
              <ArrowDownUp size={20} color={colors.primary.default} />
            </Animated.View>
          </TouchableOpacity>
          
          {/* To Token */}
          <Animated.View style={[styles.tokenSection, toTokenStyle]}>
            <Text style={styles.sectionLabel}>To</Text>
            <View style={styles.tokenRow}>
              <TouchableOpacity
                style={styles.tokenSelector}
                onPress={() => openTokenSelector('to')}
                activeOpacity={0.7}
              >
                <Text style={styles.tokenSymbol}>{toToken.symbol}</Text>
                <ChevronDown size={16} color={colors.text.secondary} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.amountInput}
                placeholder="0.0"
                placeholderTextColor={colors.text.hint}
                value={toAmount}
                onChangeText={handleToAmountChange}
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>
                Balance: {toToken.balance} {toToken.symbol}
              </Text>
            </View>
          </Animated.View>
        </View>
        
        {/* Swap Details */}
        {fromAmount && parseFloat(fromAmount) > 0 && (
          <View style={styles.detailsCard}>
            <View style={commonStyles.rowBetween}>
              <Text style={styles.detailLabel}>Rate</Text>
              <Text style={styles.detailValue}>
                1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
              </Text>
            </View>
            
            <View style={commonStyles.rowBetween}>
              <Text style={styles.detailLabel}>Fee</Text>
              <Text style={styles.detailValue}>0.3%</Text>
            </View>
            
            <View style={commonStyles.rowBetween}>
              <Text style={styles.detailLabel}>Slippage Tolerance</Text>
              <Text style={styles.detailValue}>0.5%</Text>
            </View>
            
            <View style={commonStyles.rowBetween}>
              <Text style={styles.detailLabel}>Minimum Received</Text>
              <Text style={styles.detailValue}>
                {(parseFloat(toAmount) * 0.995).toFixed(6)} {toToken.symbol}
              </Text>
            </View>
          </View>
        )}
        
        {/* Liquidity Provider Info */}
        <View style={styles.infoBox}>
          <View style={commonStyles.row}>
            <Info size={16} color={colors.text.secondary} style={{ marginRight: spacing.xs }} />
            <Text style={styles.infoText}>
              Swapping on Base DEX - Powered by Uniswap
            </Text>
          </View>
        </View>
        
        {/* Swap Button */}
        <Button
          title={loading ? "Swapping..." : "Swap Tokens"}
          onPress={handleSwap}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || loading}
          loading={loading}
          fullWidth
          style={styles.submitButton}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    opacity: 0.5,
  },
  tokenSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  tokenSymbol: {
    ...typography.body,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  amountInput: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'right',
    paddingVertical: spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  balanceText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  maxButton: {
    ...typography.caption,
    color: colors.primary.default,
    fontFamily: 'Inter-SemiBold',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: -20,
    zIndex: 10,
    overflow: 'hidden',
  },
  swapButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  detailsCard: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontFamily: 'Inter-Medium',
  },
  infoBox: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  submitButton: {
    marginBottom: spacing.xl,
  },
});