import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { colors, commonStyles, spacing, typography } from '@/utils/theme';
import {
  Key,
  Shield,
  Lock,
  Globe,
  Bell,
  Moon,
  HelpCircle,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
}

function SettingItem({ icon, title, subtitle, onPress, rightElement }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || <ChevronRight size={18} color={colors.text.secondary} />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [securityEnabled, setSecurityEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  const toggleSecurity = () => setSecurityEnabled(!securityEnabled);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotifications(!notifications);

  const handleViewPrivateKey = () => {
    Alert.alert(
      'Authenticate',
      'For security, please authenticate to view your private key.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Authenticate',
          onPress: () => {
            // In a real app, this would trigger biometric authentication
            Alert.alert('Security', 'Biometric authentication would happen here');
          },
        },
      ]
    );
  };

  const handleResetWallet = () => {
    Alert.alert(
      'Reset Wallet',
      'This will delete all wallet data from this device. Make sure you have backed up your recovery phrase before proceeding.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            // In a real app, clear all wallet data from secure storage
            try {
              await SecureStore.deleteItemAsync('wallet_created');
              router.replace('/onboarding');
            } catch (error) {
              console.error('Failed to reset wallet:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <SettingItem
            icon={<Key size={20} color={colors.text.primary} />}
            title="View Private Key"
            subtitle="Securely access your private key"
            onPress={handleViewPrivateKey}
          />
          
          <SettingItem
            icon={<Shield size={20} color={colors.text.primary} />}
            title="Security Lock"
            subtitle="Enable biometric authentication"
            onPress={toggleSecurity}
            rightElement={
              <Switch
                value={securityEnabled}
                onValueChange={toggleSecurity}
                trackColor={{ false: colors.background.light, true: colors.primary.fade }}
                thumbColor={securityEnabled ? colors.primary.default : colors.text.secondary}
              />
            }
          />
          
          <SettingItem
            icon={<Lock size={20} color={colors.text.primary} />}
            title="Auto-Lock"
            subtitle="Lock after 5 minutes of inactivity"
            onPress={() => {}}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <SettingItem
            icon={<Globe size={20} color={colors.text.primary} />}
            title="Network"
            subtitle="Base Mainnet"
            onPress={() => {}}
          />
          
          <SettingItem
            icon={<Bell size={20} color={colors.text.primary} />}
            title="Notifications"
            subtitle="Transaction alerts and updates"
            onPress={toggleNotifications}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: colors.background.light, true: colors.primary.fade }}
                thumbColor={notifications ? colors.primary.default : colors.text.secondary}
              />
            }
          />
          
          <SettingItem
            icon={<Moon size={20} color={colors.text.primary} />}
            title="Dark Mode"
            subtitle="Use dark theme"
            onPress={toggleDarkMode}
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.background.light, true: colors.primary.fade }}
                thumbColor={darkMode ? colors.primary.default : colors.text.secondary}
              />
            }
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon={<HelpCircle size={20} color={colors.text.primary} />}
            title="Help Center"
            subtitle="FAQs and support"
            onPress={() => {}}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleResetWallet}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={colors.status.error} />
          <Text style={styles.resetButtonText}>Reset Wallet</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Base Wallet v1.0.0</Text>
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
  title: {
    ...typography.h1,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary.default,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.text.primary,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
    backgroundColor: colors.status.error + '20',
    borderRadius: 12,
  },
  resetButtonText: {
    ...typography.button,
    color: colors.status.error,
    marginLeft: spacing.sm,
  },
  versionText: {
    ...typography.caption,
    color: colors.text.hint,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});