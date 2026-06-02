/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoreSettings } from '../services/api';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

// Symbols / formatting per supported currency. Prices are stored as plain
// numbers; switching currency swaps the symbol shown across the storefront.
const CURRENCIES = {
    USD: { symbol: '$', position: 'prefix' },
    EUR: { symbol: '€', position: 'prefix' },
    GBP: { symbol: '£', position: 'prefix' },
    LKR: { symbol: 'Rs.', position: 'prefix-space' },
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrencyState] = useState('USD');

    useEffect(() => {
        let active = true;
        getStoreSettings()
            .then((s) => { if (active && s?.currency && CURRENCIES[s.currency]) setCurrencyState(s.currency); })
            .catch((err) => console.error('Failed to load store currency', err));
        return () => { active = false; };
    }, []);

    const meta = CURRENCIES[currency] || CURRENCIES.USD;

    const format = useCallback((amount) => {
        const n = Number(amount || 0);
        const value = n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return meta.position === 'prefix-space' ? `${meta.symbol} ${value}` : `${meta.symbol}${value}`;
    }, [meta]);

    // Allow the admin Settings page to update the symbol live (no reload).
    const setCurrency = useCallback((code) => {
        if (CURRENCIES[code]) setCurrencyState(code);
    }, []);

    return (
        <CurrencyContext.Provider value={{ currency, symbol: meta.symbol, format, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};
