import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// This is the entry point of the app
// It checks if the user already has a wallet created
// If yes, redirects to the home screen
// If not, redirects to the onboarding screen

export default function RootIndex() {
  // In a real app, you would check if a wallet exists in secure storage
  const checkWalletStatus = async () => {
    try {
      const hasWallet = await SecureStore.getItemAsync('wallet_created');
      return !!hasWallet;
    } catch (error) {
      console.error('Failed to check wallet status:', error);
      return false;
    }
  };

  // For demo purposes, we'll always redirect to onboarding
  // In a real app, you would redirect based on the wallet status check
  return <Redirect href="/onboarding" />;
}