import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import CryptoJS from 'crypto-js';

const Checkout = () => {
    const { cartItems, cartTotal } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const location = useLocation();

    // Check if coming back from a successful PayHere payment via redirect
    React.useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('status') === 'success') {
            setIsSuccess(true);
        }
    }, [location]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (paymentMethod !== 'card') {
            alert('Currently only PayHere Card payment is supported in this demo.');
            return;
        }

        setIsProcessing(true);

        const merchantId = import.meta.env.VITE_PAYHERE_MERCHANT_ID;
        const merchantSecret = import.meta.env.VITE_PAYHERE_MERCHANT_SECRET;

        if (!merchantId || !merchantSecret) {
            alert('PayHere Merchant ID or Secret is not configured in .env file!');
            setIsProcessing(false);
            return;
        }

        const orderId = `ORD-${Date.now()}`;
        const amount = parseFloat(cartTotal).toFixed(2);
        const currency = 'LKR';

        // Hash = md5(merchant_id + order_id + amount + currency + md5(merchant_secret).toUpperCase()).toUpperCase()
        const hashedSecret = CryptoJS.MD5(merchantSecret).toString().toUpperCase();
        const hash = CryptoJS.MD5(merchantId + orderId + amount + currency + hashedSecret).toString().toUpperCase();

        const formData = new FormData(e.target);

        const payment = {
            sandbox: true,
            merchant_id: merchantId,
            return_url: 'https://astra-web-app.vercel.app/checkout?status=success',
            cancel_url: 'https://astra-web-app.vercel.app/checkout?status=cancel',
            notify_url: 'https://sandbox.payhere.lk/notify', // Mock notify URL
            order_id: orderId,
            items: 'Astra Store Purchase',
            amount: amount,
            currency: currency,
            hash: hash,
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            email: formData.get('email'),
            phone: '0771234567', // Hardcoded for demo
            address: formData.get('address'),
            city: 'Colombo',
            country: 'Sri Lanka',
        };

        // Event handlers for PayHere popup
        window.payhere.onCompleted = function onCompleted(orderId) {
            console.log("Payment completed. OrderID:" + orderId);
            setIsProcessing(false);
            setIsSuccess(true);
        };

        window.payhere.onDismissed = function onDismissed() {
            console.log("Payment dismissed");
            setIsProcessing(false);
        };

        window.payhere.onError = function onError(error) {
            console.log("Error:" + error);
            alert("Payment Error: " + error);
            setIsProcessing(false);
        };

        window.payhere.startPayment(payment);
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--spacing-2xl)' }}>
                {/* Form */}
                <div>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Shipping Information</h3>
                    <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <Input name="firstName" placeholder="First Name" required />
                            <Input name="lastName" placeholder="Last Name" required />
                        </div>
                        <Input name="email" placeholder="Email Address" type="email" required />
                        <Input name="address" placeholder="Street Address" required />

                        <h3 style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>Payment Method</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px', marginBottom: 'var(--spacing-md)' }}>
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
                            backgroundColor: 'var(--color-accent)',
                            color: '#ffffff',
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
