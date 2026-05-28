
import React from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const Products = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', marginBottom: '8px' }}>Products</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your product catalog</p>
                </div>
                <button style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                }}>
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                overflow: 'hidden'
            }}>
                {/* Filters Bar */}
                <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                        <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-background)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: 'var(--color-text-main)'
                    }}>
                        <Filter size={18} />
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-background)' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Product</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Category</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Price</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Stock</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '8px' }}></div>
                                            <span style={{ fontWeight: 500 }}>Premium Watch Series {item}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>Electronics</td>
                                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>$299.00</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>45 in stock</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10B981',
                                            fontWeight: 500
                                        }}>
                                            Active
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                                                <Edit2 size={18} />
                                            </button>
                                            <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-danger)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;
