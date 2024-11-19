import React, { useState } from 'react';
import { Search, Gift, Coins } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { WalletConnect } from './WalletConnect';
import { AssetCard } from './AssetCard';
import { SubscriptionModal } from './SubscriptionModal';
import { NotificationsPanel } from './NotificationsPanel';
import { SettingsPanel } from './SettingsPanel';

export function Dashboard() {
  const { wallet, walletData, loading } = useWallet();
  const [showSubscription, setShowSubscription] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!wallet || !walletData) {
    return <WalletConnect />;
  }

  const filteredAssets = walletData.assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.chain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedAssets = walletData.isPremium 
    ? filteredAssets 
    : filteredAssets.slice(0, 3);

  return (
    <div className="h-full">
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <Gift className="w-6 h-6" />
              <span className="text-xs opacity-75">Total Value</span>
            </div>
            <p className="text-2xl font-bold">${walletData.totalValue.toFixed(2)}</p>
            <p className="text-sm opacity-75">{walletData.assets.length} Assets Found</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-6 h-6" />
              <span className="text-xs opacity-75">Chains</span>
            </div>
            <p className="text-2xl font-bold">{walletData.chains.length}</p>
            <p className="text-sm opacity-75">Networks</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Available Claims</h2>
            <button 
              onClick={() => !walletData.isPremium && setShowSubscription(true)}
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              View All ({walletData.assets.length})
            </button>
          </div>
          <div className="space-y-3">
            {displayedAssets.map((asset) => (
              <AssetCard 
                key={asset.id} 
                asset={asset}
                onClaim={() => setShowSubscription(true)}
              />
            ))}
          </div>
        </div>
      </div>

      {showSubscription && (
        <SubscriptionModal onClose={() => setShowSubscription(false)} />
      )}
      
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}
      
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}