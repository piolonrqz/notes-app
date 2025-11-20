
import React, { createContext, useReducer, useCallback } from 'react';
import { walletService } from '../services/walletService';

export const WalletContext = createContext();

const initialState = {
    isConnected: false,
    walletAddress: null,
    balance: null,
    loading: false,
    error: null,
};

const walletReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'CONNECT_SUCCESS':
            return {
                ...state,
                isConnected: true,
                walletAddress: action.payload.address,
                loading: false,
                error: null,
            };
        case 'DISCONNECT':
            return initialState;
        case 'SET_BALANCE':
            return { ...state, balance: action.payload };
        default:
            return state;
    }
};

export const WalletProvider = ({ children }) => {
    const [state, dispatch] = useReducer(walletReducer, initialState);

    const connectWallet = useCallback(async (walletName) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const walletInfo = await walletService.connectWallet(walletName);
            dispatch({ type: 'CONNECT_SUCCESS', payload: walletInfo });
            const balance = await walletService.getBalance();
            dispatch({ type: 'SET_BALANCE', payload: balance });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    }, []);

    const disconnectWallet = useCallback(async () => {
        try {
            await walletService.disconnectWallet();
            dispatch({ type: 'DISCONNECT' });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    }, []);

    const getBalance = useCallback(async () => {
        try {
            const balance = await walletService.getBalance();
            dispatch({ type: 'SET_BALANCE', payload: balance });
            return balance;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    }, []);

    const value = {
        state,
        connectWallet,
        disconnectWallet,
        getBalance,
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};