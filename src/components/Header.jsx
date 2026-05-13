import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Sun, Moon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartCount, openCart } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: isDark ? 'rgba(9, 9, 11, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      padding: 'var(--spacing-md) var(--spacing-xl)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isDark ? '0 4px 30px rgba(0, 0, 0, 0.4)' : '0 4px 30px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-family-display, "Outfit", sans-serif)',
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--color-text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          letterSpacing: '-1.5px',
          textDecoration: 'none',
          background: 'linear-gradient(135deg, var(--color-text-main) 0%, var(--color-text-muted) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative'
        }}>
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, var(--color-primary, #6366f1) 0%, var(--color-accent, #ec4899) 100%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              marginRight: '6px'
            }}
          />
          ASTRA
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ display: 'none', gap: '2rem', alignItems: 'center' }}>
          {['Home', 'Shop', 'Categories', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="nav-link"
              style={{
                position: 'relative',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            style={{ color: 'var(--color-text-main)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <Link to="/shop">
            <motion.button whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Search size={18} color="var(--color-text-main)" />
            </motion.button>
          </Link>

          <Link to={currentUser ? (currentUser.role === 'admin' ? '/admin/dashboard' : '/shop') : '/login'}>
            <motion.button whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <User size={18} color="var(--color-text-main)" />
            </motion.button>
          </Link>

          <motion.div
            onClick={openCart}
            style={{ position: 'relative', cursor: 'pointer' }}
            whileHover={{ scale: 1.1 }}
          >
            <ShoppingCart size={18} color="var(--color-text-main)" />
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              height: '18px',
              width: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>{cartCount}</span>
          </motion.div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ display: 'none', color: 'var(--color-text-main)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: 'var(--color-background)',
              zIndex: 100,
              padding: 'var(--spacing-xl)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-2xl)' }}>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-main)' }}>
                <X size={32} />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', fontSize: '1.5rem', fontWeight: 600 }}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Shop</Link>
              <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Categories</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Contact</Link>
              <Link to={currentUser ? (currentUser.role === 'admin' ? '/admin/dashboard' : '/shop') : '/login'} onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>{currentUser ? 'Dashboard' : 'Login'}</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-link {
          color: var(--color-text-muted);
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: var(--color-text-main);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: var(--color-primary, #6366f1);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        @media (min-width: 769px) {
            .desktop-nav { display: flex !important; margin: 0 auto; }
            .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
