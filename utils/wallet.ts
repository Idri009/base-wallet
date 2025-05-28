import { Wallet, Mnemonic, JsonRpcProvider, formatEther, parseEther } from 'ethers';
import { Buffer } from 'buffer';
import * as SecureStore from 'expo-secure-store';
import { getRandomBytes } from 'expo-crypto';


// Base chain configuration
const BASE_CHAIN = {
  mainnet: {
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
  },
  testnet: {
    chainId: 84531,
    rpcUrl: 'https://goerli.base.org',
    explorerUrl: 'https://goerli.basescan.org',
  }
};

export interface TokenBalance {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  balanceUsd: string;
  priceUsd: string;
  priceChange: number;
  contractAddress: string;
  decimals: number;
  iconUrl: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  status: 'pending' | 'confirmed' | 'failed';
  amount: string;
  token: string;
  tokenSymbol: string;
  timestamp: number;
  hash: string;
  to: string;
  from: string;
  fee: string;
}

const customRandomBytes = (length: any) => {
  return getRandomBytes(length);
};

export const createWallet = async () => {
  try {
    // Create entropy using expo-crypto
    const entropy = customRandomBytes(16); // 16 bytes = 128 bits
    
    // Convert entropy to bip39 mnemonic
    const mnemonic = Mnemonic.fromEntropy(entropy).phrase;
    
    // Create wallet from mnemonic
    const wallet = Wallet.fromPhrase(mnemonic);
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic,
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to generate wallet: ');
  }
};



export const createWalletFromKey = () => {
  try {
    // Create a random private key using expo-crypto
    const privateKeyBytes = customRandomBytes(32); // 32 bytes = 256 bits
    const privateKey = '0x' + Buffer.from(privateKeyBytes).toString('hex');
    
    // Create wallet from private key
    const wallet = new Wallet(privateKey);
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: null, // No mnemonic when creating from private key
    };
  } catch (error) {
    console.error('Error creating wallet from key:', error);
    throw new Error('Failed to generate wallet: ' + error);
  }
};

export const storeWallet = async (walletData : any, biometricsEnabled = false) => {
  try {
    // Encrypt sensitive wallet data before storing
    const walletJson = JSON.stringify({
      address: walletData.address,
      privateKey: walletData.privateKey,
      mnemonic: walletData.mnemonic,
    });
    
    // Store wallet data
    await SecureStore.setItemAsync('wallet_data', walletJson);
    
    // Store flag indicating wallet creation
    await SecureStore.setItemAsync('wallet_created', 'true');
    
    return true;
  } catch (error) {
    console.error('Error storing wallet:', error);
    throw new Error('Failed to securely store wallet');
  }
};

export const retrieveWallet = async () => {
  try {
    const walletJson = await SecureStore.getItemAsync('wallet_data');

    if (!walletJson) {
      return null;
    }

    return JSON.parse(walletJson);
  } catch (error) {
    console.error('Error retrieving wallet:', error);
    throw new Error('Failed to retrieve wallet');
  }
};

export const walletExists = async () => {
  try {
    const exists = await SecureStore.getItemAsync('wallet_created');
    return exists === 'true';
  } catch (error) {
    return false;
  }
};

export const importFromPrivateKey = (privateKey: string) => {
  try {
    const wallet = new Wallet(privateKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: null, // Private key imports don't have mnemonics
    };
  } catch (error) {
    throw new Error('Invalid private key');
  }
};

export const importFromMnemonic = (mnemonic: string) => {
  try {
    const wallet = Wallet.fromPhrase(mnemonic);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase,
    };
  } catch (error) {
    throw new Error('Invalid mnemonic phrase');
  }
};


// Get wallet balance
export const getWalletBalance = async (address: string, isTestnet = false) => {
  try {
    const network = isTestnet ? BASE_CHAIN.testnet : BASE_CHAIN.mainnet;
    const provider = new JsonRpcProvider(network.rpcUrl);
    const balance = await provider.getBalance(address);
    return formatEther(balance); // Convert to ETH
  } catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Failed to fetch wallet balance');
  }
};

export const sendTransaction = async (
  privateKey: string, 
  toAddress : string, 
  amount : string, 
  isTestnet = false
) => {
  try {
    const network = isTestnet ? BASE_CHAIN.testnet : BASE_CHAIN.mainnet;
    const provider = new JsonRpcProvider(network.rpcUrl);
    
    // Create wallet instance with provider
    const wallet = new Wallet(privateKey, provider);
    
    // Convert ETH amount to wei
    const amountWei = parseEther(amount.toString());
    
    // Create transaction object
    const tx = {
      to: toAddress,
      value: amountWei,
    };
    
    // Send transaction
    const transaction = await wallet.sendTransaction(tx);
    
    // Return the transaction hash
    return {
      hash: transaction.hash,
      explorerUrl: `${network.explorerUrl}/tx/${transaction.hash}`,
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw new Error('Failed to send transaction');
  }
};