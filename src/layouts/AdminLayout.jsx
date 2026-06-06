
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
    ChevronDown,
    Sun,
    Moon,
    CheckCheck,
    Tag,
    UserPlus,
    PackageCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIF_ICONS = {
    order: PackageCheck,
    product: Tag,
    customer: UserPlus,
};

const INITIAL_NOTIFICATIONS = [
    { id: 'n1', type: 'order', title: 'New order received', body: 'A customer just placed a new order. Review it in Orders.', time: 'Just now', to: '/admin/orders', read: false },
    { id: 'n2', type: 'customer', title: 'New customer signed up', body: 'A new account was created in your store.', time: '2 hours ago', to: '/admin/customers', read: false },
    { id: 'n3', type: 'product', title: 'Low stock alert', body: 'Some products are running low. Check your catalog.', time: 'Yesterday', to: '/admin/products', read: true },
];

const AdminLayout = () => {
    const { currentUser, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;
    const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
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
                    top: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 50,
                    transition: 'transform 0.3s ease',
                    flexShrink: 0,
                    overflowY: 'auto'
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

                <div style={{ padding: '16px 12px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 18px)' }}>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="admin-icon-btn"
                        >
                            {isDark ? <Sun size={20} color="var(--color-text-muted)" /> : <Moon size={20} color="var(--color-text-muted)" />}
                        </button>

                        <div ref={notifRef} style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setNotifOpen((v) => !v)}
                                aria-label="Notifications"
                                className="admin-icon-btn"
                                style={{ position: 'relative' }}
                            >
                                <Bell size={20} color="var(--color-text-muted)" />
                                {unreadCount > 0 && (
                                    <span style={{ position: 'absolute', top: 2, right: 2, minWidth: '16px', height: '16px', padding: '0 4px', fontSize: '0.62rem', fontWeight: 700, color: '#fff', backgroundColor: 'var(--color-error)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-surface)' }}>{unreadCount}</span>
                                )}
                            </button>

                            <AnimatePresence>
                                {notifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="admin-notif-panel"
                                        style={{
                                            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                                            width: 'min(340px, calc(100vw - 24px))', maxHeight: '420px', display: 'flex', flexDirection: 'column',
                                            backgroundColor: 'var(--color-elevated)', borderRadius: '16px',
                                            border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-premium)', overflow: 'hidden', zIndex: 50,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--color-border)' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</div>
                                            {unreadCount > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={markAllRead}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 600 }}
                                                >
                                                    <CheckCheck size={15} /> Mark all read
                                                </button>
                                            )}
                                        </div>

                                        <div style={{ overflowY: 'auto', flex: 1 }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                                        <Bell size={22} color="var(--color-text-subtle)" />
                                                    </div>
                                                    <div style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>You're all caught up</div>
                                                    <div style={{ fontSize: '0.82rem' }}>No new notifications right now.</div>
                                                </div>
                                            ) : (
                                                notifications.map((n) => {
                                                    const NIcon = NOTIF_ICONS[n.type] || Bell;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={n.id}
                                                            onClick={() => { setNotifOpen(false); if (n.to) navigate(n.to); }}
                                                            style={{
                                                                width: '100%', display: 'flex', gap: '12px', alignItems: 'flex-start', textAlign: 'left',
                                                                padding: '13px 16px', border: 'none', borderBottom: '1px solid var(--color-border)',
                                                                background: n.read ? 'transparent' : 'var(--color-accent-soft)', cursor: 'pointer',
                                                            }}
                                                        >
                                                            <span style={{ width: '34px', height: '34px', flexShrink: 0, borderRadius: '10px', background: 'var(--gradient-brand-soft)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <NIcon size={17} />
                                                            </span>
                                                            <span style={{ minWidth: 0 }}>
                                                                <span style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>{n.title}</span>
                                                                <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{n.body}</span>
                                                                <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--color-text-subtle)', marginTop: '3px' }}>{n.time}</span>
                                                            </span>
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

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
