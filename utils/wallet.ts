// This is a mock implementation for UI purposes
// In a real application, this would integrate with actual blockchain libraries

// Mock wallet data
export interface Wallet {
  address: string;
  balance: string;
  balanceUsd: string;
  privateKey?: string;
  mnemonic?: string;
  tokens: TokenBalance[];
  transactions: Transaction[];
}

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

// Mock wallet creation function
export const createWallet = (): Wallet => {
  return {
    address: '0x' + generateRandomHex(40),
    balance: '0.00',
    balanceUsd: '0.00',
    privateKey: '0x' + generateRandomHex(64),
    mnemonic: generateMockMnemonic(),
    tokens: [],
    transactions: [],
  };
};

// Mock import wallet function
export const importWalletFromMnemonic = (mnemonic: string): Wallet => {
  return {
    address: '0x' + generateRandomHex(40),
    balance: '1.45',
    balanceUsd: '4,371.22',
    mnemonic,
    tokens: getMockTokens(),
    transactions: getMockTransactions(),
  };
};

export const importWalletFromPrivateKey = (privateKey: string): Wallet => {
  return {
    address: '0x' + generateRandomHex(40),
    balance: '1.45',
    balanceUsd: '4,371.22',
    privateKey,
    tokens: getMockTokens(),
    transactions: getMockTransactions(),
  };
};

// Helper functions
const generateRandomHex = (length: number): string => {
  const characters = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateMockMnemonic = (): string => {
  const words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent',
    'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident',
    'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire'
  ];
  
  let mnemonic = '';
  for (let i = 0; i < 12; i++) {
    mnemonic += words[Math.floor(Math.random() * words.length)];
    if (i < 11) mnemonic += ' ';
  }
  
  return mnemonic;
};

// Mock data functions
export const getMockTokens = (): TokenBalance[] => {
  return [
    {
      id: '1',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: '1.45',
      balanceUsd: '4,371.22',
      priceUsd: '3,014.64',
      priceChange: 2.34,
      contractAddress: '',
      decimals: 18,
      iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      id: '2',
      name: 'USD Coin',
      symbol: 'USDC',
      balance: '530.82',
      balanceUsd: '530.82',
      priceUsd: '1.00',
      priceChange: 0.01,
      contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    {
      id: '3',
      name: 'Chainlink',
      symbol: 'LINK',
      balance: '25.75',
      balanceUsd: '325.23',
      priceUsd: '12.63',
      priceChange: -1.45,
      contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
      decimals: 18,
      iconUrl: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
    },
    {
      id: '4',
      name: 'Aave',
      symbol: 'AAVE',
      balance: '2.14',
      balanceUsd: '178.21',
      priceUsd: '83.28',
      priceChange: 4.67,
      contractAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      decimals: 18,
      iconUrl: 'https://cryptologos.cc/logos/aave-aave-logo.png'
    }
  ];
};

export const getMockTransactions = (): Transaction[] => {
  return [
    {
      id: '1',
      type: 'receive',
      status: 'confirmed',
      amount: '0.5',
      token: 'ETH',
      tokenSymbol: 'ETH',
      timestamp: Date.now() - 3600000, // 1 hour ago
      hash: '0x' + generateRandomHex(64),
      to: '0x' + generateRandomHex(40),
      from: '0x' + generateRandomHex(40),
      fee: '0.002'
    },
    {
      id: '2',
      type: 'send',
      status: 'confirmed',
      amount: '100',
      token: 'USDC',
      tokenSymbol: 'USDC',
      timestamp: Date.now() - 86400000, // 1 day ago
      hash: '0x' + generateRandomHex(64),
      to: '0x' + generateRandomHex(40),
      from: '0x' + generateRandomHex(40),
      fee: '0.001'
    },
    {
      id: '3',
      type: 'swap',
      status: 'confirmed',
      amount: '0.2',
      token: 'ETH-LINK',
      tokenSymbol: 'ETH → LINK',
      timestamp: Date.now() - 172800000, // 2 days ago
      hash: '0x' + generateRandomHex(64),
      to: '0x' + generateRandomHex(40),
      from: '0x' + generateRandomHex(40),
      fee: '0.0015'
    },
    {
      id: '4',
      type: 'approve',
      status: 'confirmed',
      amount: '0',
      token: 'AAVE',
      tokenSymbol: 'AAVE',
      timestamp: Date.now() - 259200000, // 3 days ago
      hash: '0x' + generateRandomHex(64),
      to: '0x' + generateRandomHex(40),
      from: '0x' + generateRandomHex(40),
      fee: '0.001'
    },
    {
      id: '5',
      type: 'send',
      status: 'pending',
      amount: '0.1',
      token: 'ETH',
      tokenSymbol: 'ETH',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      hash: '0x' + generateRandomHex(64),
      to: '0x' + generateRandomHex(40),
      from: '0x' + generateRandomHex(40),
      fee: '0.002'
    }
  ];
};

// Mock transaction functions
export const sendToken = (
  amount: string,
  tokenSymbol: string,
  toAddress: string
): Promise<Transaction> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'send',
        status: 'pending',
        amount,
        token: tokenSymbol,
        tokenSymbol,
        timestamp: Date.now(),
        hash: '0x' + generateRandomHex(64),
        to: toAddress,
        from: '0x' + generateRandomHex(40),
        fee: '0.002'
      };
      
      resolve(transaction);
    }, 1500);
  });
};

export const swapTokens = (
  fromAmount: string,
  fromToken: string,
  toToken: string
): Promise<Transaction> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'swap',
        status: 'pending',
        amount: fromAmount,
        token: `${fromToken}-${toToken}`,
        tokenSymbol: `${fromToken} → ${toToken}`,
        timestamp: Date.now(),
        hash: '0x' + generateRandomHex(64),
        to: '0x' + generateRandomHex(40),
        from: '0x' + generateRandomHex(40),
        fee: '0.0025'
      };
      
      resolve(transaction);
    }, 2000);
  });
};