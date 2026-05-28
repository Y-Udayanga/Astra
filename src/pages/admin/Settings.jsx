
import React from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
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
                            <input type="text" defaultValue="ASTRA Store" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Support Email</label>
                            <input type="email" defaultValue="support@astra.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Currency</label>
                            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }}>
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button style={{
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
                    }}>
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
