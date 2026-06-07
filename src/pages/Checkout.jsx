import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { createOrder, updateOrderStatus } from '../services/api';
import { preparePayHerePayment, startPayHereCheckout } from '../services/payhere';
import { handleImgError } from '../utils/imageFallback';

const PAY_CURRENCY = 'LKR';
const MIN_PAYHERE_LKR = 30;

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const { format, convert, currency } = useCurrency();
    const navigate = useNavigate();

    const payAmountLKR = Number(convert(cartTotal, 'LKR'));
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [completedOrderId, setCompletedOrderId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [configError, setConfigError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setConfigError('');

        if (paymentMethod !== 'card') {
            setConfigError('Only PayHere card payments are supported in this sandbox demo.');
            return;
        }

        if (!Number.isFinite(payAmountLKR) || payAmountLKR < MIN_PAYHERE_LKR) {
            setConfigError(`PayHere requires a minimum charge of LKR ${MIN_PAYHERE_LKR}.00. Add more items to your cart.`);
            return;
        }

        const formData = new FormData(e.target);
        const form = {
            firstName: String(formData.get('firstName') || '').trim(),
            lastName: String(formData.get('lastName') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            address: String(formData.get('address') || '').trim(),
            city: String(formData.get('city') || 'Colombo').trim(),
            phone: String(formData.get('phone') || '0771234567').trim(),
        };

        if (!form.firstName || !form.lastName || !form.email || !form.address) {
            setConfigError('Please complete all required shipping fields.');
            return;
        }

        setIsProcessing(true);

        try {
            const draftOrderId = `ORD-${Date.now()}`;

            // Create a pending order before opening PayHere so webhook/client can finalize it.
            await createOrder({
                id: draftOrderId,
                userId: currentUser?.id ?? null,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                address: form.address,
                city: form.city || 'Colombo',
                country: 'Sri Lanka',
                amount: Number(payAmountLKR.toFixed(2)),
                currency: PAY_CURRENCY,
                paymentMethod,
                status: 'pending',
            });

            const paymentPrep = await preparePayHerePayment(payAmountLKR, draftOrderId);

            const payment = {
                sandbox: paymentPrep.sandbox,
                merchant_id: paymentPrep.merchant_id,
                // PayHere JS SDK popup mode requires these to stay undefined.
                return_url: undefined,
                cancel_url: undefined,
                notify_url: paymentPrep.notify_url,
                order_id: paymentPrep.order_id,
                items: 'ASTRA Store Purchase',
                amount: paymentPrep.amount,
                currency: paymentPrep.currency,
                hash: paymentPrep.hash,
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
                phone: form.phone,
                address: form.address,
                city: form.city || 'Colombo',
                country: 'Sri Lanka',
            };

            await startPayHereCheckout(payment, {
                onCompleted: async (orderId) => {
                    const finalId = orderId || draftOrderId;
                    try {
                        await updateOrderStatus(finalId, 'completed', {
                            amount: Number(paymentPrep.amount),
                            currency: PAY_CURRENCY,
                        });
                    } catch (err) {
                        console.error('Failed to mark order completed', err);
                    }
                    setCompletedOrderId(finalId);
                    setIsSuccess(true);
                    clearCart();
                    setIsProcessing(false);
                },
                onDismissed: () => {
                    setIsProcessing(false);
                    setConfigError('Payment was cancelled. Your order remains pending — you can try again.');
                },
                onError: (error) => {
                    setConfigError(typeof error === 'string' ? error : 'Payment failed. Please verify your PayHere sandbox domain and try again.');
                    setIsProcessing(false);
                },
            });
        } catch (err) {
            console.error('Checkout payment error', err);
            setConfigError(err.message || 'Unable to start PayHere payment.');
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 11 }}>
                    <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--gradient-brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        <CheckCircle size={56} color="var(--color-success)" />
                    </div>
                </motion.div>
                <h2 style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)', fontSize: '2rem' }}>Payment Successful!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', maxWidth: '420px' }}>
                    Thank you for your purchase. Your order{completedOrderId ? ` (${completedOrderId})` : ''} has been recorded.
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
                            <Input name="phone" placeholder="Phone (07XXXXXXXX)" type="tel" defaultValue="0771234567" />
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
                                    <Lock size={14} /> Secured by PayHere sandbox — payment hash is generated server-side.
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-subtle)', lineHeight: 1.5 }}>
                                    Sandbox test card: 4916 0000 0000 0000 · Exp 01/28 · CVV 100 · Name: S. Perera
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>

                <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', height: 'fit-content', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>
                    <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--color-surface-2)' }}>
                                    <img src={item.images ? item.images[0] : item.image} alt={item.name} onError={handleImgError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Qty {item.quantity}</div>
                                </div>
                                <span style={{ fontWeight: 600 }}>{format(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '6px' }}>
                        <span>Shipping</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Free</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                        <span>Total</span><span>{format(cartTotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        <span>Charged in LKR</span>
                        <span>Rs {payAmountLKR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <button type="submit" form="checkout-form" disabled={isProcessing || payAmountLKR < MIN_PAYHERE_LKR} style={{
                        width: '100%', marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)',
                        background: 'var(--gradient-brand)', color: '#fff', fontSize: '1rem', fontWeight: 700,
                        borderRadius: 'var(--radius-full)', opacity: isProcessing || payAmountLKR < MIN_PAYHERE_LKR ? 0.7 : 1,
                        cursor: isProcessing || payAmountLKR < MIN_PAYHERE_LKR ? 'not-allowed' : 'pointer', border: 'none', boxShadow: 'var(--shadow-glow)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        {isProcessing ? 'Opening PayHere...' : <><Lock size={17} /> Pay {format(cartTotal)}</>}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: 'var(--spacing-md)', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        <ShieldCheck size={15} /> Hash generated server-side · PayHere sandbox
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
