import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { createOrder } from '../services/api';

// PayHere sandbox processes payments in LKR.
const PAY_CURRENCY = 'LKR';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [configError, setConfigError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    // Handle PayHere redirect-based return (?status=success / ?status=cancel)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('status') === 'success') {
            setIsSuccess(true);
            clearCart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const persistOrder = async (orderId, form) => {
        try {
            await createOrder({
                id: orderId,
                userId: currentUser?.id ?? null,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                address: form.address,
                city: form.city || 'Colombo',
                country: 'Sri Lanka',
                amount: Number(cartTotal),
                currency: PAY_CURRENCY,
                paymentMethod,
                status: 'completed',
            });
        } catch (err) {
            // Don't block the success UI on a persistence failure, but log it.
            console.error('Failed to save order to Supabase', err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfigError('');

        if (paymentMethod !== 'card') {
            setConfigError('Only PayHere card payments are supported in this sandbox demo.');
            return;
        }

        const merchantId = import.meta.env.VITE_PAYHERE_MERCHANT_ID?.trim();
        const merchantSecret = import.meta.env.VITE_PAYHERE_MERCHANT_SECRET?.trim();

        if (!merchantId || !merchantSecret) {
            setConfigError('PayHere is not fully configured. Add VITE_PAYHERE_MERCHANT_ID and VITE_PAYHERE_MERCHANT_SECRET (from your PayHere sandbox dashboard) to your .env file and restart the dev server.');
            return;
        }

        if (!window.payhere) {
            setConfigError('PayHere SDK failed to load. Check your internet connection and try again.');
            return;
        }

        const formData = new FormData(e.target);
        const form = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            phone: formData.get('phone') || '0771234567',
        };

        const orderId = `ORD-${Date.now()}`;
        const amount = Number(cartTotal).toFixed(2);

        // hash = md5(merchant_id + order_id + amount + currency + md5(merchant_secret).toUpperCase()).toUpperCase()
        const hashedSecret = CryptoJS.MD5(merchantSecret).toString().toUpperCase();
        const hash = CryptoJS.MD5(merchantId + orderId + amount + PAY_CURRENCY + hashedSecret).toString().toUpperCase();

        const origin = window.location.origin;
        const payment = {
            sandbox: true,
            merchant_id: merchantId,
            return_url: `${origin}/checkout?status=success`,
            cancel_url: `${origin}/checkout?status=cancel`,
            notify_url: `${origin}/checkout`, // No server in this SPA; client callbacks handle status.
            order_id: orderId,
            items: 'ASTRA Store Purchase',
            amount,
            currency: PAY_CURRENCY,
            hash,
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city || 'Colombo',
            country: 'Sri Lanka',
        };

        setIsProcessing(true);

        window.payhere.onCompleted = async function onCompleted(completedOrderId) {
            await persistOrder(completedOrderId || orderId, form);
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        };
        window.payhere.onDismissed = function onDismissed() {
            setIsProcessing(false);
        };
        window.payhere.onError = function onError(error) {
            setConfigError(`Payment error: ${error}`);
            setIsProcessing(false);
        };

        window.payhere.startPayment(payment);
    };

    if (isSuccess) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 11 }}>
                    <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--gradient-brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        <CheckCircle size={56} color="var(--color-success)" />
                    </div>
                </motion.div>
                <h2 style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)', fontSize: '2rem' }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)', maxWidth: '420px' }}>
                    Thank you for your purchase. A confirmation has been sent to your email and your order is now visible in your profile.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/profile?tab=orders')} style={{ padding: '12px 26px', borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-glow)' }}>View My Orders</button>
                    <Link to="/shop" style={{ padding: '12px 26px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', fontWeight: 600, textDecoration: 'none' }}>Continue Shopping</Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)' }}>Add some products before heading to checkout.</p>
                <Link to="/shop" style={{ padding: '12px 26px', borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', color: '#fff', fontWeight: 600, textDecoration: 'none', boxShadow: 'var(--shadow-glow)' }}>Browse the Shop</Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: 'var(--spacing-2xl) var(--spacing-xl) var(--spacing-3xl)', maxWidth: '1040px', margin: '0 auto' }}
        >
            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                <ArrowLeft size={18} /> Back to Shop
            </Link>

            <h1 style={{ marginBottom: 'var(--spacing-xl)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>Checkout</h1>

            {configError && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '14px 18px', borderRadius: '12px', backgroundColor: 'rgba(245,158,11,0.12)', color: 'var(--color-warning)', marginBottom: 'var(--spacing-lg)', fontSize: '0.9rem' }}>
                    <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} /> <span>{configError}</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--spacing-2xl)' }}>
                {/* Form */}
                <div>
                    <SectionTitle>Shipping Information</SectionTitle>
                    <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <Input name="firstName" placeholder="First Name" required defaultValue={currentUser?.name?.split(' ')[0] || ''} />
                            <Input name="lastName" placeholder="Last Name" required defaultValue={currentUser?.name?.split(' ').slice(1).join(' ') || ''} />
                        </div>
                        <Input name="email" placeholder="Email Address" type="email" required defaultValue={currentUser?.email || ''} />
                        <Input name="address" placeholder="Street Address" required />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <Input name="city" placeholder="City" defaultValue="Colombo" />
                            <Input name="phone" placeholder="Phone" type="tel" />
                        </div>

                        <SectionTitle style={{ marginTop: 'var(--spacing-md)' }}>Payment Method</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '10px', marginBottom: 'var(--spacing-sm)' }}>
                            <PaymentOption id="card" selected={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} icon={<CreditCard size={22} />} label="Card" />
                            <PaymentOption id="paypal" selected={paymentMethod === 'paypal'} onClick={() => setPaymentMethod('paypal')} icon={<span style={{ fontWeight: 800, color: '#003087', fontStyle: 'italic' }}>Pay<span style={{ color: '#009cde' }}>Pal</span></span>} label="" />
                            <PaymentOption id="google" selected={paymentMethod === 'google'} onClick={() => setPaymentMethod('google')} icon={<span style={{ fontWeight: 800, color: 'var(--color-text-main)' }}>G<span style={{ color: 'var(--color-text-muted)' }}>Pay</span></span>} label="" />
                        </div>

                        {paymentMethod === 'card' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    <Lock size={14} /> Secured by PayHere — you'll complete payment in a secure popup.
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>

                {/* Order Summary */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', height: 'fit-content', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>
                    <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--color-surface-2)' }}>
                                    <img src={item.images ? item.images[0] : item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Qty {item.quantity}</div>
                                </div>
                                <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '6px' }}>
                        <span>Shipping</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Free</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                        <span>Total</span><span>${Number(cartTotal).toFixed(2)}</span>
                    </div>

                    <button type="submit" form="checkout-form" disabled={isProcessing} style={{
                        width: '100%', marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)',
                        background: 'var(--gradient-brand)', color: '#fff', fontSize: '1rem', fontWeight: 700,
                        borderRadius: 'var(--radius-full)', opacity: isProcessing ? 0.7 : 1,
                        cursor: isProcessing ? 'not-allowed' : 'pointer', border: 'none', boxShadow: 'var(--shadow-glow)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        {isProcessing ? 'Processing Payment...' : <><Lock size={17} /> Pay ${Number(cartTotal).toFixed(2)}</>}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: 'var(--spacing-md)', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        <ShieldCheck size={15} /> 256-bit SSL secured checkout
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SectionTitle = ({ children, style }) => (
    <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.15rem', ...style }}>{children}</h3>
);

const Input = ({ style, ...props }) => (
    <input
        {...props}
        style={{
            width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)', outline: 'none',
            backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', fontFamily: 'inherit', ...style,
        }}
    />
);

const PaymentOption = ({ selected, onClick, icon, label }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            border: selected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)', padding: '10px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer',
            backgroundColor: selected ? 'var(--color-accent-soft)' : 'var(--color-background)',
            color: 'var(--color-text-main)', height: '72px', transition: 'all 0.2s',
        }}
    >
        {icon}
        {label && <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{label}</span>}
    </button>
);

export default Checkout;
