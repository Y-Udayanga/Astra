import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getStoreSettings, saveStoreSettings } from '../../services/api';

const Settings = () => {
    const [form, setForm] = useState({
        storeName: 'ASTRA Store',
        supportEmail: 'support@astra.com',
        currency: 'USD',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadSettings = async () => {
            const settings = await getStoreSettings();
            if (active && settings) {
                setForm({
                    storeName: settings.storeName,
                    supportEmail: settings.supportEmail,
                    currency: settings.currency,
                });
            }
        };

        loadSettings().catch((error) => {
            console.error('Failed to load settings', error);
            setError(error.message);
        });

        return () => {
            active = false;
        };
    }, []);

    const handleChange = (field) => (event) => {
        setForm((current) => ({ ...current, [field]: event.target.value }));
    };

    const handleSave = async () => {
        try {
            const saved = await saveStoreSettings(form);
            setError('');
            setMessage(`Saved ${saved.storeName}`);
        } catch (error) {
            setMessage('');
            setError(error.message);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', marginBottom: '8px' }}>Settings</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Configure store preferences.</p>
            </div>

            <div style={{ maxWidth: '800px' }}>
                <div style={{
                    backgroundColor: 'var(--color-surface)',
                    padding: 'clamp(20px, 3vw, 32px)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>General Information</h3>

                    <div style={{ display: 'grid', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Store Name</label>
                            <input type="text" value={form.storeName} onChange={handleChange('storeName')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Support Email</label>
                            <input type="email" value={form.supportEmail} onChange={handleChange('supportEmail')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Currency</label>
                            <select value={form.currency} onChange={handleChange('currency')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }}>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="LKR">LKR (Rs.)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {message && (
                    <div style={{ marginBottom: '16px', color: 'var(--color-accent)', fontWeight: 500 }}>{message}</div>
                )}
                {error && (
                    <div style={{ marginBottom: '16px', color: 'var(--color-error)', fontWeight: 500 }}>{error}</div>
                )}

                <div style={{ textAlign: 'right' }}>
                    <button
                        type="button"
                        onClick={handleSave}
                        style={{
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 32px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
