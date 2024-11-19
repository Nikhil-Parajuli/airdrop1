export interface Asset {
  id: string;
  type: 'airdrop' | 'nft';
  name: string;
  value: string;
  chain: string;
  expiresIn: string;
  imageUrl: string;
  claimUrl: string;
}

export interface WalletData {
  assets: Asset[];
  totalValue: number;
  chains: string[];
  isPremium: boolean;
}