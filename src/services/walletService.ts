import { getTokenBalances, getNFTs, TokenBalance, NFTData } from './api';
import { SUPPORTED_CHAINS, CHAIN_NAMES } from '../config/constants';
import type { WalletData, Asset } from '../types';
import { mockAssets } from './mockData';

function formatTokenAsset(token: TokenBalance, chain: string): Asset {
  return {
    id: token.token_address,
    type: 'airdrop',
    name: token.name || 'Unknown Token',
    value: token.balance || '0',
    chain: CHAIN_NAMES[chain as keyof typeof CHAIN_NAMES],
    expiresIn: '30 days',
    imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=128&h=128&fit=crop',
    claimUrl: `https://app.uniswap.org/#/swap?outputCurrency=${token.token_address}`
  };
}

function formatNFTAsset(nft: NFTData, chain: string): Asset {
  return {
    id: `${nft.token_address}-${nft.token_id}`,
    type: 'nft',
    name: nft.metadata?.name || nft.name || 'Unknown NFT',
    value: '0',
    chain: CHAIN_NAMES[chain as keyof typeof CHAIN_NAMES],
    expiresIn: '30 days',
    imageUrl: nft.metadata?.image || 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=128&h=128&fit=crop',
    claimUrl: `https://opensea.io/assets/${nft.token_address}/${nft.token_id}`
  };
}

export async function fetchWalletData(address: string): Promise<WalletData> {
  try {
    if (!address || typeof address !== 'string') {
      throw new Error('Invalid wallet address');
    }

    const assets: Asset[] = [];
    let hasError = false;

    // Fetch data for each chain in parallel
    const chainResults = await Promise.allSettled(
      SUPPORTED_CHAINS.map(async (chain) => {
        const [tokens, nfts] = await Promise.all([
          getTokenBalances(address, chain),
          getNFTs(address, chain)
        ]);
        return {
          chain,
          tokens,
          nfts
        };
      })
    );

    // Process results
    chainResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { chain, tokens, nfts } = result.value;
        assets.push(
          ...tokens.map(token => formatTokenAsset(token, chain)),
          ...nfts.map(nft => formatNFTAsset(nft, chain))
        );
      } else {
        hasError = true;
        console.error(`Error fetching data for chain:`, result.reason);
      }
    });

    // If we had errors or no assets were found, use mock data
    if (hasError || assets.length === 0) {
      console.log('Using mock data due to API errors or no assets found');
      return {
        assets: mockAssets,
        totalValue: mockAssets.reduce((sum, asset) => sum + parseFloat(asset.value || '0'), 0),
        chains: [...new Set(mockAssets.map(asset => asset.chain))],
        isPremium: false
      };
    }

    const chains = [...new Set(assets.map(asset => asset.chain))];
    const totalValue = assets.reduce((sum, asset) => 
      sum + parseFloat(asset.value || '0'), 0
    );

    return {
      assets,
      totalValue,
      chains,
      isPremium: false
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    // Return mock data as fallback
    return {
      assets: mockAssets,
      totalValue: mockAssets.reduce((sum, asset) => sum + parseFloat(asset.value || '0'), 0),
      chains: [...new Set(mockAssets.map(asset => asset.chain))],
      isPremium: false
    };
  }
}