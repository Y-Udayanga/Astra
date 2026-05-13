import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
    const { isCartOpen, closeCart, cartItems, removeFromCart, cartTotal } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'black',
                            zIndex: 100
                        }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '100%',
                            maxWidth: '400px',
                            height: '100%',
                            backgroundColor: 'var(--color-surface)',
                            boxShadow: 'var(--shadow-premium)',
                            zIndex: 101,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: 'var(--spacing-lg)',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Shopping Cart</h2>
                            <button onClick={closeCart} style={{ color: 'var(--color-text-muted)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-lg)' }}>
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-3xl)' }}>
                                    <p>Your cart is empty.</p>
                                    <button
                                        onClick={closeCart}
                                        style={{
                                            marginTop: 'var(--spacing-md)',
                                            color: 'var(--color-accent)',
                                            fontWeight: 600,
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                                    {cartItems.map((item) => (
                                        <li key={item.id} style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={item.images ? item.images[0] : item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.name}</h3>
                                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Qty: {item.quantity}</p>
                                                <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>${item.price * item.quantity}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{ color: 'var(--color-error)', alignSelf: 'start' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)', fontSize: '1.2rem', fontWeight: 700 }}>
                                    <span>Subtotal</span>
                                    <span>${cartTotal}</span>
                                </div>
                                <Link to="/checkout" onClick={closeCart} style={{ width: '100%' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--spacing-md)',
                                            backgroundColor: 'var(--color-accent)',
                                            color: '#ffffff',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 'var(--spacing-sm)'
                                        }}
                                    >
                                        Checkout <ArrowRight size={18} />
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
