import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ShowcasePanel, AuthStyles, GoogleIcon } from './Login';

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
};
const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['#ef4444', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const strength = useMemo(() => getStrength(password), [password]);
  const passwordsMatch = confirm.length > 0 && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!agree) { setError('Please accept the Terms & Privacy Policy to continue.'); return; }

    setIsSubmitting(true);
    try {
      const result = await register(name, email, password);
      if (result?.needsConfirmation) {
        setInfo('Account created! Please check your email to confirm your account, then sign in.');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError('Google sign-up is unavailable. Enable the Google provider in Supabase Auth.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <ShowcasePanel
        eyebrow="Join ASTRA"
        title="Create your account. Elevate your wardrobe."
        subtitle="Become a member for early access to drops, exclusive pricing, and a faster checkout."
        image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200"
      />

      <div className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="auth-card"
        >
          <Link to="/" className="auth-back"><ArrowLeft size={16} /> Back to store</Link>

          <div className="auth-logo">
            <span className="auth-logo-badge">A</span>
            <span className="auth-logo-text">ASTRA</span>
          </div>

          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join thousands of members shopping with ASTRA.</p>

          {error && <div className="auth-error">{error}</div>}
          {info && (
            <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', padding: '12px 14px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.88rem', border: '1px solid rgba(16,185,129,0.25)' }}>
              {info} <Link to="/login" className="auth-link strong">Go to sign in</Link>
            </div>
          )}

          <button type="button" onClick={handleGoogle} disabled={googleLoading} className="google-btn">
            {googleLoading ? <Loader2 size={20} className="animate-spin" /> : <GoogleIcon />}
            Sign up with Google
          </button>

          <div className="auth-divider"><span>or register with email</span></div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <User size={19} className="auth-field-icon" />
              <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="auth-field">
              <Mail size={19} className="auth-field-icon" />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <Lock size={19} className="auth-field-icon" />
              <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="auth-eye" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password.length > 0 && (
              <div style={{ marginTop: '-4px' }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i < strength ? strengthColors[strength] : 'var(--color-border)', transition: 'background-color .3s' }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', color: strengthColors[strength], fontWeight: 600 }}>{strengthLabels[strength]}</span>
              </div>
            )}

            <div className="auth-field">
              <Lock size={19} className="auth-field-icon" />
              <input type={showPw ? 'text' : 'password'} placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              {confirm.length > 0 && (
                <span className="auth-eye" style={{ color: passwordsMatch ? 'var(--color-success)' : 'var(--color-error)', pointerEvents: 'none' }}>
                  {passwordsMatch ? <Check size={18} /> : <X size={18} />}
                </span>
              )}
            </div>

            <label className="auth-check" style={{ alignItems: 'flex-start', lineHeight: 1.5 }}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: '2px' }} />
              <span>I agree to ASTRA's <a href="#" className="auth-link">Terms of Service</a> and <a href="#" className="auth-link">Privacy Policy</a>.</span>
            </label>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isSubmitting} className="auth-submit">
              {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </motion.button>
          </form>

          <p className="auth-foot">
            Already have an account? <Link to="/login" className="auth-link strong">Sign in</Link>
          </p>
        </motion.div>
      </div>

      <AuthStyles />
    </div>
  );
};

export default Register;
