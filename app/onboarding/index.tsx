import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { borderRadius, colors, commonStyles, spacing, typography } from '@/utils/theme';

export default function OnboardingScreen() {
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate elements in sequence
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) }));
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) }));
    buttonsOpacity.value = withDelay(900, withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) }));
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoOpacity.value }],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ 
        translateY: withTiming(titleOpacity.value * 0 + (1 - titleOpacity.value) * 20, { 
          duration: 800, 
          easing: Easing.out(Easing.ease) 
        }) 
      }],
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
      transform: [{ 
        translateY: withTiming(subtitleOpacity.value * 0 + (1 - subtitleOpacity.value) * 20, { 
          duration: 800, 
          easing: Easing.out(Easing.ease) 
        }) 
      }],
    };
  });

  const buttonsStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonsOpacity.value,
    };
  });

  const navigateToCreateWallet = () => {
    router.push('/onboarding/create');
  };

  const navigateToImportWallet = () => {
    router.push('/onboarding/import');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={[colors.primary.fade, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.3 }}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image 
            source={{ uri: 'https://cryptologos.cc/logos/base-base-logo.png' }} 
            style={styles.logo} 
          />
        </Animated.View>
        
        <Animated.Text style={[styles.title, titleStyle]}>
         MoonPouch
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          The secure, fast, and user-friendly wallet for the Base blockchain ecosystem
        </Animated.Text>
        
        <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
          <Button 
            title="Create a New Wallet" 
            onPress={navigateToCreateWallet}
            fullWidth
            style={styles.button}
          />
          
          <Button 
            title="Import Existing Wallet" 
            variant="secondary"
            onPress={navigateToImportWallet}
            fullWidth
            style={styles.button}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.deep,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.default,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    ...typography.h1,
    fontSize: 36,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
});