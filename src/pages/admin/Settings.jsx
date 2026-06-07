import React, { useEffect, useState } from 'react';
import { Save, Loader2, Check } from 'lucide-react';
import { getStoreSettings, saveStoreSettings } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';

const Settings = () => {
    const toast = useToast();
    const { setCurrency } = useCurrency();
    const [form, setForm] = useState({
        storeName: 'ASTRA Store',
        supportEmail: 'support@astra.com',
        currency: 'USD',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
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
        setSaving(true);
        try {
            const result = await saveStoreSettings(form);
            setError('');
            setCurrency(result.currency); // update currency symbol live across the app
            setSaved(true);
            toast.success(`Settings saved — currency is now ${result.currency}.`);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            toast.error(err.message || 'Failed to save settings.');
            setError(err.message);
        } finally {
            setSaving(false);
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
                                <option value="LKR">LKR (Rs)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={{ marginBottom: '16px', color: 'var(--color-error)', fontWeight: 500 }}>{error}</div>
                )}

                <div style={{ textAlign: 'right' }}>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            background: saved ? 'var(--color-success)' : 'var(--gradient-brand)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 32px',
                            borderRadius: '10px',
                            fontWeight: 600,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: 'var(--shadow-glow)',
                            transition: 'background 0.2s'
                        }}
                    >
                        {saving ? <><Loader2 size={20} className="animate-spin" /> Saving...</> : saved ? <><Check size={20} /> Saved!</> : <><Save size={20} /> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
