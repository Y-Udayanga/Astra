import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingBag, Users, Package, TrendingUp, TrendingDown,
  ArrowUpRight, RefreshCw, Plus, AlertTriangle, Boxes
} from 'lucide-react';
import { getCustomers, getOrders, getProducts } from '../../services/api';

// Orders are persisted in LKR (PayHere settlement currency), so the admin
// dashboard reports revenue in LKR directly rather than converting through the
// storefront's customer-facing currency.
const fmtCurrency = (n) => `Rs ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const statusMeta = {
  completed: { label: 'Completed', color: '#10B981' },
  processing: { label: 'Processing', color: '#3B82F6' },
  pending: { label: 'Pending', color: '#F59E0B' },
  failed: { label: 'Failed', color: '#EF4444' },
  cancelled: { label: 'Cancelled', color: '#EF4444' },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ products: [], orders: [], customers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [products, orders, customers] = await Promise.all([getProducts(), getOrders(), getCustomers()]);
      setData({ products, orders, customers });
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const analytics = useMemo(() => {
    const { products, orders, customers } = data;
    const totalRevenue = orders.reduce((s, o) => s + Number(o.amount || 0), 0);
    const completed = orders.filter((o) => o.status === 'completed');
    const avgOrder = orders.length ? totalRevenue / orders.length : 0;

    // Revenue for the last 7 days
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key,
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        revenue: 0,
        orders: 0,
      });
    }
    const dayMap = Object.fromEntries(days.map((d) => [d.key, d]));
    orders.forEach((o) => {
      const key = (o.createdAt || '').slice(0, 10);
      if (dayMap[key]) { dayMap[key].revenue += Number(o.amount || 0); dayMap[key].orders += 1; }
    });
    const maxRevenue = Math.max(...days.map((d) => d.revenue), 1);

    // Status breakdown
    const statusCounts = {};
    orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

    // Top products by stock value & low stock
    const lowStock = [...products].filter((p) => Number(p.stock) <= 10).sort((a, b) => a.stock - b.stock).slice(0, 5);
    const topProducts = [...products].sort((a, b) => Number(b.price) * Number(b.stock) - Number(a.price) * Number(a.stock)).slice(0, 5);

    return {
      totalRevenue,
      avgOrder,
      completedCount: completed.length,
      days,
      maxRevenue,
      statusCounts,
      lowStock,
      topProducts,
      activeProducts: products.filter((p) => p.status === 'active').length,
      recentOrders: orders.slice(0, 6),
      recentCustomers: customers.slice(0, 5),
    };
  }, [data]);

  const stats = [
    { label: 'Total Revenue', value: fmtCurrency(analytics.totalRevenue), sub: `Avg ${fmtCurrency(analytics.avgOrder)}/order`, icon: DollarSign, color: '#6366F1', trend: 12.5 },
    { label: 'Total Orders', value: data.orders.length, sub: `${analytics.completedCount} completed`, icon: ShoppingBag, color: '#EC4899', trend: 8.2 },
    { label: 'Customers', value: data.customers.length, sub: 'Registered users', icon: Users, color: '#10B981', trend: 5.1 },
    { label: 'Active Products', value: analytics.activeProducts, sub: `${data.products.length} total`, icon: Package, color: '#F59E0B', trend: -2.3 },
  ];

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const item = { hidden: { y: 18, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', marginBottom: '6px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={load} style={secondaryBtn}>
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={() => navigate('/admin/products')} style={primaryBtn}>
            <Plus size={17} /> Add Product
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* KPI cards */}
      <motion.div variants={container} initial="hidden" animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(230px, 100%), 1fr))', gap: '20px', marginBottom: '24px' }}>
        {stats.map((stat) => {
          const up = stat.trend >= 0;
          return (
            <motion.div key={stat.label} variants={item} style={card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '13px', backgroundColor: `${stat.color}1f`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={23} />
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', fontWeight: 700,
                  color: up ? 'var(--color-success)' : 'var(--color-error)',
                  backgroundColor: up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 8px', borderRadius: 'var(--radius-full)',
                }}>
                  {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{Math.abs(stat.trend)}%
                </span>
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'var(--font-family-display)', lineHeight: 1 }}>
                {loading ? '—' : stat.value}
              </div>
              <div style={{ color: 'var(--color-text-main)', fontWeight: 600, marginTop: '8px' }}>{stat.label}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>{stat.sub}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue chart */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ ...card, gridColumn: 'span 1', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '2px' }}>Revenue (Last 7 Days)</h3>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Daily order revenue</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-accent)' }}>
              {fmtCurrency(analytics.days.reduce((s, d) => s + d.revenue, 0))}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', height: '200px' }}>
            {analytics.days.map((d, i) => (
              <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%' }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.revenue / analytics.maxRevenue) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 90 }}
                    title={fmtCurrency(d.revenue)}
                    style={{
                      width: '70%', minHeight: d.revenue > 0 ? '6px' : '3px', borderRadius: '8px 8px 0 0',
                      background: d.revenue > 0 ? 'var(--gradient-brand)' : 'var(--color-border)',
                      boxShadow: d.revenue > 0 ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status breakdown */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={card}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Order Status</h3>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Breakdown of {data.orders.length} orders</span>
          <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.keys(statusMeta).filter((s) => analytics.statusCounts[s]).length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No orders to analyze yet.</p>
            )}
            {Object.entries(statusMeta).map(([key, meta]) => {
              const count = analytics.statusCounts[key] || 0;
              if (!count) return null;
              const pct = data.orders.length ? Math.round((count / data.orders.length) * 100) : 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: meta.color }} />{meta.label}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{count} · {pct}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-surface-2)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.4 }} style={{ height: '100%', backgroundColor: meta.color, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent orders + Low stock */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '24px', marginBottom: '24px' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ ...card, gridColumn: 'span 1' }}>
          <SectionHeader title="Recent Orders" onAction={() => navigate('/admin/orders')} />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', minWidth: '360px' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)' }}>
                  <th style={th}>Order</th><th style={th}>Customer</th><th style={th}>Status</th><th style={{ ...th, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentOrders.length ? analytics.recentOrders.map((o) => {
                  const meta = statusMeta[o.status] || statusMeta.pending;
                  return (
                    <tr key={o.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td style={{ ...td, fontWeight: 600 }}>{o.id}</td>
                      <td style={td}>{o.customer}</td>
                      <td style={td}>
                        <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, backgroundColor: `${meta.color}1f`, color: meta.color, textTransform: 'capitalize' }}>{o.status}</span>
                      </td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>{o.currency} {Number(o.amount).toFixed(2)}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={4} style={{ ...td, color: 'var(--color-text-muted)' }}>No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Low Stock Alerts</h3>
          </div>
          {analytics.lowStock.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analytics.lowStock.map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-surface-2)', backgroundImage: p.image ? `url(${p.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.category}</div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700,
                    backgroundColor: p.stock === 0 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                    color: p.stock === 0 ? 'var(--color-error)' : 'var(--color-warning)',
                  }}>{p.stock} left</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>All products are well stocked. 🎉</p>
          )}
        </motion.div>
      </div>

      {/* Top products + Recent customers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '24px' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Boxes size={18} style={{ color: 'var(--color-accent)' }} />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Top Inventory Value</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {analytics.topProducts.length ? analytics.topProducts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '24px', fontWeight: 800, color: 'var(--color-text-subtle)' }}>#{i + 1}</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-surface-2)', backgroundImage: p.image ? `url(${p.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>${Number(p.price).toFixed(2)} · {p.stock} in stock</div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{fmtCurrency(Number(p.price) * Number(p.stock))}</span>
              </div>
            )) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No products yet.</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} style={card}>
          <SectionHeader title="New Customers" onAction={() => navigate('/admin/customers')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {analytics.recentCustomers.length ? analytics.recentCustomers.map((c) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={c.avatar} alt={c.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', backgroundColor: 'var(--color-surface-2)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-full)', backgroundColor: c.role === 'admin' ? 'var(--color-accent-soft)' : 'var(--color-surface-2)', color: c.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-muted)', textTransform: 'capitalize' }}>{c.role}</span>
              </div>
            )) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No customers yet.</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const card = {
  backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '16px',
  border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
};
const th = { padding: '8px 10px', fontWeight: 600, fontSize: '0.78rem' };
const td = { padding: '12px 10px' };
const primaryBtn = {
  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px',
  background: 'var(--gradient-brand)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-glow)',
};
const secondaryBtn = {
  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px',
  background: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', fontWeight: 600, cursor: 'pointer',
};

const SectionHeader = ({ title, onAction }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
    <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{title}</h3>
    <button onClick={onAction} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
      View all <ArrowUpRight size={15} />
    </button>
  </div>
);

export default Dashboard;
