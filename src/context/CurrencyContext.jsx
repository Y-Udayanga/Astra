/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

// The catalog is priced in USD. Everything shown to the customer is converted
// from this base into the currency they pick (USD or LKR).
const BASE_CURRENCY = 'USD';

// Only two currencies are supported, each tied to a country in the picker.
export const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', label: 'US Dollar', position: 'prefix', decimals: 2 },
    LKR: { code: 'LKR', symbol: 'Rs', label: 'Sri Lankan Rupee', position: 'prefix-space', decimals: 0 },
};

export const COUNTRIES = [
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', currency: 'LKR' },
    { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
];

// Sensible fallback if the live FX lookup fails (USD -> LKR).
const FALLBACK_RATE_LKR = 300;

const STORAGE_KEY = 'astra_country';

const getCountryByCode = (code) => COUNTRIES.find((c) => c.code === code);

export const CurrencyProvider = ({ children }) => {
    // Default to Sri Lanka for this store; overridden by saved choice / geo-IP.
    const [countryCode, setCountryCode] = useState('LK');
    // Live exchange rates relative to the USD base. rates.USD is always 1.
    const [rates, setRates] = useState({ USD: 1, LKR: FALLBACK_RATE_LKR });
    // True once we've resolved the initial country (saved pref or geo lookup),
    // so we don't flash the wrong currency before detection completes.
    const [detected, setDetected] = useState(false);

    const country = getCountryByCode(countryCode) || COUNTRIES[0];
    const currency = country.currency;
    const meta = CURRENCIES[currency] || CURRENCIES[BASE_CURRENCY];

    // 1) Resolve the customer's country: saved choice first, otherwise geo-IP.
    useEffect(() => {
        let active = true;

        const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved && getCountryByCode(saved)) {
            setCountryCode(saved);
            setDetected(true);
            return;
        }

        // Auto-detect via a free IP geolocation service. Anything that isn't
        // Sri Lanka falls back to the USD / United States option.
        fetch('https://ipapi.co/json/')
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('geo lookup failed'))))
            .then((data) => {
                if (!active) return;
                const code = data?.country_code === 'LK' ? 'LK' : 'US';
                setCountryCode(code);
            })
            .catch(() => { /* keep default */ })
            .finally(() => { if (active) setDetected(true); });

        return () => { active = false; };
    }, []);

    // 2) Fetch the live USD -> LKR rate so converted prices track the market.
    useEffect(() => {
        let active = true;
        fetch('https://open.er-api.com/v6/latest/USD')
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('rate lookup failed'))))
            .then((data) => {
                const lkr = data?.rates?.LKR;
                if (active && typeof lkr === 'number' && lkr > 0) {
                    setRates({ USD: 1, LKR: lkr });
                }
            })
            .catch((err) => console.error('Failed to load FX rate, using fallback', err));
        return () => { active = false; };
    }, []);

    // Convert an amount in the base (USD) into the active display currency.
    const convert = useCallback(
        (amountInBase, toCurrency = currency) => {
            const rate = rates[toCurrency] ?? 1;
            return Number(amountInBase || 0) * rate;
        },
        [rates, currency]
    );

    // Format a base (USD) amount for display in the active currency.
    const format = useCallback(
        (amountInBase) => {
            const value = convert(amountInBase, currency);
            const text = value.toLocaleString(undefined, {
                minimumFractionDigits: meta.decimals,
                maximumFractionDigits: meta.decimals,
            });
            return meta.position === 'prefix-space' ? `${meta.symbol} ${text}` : `${meta.symbol}${text}`;
        },
        [convert, currency, meta]
    );

    const setCountry = useCallback((code) => {
        if (!getCountryByCode(code)) return;
        setCountryCode(code);
        try { localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }
    }, []);

    // Backward-compatible: admin Settings calls setCurrency(code). Map the
    // currency back to its matching country so the picker stays in sync.
    const setCurrency = useCallback((code) => {
        const match = COUNTRIES.find((c) => c.currency === code);
        if (match) setCountry(match.code);
    }, [setCountry]);

    const value = useMemo(
        () => ({
            // currency state
            currency,
            symbol: meta.symbol,
            currencyMeta: meta,
            baseCurrency: BASE_CURRENCY,
            // country state
            country,
            countryCode,
            countries: COUNTRIES,
            detected,
            // rates / helpers
            rateToLKR: rates.LKR,
            convert,
            format,
            setCountry,
            setCurrency,
        }),
        [currency, meta, country, countryCode, detected, rates.LKR, convert, format, setCountry, setCurrency]
    );

    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
