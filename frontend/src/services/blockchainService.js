
import { walletService } from './walletService';

export class BlockchainService {
    constructor() {
        this.apiEndpoint = process.env.REACT_APP_BLOCKCHAIN_API || 'http://localhost:5000/api/blockchain';
    }

    async sendTransaction(toAddress, amount) {
        try {
            const response = await fetch(`${this.apiEndpoint}/transaction/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    toAddress,
                    amount,
                    fromAddress: walletService.wallet ? (await walletService.getWalletInfo()).address : null,
                }),
            });

            if (!response.ok) {
                throw new Error(`Transaction failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Failed to send transaction: ${error.message}`);
        }
    }

    async getTransactionStatus(txHash) {
        try {
            const response = await fetch(`${this.apiEndpoint}/transaction/status/${txHash}`);

            if (!response.ok) {
                throw new Error(`Status check failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Failed to get transaction status: ${error.message}`);
        }
    }

    async getUtxos(address) {
        try {
            const response = await fetch(`${this.apiEndpoint}/utxos/${address}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch UTXOs: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Failed to get UTXOs: ${error.message}`);
        }
    }

    async estimateFee(txHex) {
        try {
            const response = await fetch(`${this.apiEndpoint}/estimate-fee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ txHex }),
            });

            if (!response.ok) {
                throw new Error(`Fee estimation failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Failed to estimate fee: ${error.message}`);
        }
    }
}

export const blockchainService = new BlockchainService();