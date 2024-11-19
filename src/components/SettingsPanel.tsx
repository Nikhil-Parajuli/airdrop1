import React, { useState } from 'react';
import { X, Bell, Shield, Moon, Globe, User, Key, CreditCard, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { SubscriptionModal } from './SubscriptionModal';

interface SettingsPanelProps {
  onClose: () => void;
}

const DEMO_WALLETS = [
  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326'
];

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { user, signOut } = useAuth();
  const { connectWallet, wallet, disconnectWallet } = useWallet();
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showSubscription, setShowSubscription] = useState(false);

  const handleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password change
    alert('Password changed successfully!');
    setShowChangePassword(false);
    setOldPassword('');
    setNewPassword('');
  };

  const handleConnectMetamask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts[0]) {
          await connectWallet(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      // Use a random demo wallet if MetaMask is not available
      const randomWallet = DEMO_WALLETS[Math.floor(Math.random() * DEMO_WALLETS.length)];
      await connectWallet(randomWallet);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
        <div className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mt-16 mr-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => handleDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              <Key className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Change Password</span>
            </button>

            {showChangePassword && (
              <form onSubmit={handleChangePassword} className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Update Password
                </button>
              </form>
            )}

            {!user?.isPremium && (
              <button 
                onClick={() => setShowSubscription(true)}
                className="flex items-center space-x-3 w-full p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
              >
                <CreditCard className="w-5 h-5" />
                <span>Upgrade to Premium</span>
              </button>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              {wallet ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wallet className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {wallet.slice(0, 6)}...{wallet.slice(-4)}
                      </span>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleConnectMetamask}
                  className="flex items-center space-x-3 w-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={signOut}
                className="flex items-center space-x-3 w-full p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSubscription && (
        <SubscriptionModal onClose={() => setShowSubscription(false)} />
      )}
    </>
  );
}