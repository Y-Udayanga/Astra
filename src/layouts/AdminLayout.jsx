
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
    Search,
    Store,
    UserCircle,
    ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

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
                    <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--color-text-main)' }}>
                        <img src="/astra-logo.png" alt="ASTRA" style={{ height: '30px', width: 'auto', display: 'block', borderRadius: '7px' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-family-display)', color: 'var(--color-text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Admin</span>
                    </Link>
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
                                            backgroundColor: isActive ? 'var(--color-accent-soft)' : 'transparent',
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

                <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link
                        to="/"
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 16px', borderRadius: '8px', background: 'none',
                            border: '1px solid var(--color-border)', color: 'var(--color-text-main)',
                            cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', fontWeight: 500,
                        }}
                    >
                        <Store size={20} />
                        View Store
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
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
                            transition: 'all 0.2s',
                            fontWeight: 500,
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
                        <div ref={profileRef} style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setProfileOpen((v) => !v)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                                    background: 'none', border: 'none', padding: '4px 6px', borderRadius: 'var(--radius-full)',
                                }}
                            >
                                <div className="admin-user-info" style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser?.name || "Admin"}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Administrator</div>
                                </div>
                                <img
                                    src={currentUser?.avatar || "https://ui-avatars.com/api/?name=Admin+User"}
                                    alt="Profile"
                                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }}
                                />
                                <ChevronDown size={16} color="var(--color-text-muted)" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px',
                                            backgroundColor: 'var(--color-elevated)', borderRadius: '14px',
                                            border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-premium)', overflow: 'hidden', zIndex: 50, padding: '6px',
                                        }}
                                    >
                                        <AdminMenuItem icon={<UserCircle size={18} />} label="My Profile" onClick={() => { setProfileOpen(false); navigate('/profile'); }} />
                                        <AdminMenuItem icon={<Store size={18} />} label="View Store" onClick={() => { setProfileOpen(false); navigate('/'); }} />
                                        <AdminMenuItem icon={<Settings size={18} />} label="Settings" onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }} />
                                        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '6px 4px' }} />
                                        <AdminMenuItem icon={<LogOut size={18} />} label="Logout" danger onClick={handleLogout} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
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

const AdminMenuItem = ({ icon, label, onClick, danger }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '9px', border: 'none', background: 'transparent',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
            color: danger ? 'var(--color-error)' : 'var(--color-text-main)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = danger ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-2)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
        {icon}
        {label}
    </button>
);

export default AdminLayout;
