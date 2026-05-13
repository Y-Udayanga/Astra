import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartTotal } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            // In a real app, clear cart here
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                >
                    <CheckCircle size={80} color="var(--color-success)" />
                </motion.div>
                <h2 style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)' }}>Thank you for your purchase.</p>
                <Link to="/" style={{ textDecoration: 'underline', color: 'var(--color-accent)' }}>Return Home</Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: 'var(--spacing-3xl) var(--spacing-xl)', maxWidth: '1000px', margin: '0 auto' }}
        >
            <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                <ArrowLeft size={18} /> Back to Shop
            </Link>

            <h1 style={{ marginBottom: 'var(--spacing-2xl)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-md)' }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-3xl)' }}>
                {/* Form */}
                <div>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Shipping Information</h3>
                    <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <Input placeholder="First Name" required />
                            <Input placeholder="Last Name" required />
                        </div>
                        <Input placeholder="Email Address" type="email" required />
                        <Input placeholder="Street Address" required />

                        <h3 style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>Payment Method</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: 'var(--spacing-md)' }}>
                            <PaymentOption
                                id="card"
                                selected={paymentMethod === 'card'}
                                onClick={() => setPaymentMethod('card')}
                                icon={<CreditCard size={24} />}
                                label="Card"
                            />
                            <PaymentOption
                                id="paypal"
                                selected={paymentMethod === 'paypal'}
                                onClick={() => setPaymentMethod('paypal')}
                                icon={<div style={{ fontWeight: 800, color: '#003087', fontStyle: 'italic' }}>Pay<span style={{ color: '#009cde' }}>Pal</span></div>}
                                label=""
                            />
                            <PaymentOption
                                id="google"
                                selected={paymentMethod === 'google'}
                                onClick={() => setPaymentMethod('google')}
                                icon={<div style={{ fontWeight: 800, color: '#5f6368' }}>G<span style={{ color: '#aaa' }}>Pay</span></div>}
                                label=""
                            />
                        </div>

                        {paymentMethod === 'card' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <Input placeholder="Card Number" required style={{ marginBottom: 'var(--spacing-md)' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                    <Input placeholder="MM/YY" required />
                                    <Input placeholder="CVC" required />
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>

                {/* Order Summary */}
                <div style={{
                    backgroundColor: 'var(--color-surface)',
                    padding: 'var(--spacing-xl)',
                    borderRadius: 'var(--radius-lg)',
                    height: 'fit-content',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 'var(--spacing-lg)' }}>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                                <span>{item.name} x {item.quantity}</span>
                                <span style={{ fontWeight: 600 }}>${item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                        <span>Total</span>
                        <span>${cartTotal}</span>
                    </div>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={isProcessing}
                        style={{
                            width: '100%',
                            marginTop: 'var(--spacing-xl)',
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'var(--color-text-main)',
                            color: 'var(--color-background)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-md)',
                            opacity: isProcessing ? 0.7 : 1,
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            border: 'none'
                        }}
                    >
                        {isProcessing ? 'Processing Payment...' : `Pay $${cartTotal}`}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Input = ({ style, ...props }) => (
    <input
        {...props}
        style={{
            width: '100%',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            outline: 'none',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-main)',
            fontFamily: 'inherit',
            ...style
        }}
    />
);

const PaymentOption = ({ selected, onClick, icon, label }) => (
    <div
        onClick={onClick}
        style={{
            border: selected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: selected ? 'var(--color-surface)' : 'transparent',
            height: '80px',
            transition: 'all 0.2s'
        }}
    >
        {icon}
        {label && <span style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{label}</span>}
    </div>
);

export default Checkout;
