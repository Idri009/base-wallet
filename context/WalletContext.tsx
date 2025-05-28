import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createWallet,
  createWalletFromKey,
  storeWallet,
  retrieveWallet,
  walletExists,
  importFromPrivateKey,
  importFromMnemonic,
  getWalletBalance,
  sendTransaction,
  TokenBalance,
  Transaction
} from '@/utils/wallet'; // Assuming you've kept all your wallet functions in this file

// Define types for our context
interface WalletContextType {
  wallet: {
    address: string;
    privateKey: string;
    mnemonic: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;
  balance: string;
  isTestnet: boolean;
  tokenBalances: TokenBalance[];
  transactions: Transaction[];
  
  // Methods
  createNewWallet: () => Promise<void>;
  createNewWalletFromKey: () => Promise<void>;
  importWalletFromPrivateKey: (privateKey: string) => Promise<void>;
  importWalletFromMnemonic: (mnemonic: string) => Promise<void>;
  sendTokens: (toAddress: string, amount: string) => Promise<{ hash: string; explorerUrl: string }>;
  refreshBalance: () => Promise<void>;
  toggleNetwork: () => void;
  disconnectWallet: () => Promise<void>;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isLoading: false,
  error: null,
  balance: '0',
  isTestnet: false,
  tokenBalances: [],
  transactions: [],
  
  createNewWallet: async () => {},
  createNewWalletFromKey: async () => {},
  importWalletFromPrivateKey: async () => {},
  importWalletFromMnemonic: async () => {},
  sendTokens: async () => ({ hash: '', explorerUrl: '' }),
  refreshBalance: async () => {},
  toggleNetwork: () => {},
  disconnectWallet: async () => {},
});

// Create provider component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<{
    address: string;
    privateKey: string;
    mnemonic: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isTestnet, setIsTestnet] = useState<boolean>(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize wallet on app start
  useEffect(() => {
    const initWallet = async () => {
      try {
        setIsLoading(true);
        const exists = await walletExists();
        
        if (exists) {
          const storedWallet = await retrieveWallet();
          if (storedWallet) {
            // Ensure mnemonic is string | null (not undefined)
            const walletData = {
              ...storedWallet,
              mnemonic: storedWallet.mnemonic || null
            };
            setWallet(walletData);
            
            // Get balance if wallet exists
            if (walletData.address) {
              const walletBalance = await getWalletBalance(walletData.address, isTestnet);
              setBalance(walletBalance);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    initWallet();
  }, [isTestnet]);

  // Create a new wallet
  const createNewWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newWallet = await createWallet();
      // Ensure mnemonic is string | null (not undefined)
      const walletData = {
        ...newWallet,
        mnemonic: newWallet.mnemonic || null
      };
      await storeWallet(walletData);
      setWallet(walletData);
      
      // Get initial balance
      const walletBalance = await getWalletBalance(newWallet.address, isTestnet);
      setBalance(walletBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Create wallet from key
  const createNewWalletFromKey = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newWallet = createWalletFromKey();
      // Ensure mnemonic is string | null (not undefined)
      const walletData = {
        ...newWallet,
        mnemonic: newWallet.mnemonic || null
      };
      await storeWallet(walletData);
      setWallet(walletData);
      
      // Get initial balance
      const walletBalance = await getWalletBalance(newWallet.address, isTestnet);
      setBalance(walletBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet from key');
    } finally {
      setIsLoading(false);
    }
  };

  // Import wallet from private key
  const importWalletFromPrivateKey = async (privateKey: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const importedWallet = importFromPrivateKey(privateKey);
      // Convert undefined to null for type compatibility
      const walletData = {
        ...importedWallet,
        mnemonic: importedWallet.mnemonic || null
      };
      await storeWallet(walletData);
      setWallet(walletData);
      
      // Get initial balance
      const walletBalance = await getWalletBalance(importedWallet.address, isTestnet);
      setBalance(walletBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Import wallet from mnemonic
  const importWalletFromMnemonic = async (mnemonic: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const importedWallet = importFromMnemonic(mnemonic);
      // Convert undefined to null for type compatibility
      const walletData = {
        ...importedWallet,
        mnemonic: importedWallet.mnemonic || null
      };
      await storeWallet(walletData);
      setWallet(walletData);
      
      // Get initial balance
      const walletBalance = await getWalletBalance(importedWallet.address, isTestnet);
      setBalance(walletBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Send transaction
  const sendTokens = async (toAddress: string, amount: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!wallet?.privateKey) {
        throw new Error('No wallet available');
      }
      
      const result = await sendTransaction(
        wallet.privateKey, 
        toAddress, 
        amount, 
        isTestnet
      );
      
      // Update balance after transaction
      await refreshBalance();
      
      // You might want to add the transaction to your state here
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'send',
        status: 'pending',
        amount,
        token: 'ETH',
        tokenSymbol: 'ETH',
        timestamp: Date.now(),
        hash: result.hash,
        to: toAddress,
        from: wallet.address,
        fee: '0.0001', // This should be calculated from the actual gas used
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send transaction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh wallet balance
  const refreshBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (wallet?.address) {
        const walletBalance = await getWalletBalance(wallet.address, isTestnet);
        setBalance(walletBalance);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh balance');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between mainnet and testnet
  const toggleNetwork = () => {
    setIsTestnet(prev => !prev);
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      // Clear wallet data from SecureStore
      await SecureStore.deleteItemAsync('wallet_data');
      await SecureStore.deleteItemAsync('wallet_created');
      
      // Clear state
      setWallet(null);
      setBalance('0');
      setTokenBalances([]);
      setTransactions([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    }
  };

  const contextValue: WalletContextType = {
    wallet,
    isLoading,
    error,
    balance,
    isTestnet,
    tokenBalances,
    transactions,
    
    createNewWallet,
    createNewWalletFromKey,
    importWalletFromPrivateKey,
    importWalletFromMnemonic,
    sendTokens,
    refreshBalance,
    toggleNetwork,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Add this import at the top if not already defined in your project
import * as SecureStore from 'expo-secure-store';