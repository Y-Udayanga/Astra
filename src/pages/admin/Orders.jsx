import React, { useEffect, useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { getOrders } from '../../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadOrders = async () => {
            const rows = await getOrders();
            if (active) {
                setOrders(rows);
                setSelectedOrder(rows[0] ?? null);
            }
        };

        loadOrders().catch((error) => {
            console.error('Failed to load orders', error);
            setError(error.message);
        });

        return () => {
            active = false;
        };
    }, []);

    const handleDownload = (order) => {
        const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${order.id}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', marginBottom: '8px' }}>Orders</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Track and manage customer orders.</p>
            </div>

            {error && (
                <div style={{ marginBottom: '16px', color: 'var(--color-error)' }}>{error}</div>
            )}

            {selectedOrder && (
                <div style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ marginTop: 0 }}>Selected Order</h3>
                    <p style={{ marginBottom: '8px' }}><strong>ID:</strong> {selectedOrder.id}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Customer:</strong> {selectedOrder.customer}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Status:</strong> {selectedOrder.status}</p>
                    <p style={{ marginBottom: 0 }}><strong>Total:</strong> {selectedOrder.currency} {Number(selectedOrder.amount ?? 0).toFixed(2)}</p>
                </div>
            )}

            <div style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-background)' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Order ID</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Date</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Customer</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{order.id}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px 24px' }}>{order.customer}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{order.currency} {Number(order.amount ?? 0).toFixed(2)}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            backgroundColor: order.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: order.status === 'completed' ? '#10B981' : '#F59E0B',
                                            fontWeight: 500
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedOrder(order)}
                                                style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDownload(order)}
                                                style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                                            >
                                                <Download size={18} />
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

export default Orders;
