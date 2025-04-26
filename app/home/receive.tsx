import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Copy, Share as ShareIcon } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';
import { colors, commonStyles, spacing, typography, borderRadius } from '@/utils/theme';

export default function ReceiveScreen() {
  const [selectedToken, setSelectedToken] = useState({
    name: 'Ethereum',
    symbol: 'ETH',
    iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  });

  // Mock wallet address
  const walletAddress = '0x3dC4696671ca3a4C03D1D44B0b0287B5873f768C';
  
  // Format address to show with spaces for readability
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Copy address to clipboard
  const copyAddress = () => {
    // In a real app, this would use Clipboard API
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  // Share address
  const shareAddress = async () => {
    try {
      await Share.share({
        message: `My ${selectedToken.symbol} address: ${walletAddress}`,
      });
    } catch (error) {
      console.error('Error sharing address:', error);
    }
  };

  // Open token selector
  const openTokenSelector = () => {
    Alert.alert('Select Token', 'This would open the token selection modal');
  };

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
          <Text style={styles.title}>Receive</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.tokenSelector}>
          <Text style={styles.tokenSelectorLabel}>Select Token</Text>
          <TouchableOpacity
            style={styles.tokenSelectorButton}
            onPress={openTokenSelector}
            activeOpacity={0.7}
          >
            <View style={styles.tokenIconContainer}>
              <LinearGradient
                colors={[colors.background.light, colors.background.default]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.tokenSymbol}>{selectedToken.symbol}</Text>
            </View>
            <Text style={styles.tokenName}>{selectedToken.name}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.qrContainer}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={[colors.primary.fade, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.qrGradient}
          />
          
          {/* This is a placeholder for the QR code */}
          <View style={styles.qrPlaceholder}>
            <View style={styles.qrBox}>
              <View style={styles.qrInner}>
                <Text style={styles.qrText}>QR Code</Text>
                <Text style={styles.qrSubtext}>Scan to get address</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.addressLabel}>Wallet Address</Text>
          <Text style={styles.addressValue}>{formatAddress(walletAddress)}</Text>
          
          <View style={styles.addressActions}>
            <Button
              title="Copy"
              variant="secondary"
              icon={<Copy size={16} color={colors.text.primary} />}
              onPress={copyAddress}
              style={styles.actionButton}
            />
            <Button
              title="Share"
              variant="secondary"
              icon={<ShareIcon size={16} color={colors.text.primary} />}
              onPress={shareAddress}
              style={styles.actionButton}
            />
          </View>
        </View>
        
        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>Important:</Text>
          <Text style={styles.warningText}>
            • Only send {selectedToken.symbol} and {selectedToken.symbol} tokens to this address
          </Text>
          <Text style={styles.warningText}>
            • Sending any other tokens may result in permanent loss
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background.deep,
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
  tokenSelector: {
    marginBottom: spacing.xl,
  },
  tokenSelectorLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  tokenSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  tokenIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.ui.border,
    position: 'relative',
  },
  qrGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  qrBox: {
    flex: 1,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.primary.default,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    ...typography.h3,
    color: colors.primary.default,
  },
  qrSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  addressLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  addressValue: {
    ...typography.body,
    color: colors.text.primary,
    fontFamily: 'Inter-Medium',
    marginBottom: spacing.md,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    marginHorizontal: spacing.xs,
  },
  warningContainer: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  warningTitle: {
    ...typography.subtitle,
    color: colors.status.warning,
    marginBottom: spacing.sm,
  },
  warningText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
});