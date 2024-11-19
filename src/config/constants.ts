export const MORALIS_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjdiMWExMmZiLWQ2NzItNGQ1ZS1hMDIyLTNjMmYwYmRiNjdiNiIsIm9yZ0lkIjoiNDE1NjY2IiwidXNlcklkIjoiNDI3MTkzIiwidHlwZUlkIjoiNmJlOTE2ZDQtMTdhZS00NTVlLWFhOTMtYzRlZWFkZDFkNTBkIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzEzMDE4NDcsImV4cCI6NDg4NzA2MTg0N30.SP9zrzzu5JBHqRv86MUbSHdGNDJX1Awv4cX4oD-cID8';

export const SUPPORTED_CHAINS = [
  'eth',
  'polygon',
  'arbitrum',
  'optimism'
] as const;

export type SupportedChain = typeof SUPPORTED_CHAINS[number];

export const CHAIN_NAMES: Record<SupportedChain, string> = {
  eth: 'Ethereum',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism'
};