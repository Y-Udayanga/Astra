
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/admin/customers', label: 'Customers', icon: Users },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)', fontFamily: 'var(--font-family-body)' }}>

            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="admin-sidebar-backdrop"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: '#000',
                            zIndex: 40
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
                style={{
                    width: '260px',
                    backgroundColor: 'var(--color-surface)',
                    borderRight: '1px solid var(--color-border)',
                    height: '100vh',
                    top: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 50,
                    transition: 'transform 0.3s ease',
                    flexShrink: 0
                }}
            >
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--color-accent), #ec4899)', borderRadius: '8px' }}></div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-family-display)' }}>ASTRA Admin</span>
                    </div>
                    <button
                        type="button"
                        className="admin-sidebar-close-btn"
                        onClick={() => setSidebarOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <X size={20} color="var(--color-text-muted)" />
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '24px 12px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                            backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                            fontWeight: isActive ? 600 : 500,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        type="button"
                        onClick={logout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-error)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Topbar */}
                <header style={{
                    height: '70px',
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 30
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            type="button"
                            className="admin-sidebar-toggle"
                            onClick={toggleSidebar}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <Menu size={24} color="var(--color-text-main)" />
                        </button>
                        <div className="admin-topbar-search" style={{ position: 'relative' }}>
                            <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{
                                    padding: '8px 8px 8px 36px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background)',
                                    color: 'var(--color-text-main)',
                                    outline: 'none',
                                    width: '240px'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                            type="button"
                            onClick={() => window.alert('No new notifications.')}
                            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <Bell size={20} color="var(--color-text-muted)" />
                            <span style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', backgroundColor: 'var(--color-error)', borderRadius: '50%' }}></span>
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="admin-user-info" style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser?.name || "Admin"}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Administrator</div>
                            </div>
                            <img
                                src={currentUser?.avatar || "https://ui-avatars.com/api/?name=Admin+User"}
                                alt="Profile"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid var(--color-border)'
                                }}
                            />
                        </div>
                    </div>
                </header>

                <main style={{ flex: 1, padding: 'clamp(12px, 2vw, 24px)', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
