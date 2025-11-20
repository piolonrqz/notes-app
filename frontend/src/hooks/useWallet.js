import { useContext, useCallback } from 'react';
import { WalletContext } from '../context/WalletContext';

export const useWallet = () => {
    const context = useContext(WalletContext);

    if (!context) {
        throw new Error('useWallet must be used within WalletProvider');
    }

    const { state, connectWallet, disconnectWallet, getBalance } = context;

    const handleConnect = useCallback(async (walletName) => {
        try {
            await connectWallet(walletName);
        } catch (error) {
            console.error('Connection error:', error);
            throw error;
        }
    }, [connectWallet]);

    const handleDisconnect = useCallback(async () => {
        try {
            await disconnectWallet();
        } catch (error) {
            console.error('Disconnection error:', error);
            throw error;
        }
    }, [disconnectWallet]);

    const handleGetBalance = useCallback(async () => {
        try {
            const balance = await getBalance();
            return balance;
        } catch (error) {
            console.error('Balance fetch error:', error);
            throw error;
        }
    }, [getBalance]);

    return {
        isConnected: state.isConnected,
        walletAddress: state.walletAddress,
        balance: state.balance,
        loading: state.loading,
        error: state.error,
        connectWallet: handleConnect,
        disconnectWallet: handleDisconnect,
        getBalance: handleGetBalance,
    };
};