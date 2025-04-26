import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { colors, commonStyles, spacing, typography, borderRadius } from '@/utils/theme';
import { ChevronLeft, Key, Shield } from 'lucide-react-native';
import { importWalletFromMnemonic, importWalletFromPrivateKey } from '@/utils/wallet';

type ImportMethod = 'phrase' | 'key';

export default function ImportWalletScreen() {
  const [importMethod, setImportMethod] = useState<ImportMethod>('phrase');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle importing wallet
  const handleImport = async () => {
    if (!value.trim()) {
      Alert.alert('Error', `Please enter your recovery ${importMethod === 'phrase' ? 'phrase' : 'key'}`);
      return;
    }

    setLoading(true);

    try {
      // Import wallet based on selected method
      const wallet = importMethod === 'phrase' 
        ? importWalletFromMnemonic(value.trim())
        : importWalletFromPrivateKey(value.trim());

      // Save wallet status
      await SecureStore.setItemAsync('wallet_created', 'true');

      // Navigate to main app
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Failed to import wallet:', error);
      Alert.alert(
        'Import Failed',
        'Invalid recovery phrase or private key. Please check and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Button
            variant="ghost"
            title=""
            icon={<ChevronLeft color={colors.text.primary} size={24} />}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text style={styles.title}>Import Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        <Animated.View 
          style={styles.methodSelector}
          entering={FadeIn.duration(300)}
        >
          <Button
            title="Recovery Phrase"
            variant={importMethod === 'phrase' ? 'primary' : 'secondary'}
            icon={<Shield size={20} color={importMethod === 'phrase' ? colors.background.deep : colors.text.primary} />}
            onPress={() => setImportMethod('phrase')}
            style={styles.methodButton}
          />
          
          <Button
            title="Private Key"
            variant={importMethod === 'key' ? 'primary' : 'secondary'}
            icon={<Key size={20} color={importMethod === 'key' ? colors.background.deep : colors.text.primary} />}
            onPress={() => setImportMethod('key')}
            style={styles.methodButton}
          />
        </Animated.View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            {importMethod === 'phrase' ? 'Recovery Phrase' : 'Private Key'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              importMethod === 'phrase'
                ? 'Enter your 12-word recovery phrase'
                : 'Enter your private key'
            }
            placeholderTextColor={colors.text.hint}
            value={value}
            onChangeText={setValue}
            multiline={importMethod === 'phrase'}
            numberOfLines={importMethod === 'phrase' ? 3 : 1}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
        </View>

        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>Important:</Text>
          {importMethod === 'phrase' ? (
            <>
              <Text style={styles.warningText}>
                • Enter all 12 words in the correct order
              </Text>
              <Text style={styles.warningText}>
                • Words should be lowercase and separated by spaces
              </Text>
              <Text style={styles.warningText}>
                • Double-check spelling of each word
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.warningText}>
                • Enter your complete private key
              </Text>
              <Text style={styles.warningText}>
                • Private key should start with '0x'
              </Text>
              <Text style={styles.warningText}>
                • Make sure to enter it exactly as shown
              </Text>
            </>
          )}
          <Text style={styles.warningText}>
            • Never share this information with anyone
          </Text>
        </View>

        <Button
          title={loading ? 'Importing...' : 'Import Wallet'}
          onPress={handleImport}
          loading={loading}
          fullWidth
          style={styles.importButton}
        />

        <Text style={styles.securityNote}>
          Your {importMethod === 'phrase' ? 'recovery phrase' : 'private key'} is never stored and is only used to import your wallet.
        </Text>
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
  },
  title: {
    ...typography.h2,
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  methodButton: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text.primary,
    ...typography.body,
    textAlignVertical: 'top',
  },
  warningContainer: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
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
  importButton: {
    marginBottom: spacing.md,
  },
  securityNote: {
    ...typography.caption,
    color: colors.text.hint,
    textAlign: 'center',
  },
});