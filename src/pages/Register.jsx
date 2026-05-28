
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (error) {
            console.error("Registration failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-xl)',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'var(--color-background)'
            }}
        >
            {/* Background blobs */}
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '25%',
                width: '300px',
                height: '300px',
                backgroundColor: 'var(--color-accent)',
                filter: 'blur(100px)',
                opacity: 0.1,
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                left: '20%',
                width: '250px',
                height: '250px',
                backgroundColor: 'var(--color-primary)',
                filter: 'blur(100px)',
                opacity: 0.1,
                borderRadius: '50%'
            }} />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    backgroundColor: 'var(--color-surface)',
                    padding: 'clamp(24px, 5vw, 40px)',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-premium)',
                    position: 'relative',
                    border: '1px solid var(--color-border)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div style={{ marginBottom: '32px' }}>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--color-text-muted)',
                        marginBottom: '24px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'color 0.2s',
                        fontWeight: 500
                    }}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <h1 style={{
                        fontFamily: 'var(--font-family-display)',
                        fontSize: '2rem',
                        marginBottom: '8px',
                        background: 'linear-gradient(135deg, var(--color-text-main) 0%, var(--color-text-muted) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Create Account</h1>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>Join ASTRA for exclusive access</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 14px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text-main)',
                                outline: 'none',
                                fontFamily: 'inherit',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 14px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text-main)',
                                outline: 'none',
                                fontFamily: 'inherit',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 14px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text-main)',
                                outline: 'none',
                                fontFamily: 'inherit',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>

                    <button
                        disabled={isSubmitting}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: 'var(--color-accent)',
                            color: '#ffffff',
                            borderRadius: '12px',
                            fontWeight: 600,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            border: 'none',
                            fontSize: '1rem',
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: isSubmitting ? 0.7 : 1,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--color-text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;
