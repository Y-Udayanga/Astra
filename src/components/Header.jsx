import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Search, Menu, User, Sun, Moon, X,
  LogOut, LayoutDashboard, Package, UserCircle, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const DESKTOP_BREAKPOINT = '(min-width: 960px)';

// Drive layout off real viewport state instead of relying on inline-style
// vs `!important` cascade overrides, which are fragile and leave gaps
// between breakpoints.
const useMediaQuery = (query) => {
  const getMatch = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const handleChange = () => setMatches(mql.matches);
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

const Header = () => {
  const { cartCount, openCart } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin';

  // If the viewport grows to desktop while the mobile drawer is open, close it
  // so we never end up with two competing navs visible at once.
  useEffect(() => {
    if (isDesktop) setIsMobileMenuOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--header-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--header-border)',
        padding: '0.85rem clamp(0.9rem, 4vw, 2rem)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        boxShadow: isDark ? '0 4px 30px rgba(0, 0, 0, 0.4)' : '0 4px 24px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <motion.img
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            src="/astra-logo.png"
            alt="ASTRA"
            style={{ height: '38px', width: 'auto', display: 'block', borderRadius: '8px' }}
          />
        </Link>

        {/* Desktop Navigation */}
        {isDesktop && (
        <nav className="desktop-nav" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className="nav-link"
              style={({ isActive }) => ({
                position: 'relative',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
                backgroundColor: isActive ? 'var(--color-accent-soft)' : 'transparent',
                transition: 'color 0.2s ease, background-color 0.2s ease',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        )}

        {/* Right-side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.15rem, 1.2vw, 0.5rem)', flexShrink: 0 }}>
          <IconButton onClick={toggleTheme} label="Toggle theme">
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </IconButton>

          <Link to="/shop" aria-label="Search products">
            <IconButton label="Search"><Search size={19} /></IconButton>
          </Link>

          {/* Cart */}
          <motion.button
            onClick={openCart}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Open cart"
            className="header-icon-btn"
            style={{ position: 'relative' }}
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: 'var(--gradient-brand)', color: '#fff',
                fontSize: '0.65rem', fontWeight: 700, minWidth: '18px', height: '18px',
                borderRadius: '9px', padding: '0 4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(99,102,241,0.5)',
              }}>{cartCount}</span>
            )}
          </motion.button>

          {/* Profile / Auth — desktop only; on mobile these live in the drawer */}
          {isDesktop && (currentUser ? (
            <div ref={profileRef} className="profile-wrap" style={{ position: 'relative' }}>
              <motion.button
                onClick={() => setIsProfileOpen((v) => !v)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Account menu"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '3px 8px 3px 3px', borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-2)',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }}
                />
                <ChevronDown size={15} color="var(--color-text-muted)" className="profile-chevron" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                      width: '260px', backgroundColor: 'var(--color-elevated)',
                      borderRadius: '16px', border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-premium)', overflow: 'hidden', zIndex: 60,
                    }}
                  >
                    <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gradient-brand-soft)', borderBottom: '1px solid var(--color-border)' }}>
                      <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-background)' }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                      </div>
                    </div>
                    <div style={{ padding: '6px' }}>
                      <DropdownItem icon={<UserCircle size={18} />} label="My Profile" onClick={() => { setIsProfileOpen(false); navigate('/profile'); }} />
                      <DropdownItem icon={<Package size={18} />} label="My Orders" onClick={() => { setIsProfileOpen(false); navigate('/profile?tab=orders'); }} />
                      {isAdmin && (
                        <DropdownItem icon={<LayoutDashboard size={18} />} label="Admin Dashboard" onClick={() => { setIsProfileOpen(false); navigate('/admin/dashboard'); }} />
                      )}
                      <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '6px 4px' }} />
                      <DropdownItem icon={<LogOut size={18} />} label="Log Out" danger onClick={handleLogout} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="signin-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-brand)', color: '#fff',
              fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
              boxShadow: 'var(--shadow-glow)',
            }}>
              <User size={16} /> Sign In
            </Link>
          ))}

          {/* Hamburger — mobile only */}
          {!isDesktop && (
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-main)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
            >
              <Menu size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed', top: 0, right: 0, width: '100%', height: '100vh',
              backgroundColor: 'var(--color-background)', zIndex: 100,
              padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
              <img src="/astra-logo.png" alt="ASTRA" style={{ height: '34px', width: 'auto', display: 'block', borderRadius: '8px' }} />
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-main)' }}>
                <X size={30} />
              </button>
            </div>

            {currentUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '14px', background: 'var(--gradient-brand-soft)', marginBottom: 'var(--spacing-lg)' }}>
                <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                </div>
              </div>
            )}

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '1.2rem', fontWeight: 600 }}>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
                    textDecoration: 'none', padding: '0.7rem 1rem', borderRadius: '12px',
                    backgroundColor: isActive ? 'var(--color-accent-soft)' : 'transparent',
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentUser ? (
                <>
                  <MobileAction onClick={() => { setIsMobileMenuOpen(false); navigate('/profile'); }}>
                    <UserCircle size={20} /> My Profile
                  </MobileAction>
                  {isAdmin && (
                    <MobileAction onClick={() => { setIsMobileMenuOpen(false); navigate('/admin/dashboard'); }}>
                      <LayoutDashboard size={20} /> Admin Dashboard
                    </MobileAction>
                  )}
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '0.9rem', borderRadius: '14px', border: '1px solid var(--color-error)',
                    color: 'var(--color-error)', background: 'transparent', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                  }}>
                    <LogOut size={20} /> Log Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  padding: '0.95rem', borderRadius: '14px', background: 'var(--gradient-brand)',
                  color: '#fff', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', boxShadow: 'var(--shadow-glow)',
                }}>
                  <User size={20} /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .header-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 50%;
          background: transparent; border: none; cursor: pointer;
          color: var(--color-text-main);
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .header-icon-btn:hover { background-color: var(--color-surface-2); color: var(--color-accent); }
        .nav-link:hover { color: var(--color-accent) !important; background-color: var(--color-accent-soft) !important; }
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .signin-btn { display: inline-flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 959px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .profile-wrap { display: none !important; }
          .signin-btn { display: none !important; }
        }
        @media (max-width: 420px) {
          .header-icon-btn { width: 36px; height: 36px; }
        }
      `}</style>
    </header>
  );
};

const IconButton = ({ children, onClick, label }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.94 }}
    aria-label={label}
    className="header-icon-btn"
  >
    {children}
  </motion.button>
);

const DropdownItem = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 12px', borderRadius: '10px', border: 'none',
      background: 'transparent', cursor: 'pointer', fontSize: '0.92rem', fontWeight: 500,
      color: danger ? 'var(--color-error)' : 'var(--color-text-main)',
      transition: 'background-color 0.15s ease',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = danger ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-2)')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    {icon}
    {label}
  </button>
);

const MobileAction = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '0.9rem', borderRadius: '14px', border: '1px solid var(--color-border)',
    color: 'var(--color-text-main)', background: 'var(--color-surface-2)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
  }}>
    {children}
  </button>
);

export default Header;
