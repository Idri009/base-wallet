import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Text, View } from 'react-native';

// This is the entry point of the app
// It checks if the user already has a wallet created
// If yes, redirects to the home screen
// If not, redirects to the onboarding screen

export default function RootIndex() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // In a real app, you would check if a wallet exists in secure storage
  const checkWalletStatus = async () => {
    try {
      const hasWallet = await SecureStore.getItemAsync('wallet_created');
      console.log('Wallet Created Status:', hasWallet);
      return !!hasWallet;
    } catch (error) {
      console.error('Failed to check wallet status:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const determineRoute = async () => {
      const walletExists = await checkWalletStatus();
      if (walletExists) {
        setRedirectTo('/(tabs)/home'); // Redirect to your home screen
      } else {
        setRedirectTo('/onboarding');
      }
    };

    determineRoute();
  }, []);
  // In a real app, you would check if a wallet exists in secure storage
  // const checkWalletStatus = async () => {
  //   try {
  //     const hasWallet = await SecureStore.getItemAsync('wallet_created');
  //     return !!hasWallet;
  //   } catch (error) {
  //     console.error('Failed to check wallet status:', error);
  //     return false;
  //   }
  // };

  // For demo purposes, we'll always redirect to onboarding
  // In a real app, you would redirect based on the wallet status check
  // return <Redirect href="/onboarding" />;
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    ); // Or any other loading indicator
  }

  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }
}
