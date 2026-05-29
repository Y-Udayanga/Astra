import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { getCustomers, getOrders, getProducts } from '../../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        activeProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            const [products, orders, customers] = await Promise.all([
                getProducts(),
                getOrders(),
                getCustomers(),
            ]);

            if (!active) {
                return;
            }

            const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount ?? 0), 0);

            setSummary({
                totalRevenue,
                totalOrders: orders.length,
                totalCustomers: customers.length,
                activeProducts: products.filter((product) => product.status === 'active').length,
            });
            setRecentOrders(orders.slice(0, 4));
        };

        loadDashboard().catch((error) => {
            console.error('Failed to load dashboard data', error);
            setError(error.message);
        });

        return () => {
            active = false;
        };
    }, []);

    const stats = [
        { label: 'Total Revenue', value: `$${summary.totalRevenue.toLocaleString()}`, change: 'Live data', icon: DollarSign, color: '#6366F1' },
        { label: 'Total Orders', value: summary.totalOrders.toString(), change: 'Live data', icon: ShoppingBag, color: '#EC4899' },
        { label: 'New Customers', value: summary.totalCustomers.toString(), change: 'Live data', icon: Users, color: '#10B981' },
        { label: 'Active Products', value: summary.activeProducts.toString(), change: 'Live data', icon: TrendingUp, color: '#F59E0B' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', marginBottom: '8px' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Welcome back! Here's what's happening today.</p>
            </div>

            {error && (
                <div style={{ marginBottom: '16px', color: 'var(--color-error)' }}>{error}</div>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                }}
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{stat.value}</h3>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '8px',
                                fontSize: '0.8rem',
                                color: '#10B981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                padding: '2px 8px',
                                borderRadius: '4px'
                            }}>
                                {stat.change}
                            </span>
                        </div>
                        <div style={{
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: `${stat.color}20`,
                            color: stat.color
                        }}>
                            <stat.icon size={24} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '24px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Recent Orders</h3>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/orders')}
                            style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 500 }}
                        >
                            View All
                        </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '400px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 500 }}>Order ID</th>
                                    <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 500 }}>Customer</th>
                                    <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status</th>
                                    <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 500, textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '16px 0', fontWeight: 500 }}>{order.id}</td>
                                            <td style={{ padding: '16px 0' }}>{order.customer}</td>
                                            <td style={{ padding: '16px 0' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    backgroundColor: order.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: order.status === 'completed' ? '#10B981' : '#F59E0B'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 0', textAlign: 'right' }}>
                                                {order.currency} {Number(order.amount ?? 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '16px 0', color: 'var(--color-text-muted)' }}>No orders yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--color-border)',
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <h3 style={{ width: '100%', fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px', marginTop: 0 }}>Sales Overview</h3>
                    <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', paddingBottom: '20px' }}>
                        {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                            <div key={i} style={{
                                width: '100%',
                                height: `${h}%`,
                                backgroundColor: 'var(--color-accent)',
                                borderRadius: '4px 4px 0 0',
                                opacity: 0.8
                            }} />
                        ))}
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
