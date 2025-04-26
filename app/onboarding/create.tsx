import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { colors, commonStyles, spacing, typography } from '@/utils/theme';
import { createWallet } from '@/utils/wallet';
import { ChevronLeft, Copy, Shield } from 'lucide-react-native';

export default function CreateWalletScreen() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);

  // Generate a new wallet with mnemonic
  const generateWallet = async () => {
    setLoading(true);
    
    // Simulating wallet creation delay
    setTimeout(() => {
      const wallet = createWallet();
      if (wallet.mnemonic) {
        setMnemonic(wallet.mnemonic);
      }
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  // Handle copying mnemonic to clipboard
  const copyMnemonic = () => {
    // In a real app, you would copy to clipboard
    // This is mocked for demo purposes
    Alert.alert('Copied to clipboard', 'Recovery phrase copied to clipboard');
  };

  // Verify the user has backed up their mnemonic
  const confirmBackup = () => {
    setConfirmed(true);
  };

  // Complete the wallet setup
  const completeSetup = async () => {
    setLoading(true);
    
    try {
      // In a real app, you would:
      // 1. Save the encrypted wallet to secure storage
      // 2. Set up biometric authentication
      // 3. Initialize the wallet in state
      
      // For demo, we'll just mark the wallet as created
      await SecureStore.setItemAsync('wallet_created', 'true');
      
      // Navigate to the main app after a short delay
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1000);
    } catch (error) {
      console.error('Failed to complete wallet setup:', error);
      Alert.alert('Error', 'Failed to set up your wallet. Please try again.');
      setLoading(false);
    }
  };

  // Go back to previous step or screen
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  // Render the mnemonic phrase words
  const renderMnemonicWords = () => {
    if (!mnemonic) return null;
    
    const words = mnemonic.split(' ');
    return (
      <View style={styles.mnemonicContainer}>
        {words.map((word, index) => (
          <View key={index} style={styles.wordContainer}>
            <Text style={styles.wordNumber}>{index + 1}</Text>
            <Text style={styles.word}>{word}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          title=""
          icon={<ChevronLeft color={colors.text.primary} size={24} />}
          onPress={goBack}
          style={styles.backButton}
        />
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && styles.activeStepDot]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 2 && styles.activeStepDot]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 3 && styles.activeStepDot]} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <Animated.View 
            style={styles.stepContent}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Shield color={colors.primary.default} size={48} />
            <Text style={styles.title}>Create a New Wallet</Text>
            <Text style={styles.description}>
              We'll generate a secure wallet for you with a recovery phrase. This phrase is the only way to recover your wallet if you lose access to your device.
            </Text>
            <View style={styles.warningContainer}>
              <Text style={styles.warningTitle}>Important:</Text>
              <Text style={styles.warningText}>
                • Write down your recovery phrase and store it in a safe place
              </Text>
              <Text style={styles.warningText}>
                • Never share your recovery phrase with anyone
              </Text>
              <Text style={styles.warningText}>
                • Base Wallet will never ask for your recovery phrase
              </Text>
              <Text style={styles.warningText}>
                • If you lose your recovery phrase, you will lose access to your funds
              </Text>
            </View>
            <Button
              title="Generate Wallet"
              onPress={generateWallet}
              loading={loading}
              fullWidth
              style={styles.button}
            />
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View 
            style={styles.stepContent} 
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.title}>Your Recovery Phrase</Text>
            <Text style={styles.description}>
              Write down these 12 words in order and keep them in a safe place. Anyone with access to this phrase will have full control of your wallet.
            </Text>
            
            {renderMnemonicWords()}
            
            <Button
              title="Copy to Clipboard"
              variant="secondary"
              icon={<Copy size={18} color={colors.text.primary} />}
              onPress={copyMnemonic}
              fullWidth
              style={styles.button}
            />
            
            <Button
              title="I've Backed It Up"
              onPress={() => setStep(3)}
              fullWidth
              style={styles.button}
            />
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View 
            style={styles.stepContent}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.title}>Confirm Backup</Text>
            <Text style={styles.description}>
              Please confirm that you've safely backed up your recovery phrase. Remember, if you lose your recovery phrase, you'll permanently lose access to your funds.
            </Text>
            
            <View style={styles.checkboxContainer}>
              <View 
                style={[
                  styles.checkbox, 
                  confirmed && styles.checkboxChecked
                ]}
                onTouchEnd={confirmBackup}
              />
              <Text style={styles.checkboxLabel}>
                I confirm that I've written down my recovery phrase and stored it in a safe place.
              </Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary.default} size="large" />
                <Text style={styles.loadingText}>Setting up your wallet...</Text>
              </View>
            ) : (
              <Button
                title="Complete Setup"
                onPress={completeSetup}
                disabled={!confirmed}
                fullWidth
                style={styles.button}
              />
            )}
          </Animated.View>
        )}
      </ScrollView>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ui.border,
  },
  activeStepDot: {
    backgroundColor: colors.primary.default,
    width: 10,
    height: 10,
  },
  stepLine: {
    width: 16,
    height: 1,
    backgroundColor: colors.ui.border,
    marginHorizontal: 4,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  title: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  warningContainer: {
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    width: '100%',
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
  mnemonicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
  },
  wordContainer: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  wordNumber: {
    ...typography.caption,
    color: colors.text.hint,
    marginRight: spacing.xs,
    width: 20,
    textAlign: 'center',
  },
  word: {
    ...typography.body,
    color: colors.text.primary,
    fontFamily: 'Inter-Medium',
  },
  button: {
    marginTop: spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.xl,
    width: '100%',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary.default,
    marginRight: spacing.md,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary.default,
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});