import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getCustomers } from '../../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadCustomers = async () => {
            const rows = await getCustomers();
            if (active) {
                setCustomers(rows);
            }
        };

        loadCustomers().catch((error) => {
            console.error('Failed to load customers', error);
            setError(error.message);
        });

        return () => {
            active = false;
        };
    }, []);

    const handleViewProfile = (customer) => {
        window.alert(`${customer.name}\n${customer.email}\nRole: ${customer.role}`);
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', marginBottom: '8px' }}>Customers</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your customer base.</p>
            </div>

            {error && (
                <div style={{ marginBottom: '16px', color: 'var(--color-error)' }}>{error}</div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                gap: '24px'
            }}>
                {customers.map((customer) => (
                    <div key={customer.id} style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
                            marginBottom: '16px',
                            backgroundImage: `url(${customer.avatar})`,
                            backgroundSize: 'cover'
                        }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>{customer.name}</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{customer.role}</p>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <Mail size={16} color="var(--color-text-muted)" />
                                <span>{customer.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <Phone size={16} color="var(--color-text-muted)" />
                                <span>Profile synced</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <MapPin size={16} color="var(--color-text-muted)" />
                                <span>Supabase</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleViewProfile(customer)}
                            style={{
                                marginTop: '20px',
                                padding: '8px 24px',
                                borderRadius: '20px',
                                border: '1px solid var(--color-accent)',
                                color: 'var(--color-accent)',
                                background: 'none',
                                cursor: 'pointer',
                                fontWeight: 500,
                                width: '100%'
                            }}
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;
