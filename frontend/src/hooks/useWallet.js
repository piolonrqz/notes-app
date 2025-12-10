import { useWalletContext } from '../context/walletContext';

export const useWallet = () => {
    const context = useWalletContext();

    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }

    return context;
};