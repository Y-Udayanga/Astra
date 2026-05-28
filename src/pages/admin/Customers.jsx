
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Customers = () => {
    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', marginBottom: '8px' }}>Customers</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your customer base.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                gap: '24px'
            }}>
                {[1, 2, 3, 4, 5, 6].map((id) => (
                    <div key={id} style={{
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
                            backgroundImage: `url(https://ui-avatars.com/api/?name=User+${id}&background=random)`,
                            backgroundSize: 'cover'
                        }}></div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>Customer Name {id}</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Gold Member</p>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <Mail size={16} color="var(--color-text-muted)" />
                                <span>user{id}@example.com</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <Phone size={16} color="var(--color-text-muted)" />
                                <span>+1 234 567 890{id}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <MapPin size={16} color="var(--color-text-muted)" />
                                <span>New York, USA</span>
                            </div>
                        </div>

                        <button style={{
                            marginTop: '20px',
                            padding: '8px 24px',
                            borderRadius: '20px',
                            border: '1px solid var(--color-accent)',
                            color: 'var(--color-accent)',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: 500,
                            width: '100%'
                        }}>
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;
