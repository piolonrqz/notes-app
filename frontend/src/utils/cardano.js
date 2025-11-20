
export const CARDANO_NETWORK = 'testnet';

export const SUPPORTED_WALLETS = ['nami', 'eternl', 'lace', 'begin'];

export const formatLovelace = (lovelace) => {
    if (!lovelace) return '0';
    const ada = BigInt(lovelace) / BigInt(1000000);
    const remainder = BigInt(lovelace) % BigInt(1000000);
    return `${ada}.${String(remainder).padStart(6, '0')}`;
};

export const lovelaceToAda = (lovelace) => {
    return Number(lovelace) / 1000000;
};

export const adaToLovelace = (ada) => {
    return Math.floor(Number(ada) * 1000000);
};

export const truncateAddress = (address, chars = 8) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const isValidAddress = (address) => {
    return /^addr[a-z0-9]{53,88}$/i.test(address);
};

export const getWalletIcon = (walletName) => {
    const icons = {
        nami: '🦊',
        eternl: '♾️',
        lace: '🎯',
        begin: '▶️',
    };
    return icons[walletName?.toLowerCase()] || '💼';
};