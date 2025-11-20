
export class WalletService {
    constructor(network = 'testnet') {
        this.network = network;
        this.wallet = null;
    }

    async connectWallet(walletName) {
        try {
            if (!window.cardano || !window.cardano[walletName]) {
                throw new Error(`${walletName} wallet not found. Please install it.`);
            }

            const walletAPI = window.cardano[walletName];
            const isEnabled = await walletAPI.enable();

            if (!isEnabled) {
                throw new Error('Failed to enable wallet');
            }

            this.wallet = walletAPI;
            return await this.getWalletInfo();
        } catch (error) {
            throw new Error(`Failed to connect wallet: ${error.message}`);
        }
    }

    async disconnectWallet() {
        this.wallet = null;
    }

    async getWalletInfo() {
        if (!this.wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            const addresses = await this.wallet.getUsedAddresses();
            const unusedAddresses = await this.wallet.getUnusedAddresses();
            const allAddresses = [...addresses, ...unusedAddresses];

            if (allAddresses.length === 0) {
                throw new Error('No addresses found in wallet');
            }

            return {
                address: allAddresses[0],
                addresses: allAddresses,
            };
        } catch (error) {
            throw new Error(`Failed to get wallet info: ${error.message}`);
        }
    }

    async getBalance() {
        if (!this.wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            const balance = await this.wallet.getBalance();
            return balance;
        } catch (error) {
            throw new Error(`Failed to get balance: ${error.message}`);
        }
    }

    async signTransaction(txHex) {
        if (!this.wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            const signature = await this.wallet.signTx(txHex);
            return signature;
        } catch (error) {
            throw new Error(`Failed to sign transaction: ${error.message}`);
        }
    }

    isConnected() {
        return this.wallet !== null;
    }
}

export const walletService = new WalletService();