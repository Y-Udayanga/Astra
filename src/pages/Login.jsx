import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const user = await login(email, password);
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
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
                left: '20%',
                width: '300px',
                height: '300px',
                backgroundColor: 'var(--color-accent)',
                filter: 'blur(100px)',
                opacity: 0.1,
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '20%',
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
                        <ArrowLeft size={16} /> Back to Store
                    </Link>
                    <h1 style={{
                        fontFamily: 'var(--font-family-display)',
                        fontSize: '2rem',
                        marginBottom: '8px',
                        background: 'linear-gradient(135deg, var(--color-text-main) 0%, var(--color-text-muted) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Welcome Back</h1>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                        Sign in to access your account dashboard
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#EF4444',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                                transition: 'all 0.2s',
                                fontFamily: 'inherit',
                                fontSize: '1rem'
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
                                transition: 'all 0.2s',
                                fontFamily: 'inherit',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                            <input type="checkbox" style={{ accentColor: 'var(--color-accent)' }} />
                            Remember me
                        </label>
                        <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</a>
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
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div style={{ margin: '32px 0', textAlign: 'center', position: 'relative' }}>
                    <div style={{ borderTop: '1px solid var(--color-border)', position: 'absolute', top: '50%', width: '100%', zIndex: 0 }} />
                    <span style={{ backgroundColor: 'var(--color-surface)', padding: '0 16px', color: 'var(--color-text-muted)', position: 'relative', zIndex: 1, fontSize: '0.9rem' }}>Or continue with</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button style={{
                        padding: '12px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'background-color 0.2s'
                    }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#DB4437', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>G</div>
                        Google
                    </button>
                    <button style={{
                        padding: '12px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'background-color 0.2s'
                    }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#0077B5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>in</div>
                        LinkedIn
                    </button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--color-text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
                </p>

            </motion.div>
        </motion.div>
    );
};

export default Login;

