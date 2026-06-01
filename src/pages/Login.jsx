import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001 6.19 5.238 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch {
      setError('Failed to sign in. Please check your credentials.');
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
      setError('Google sign-in is unavailable. Enable the Google provider in Supabase Auth.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* Showcase panel */}
      <ShowcasePanel
        eyebrow="Welcome back"
        title="Step back into your style universe."
        subtitle="Sign in to track orders, save favourites, and unlock members-only drops."
        image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200"
      />

      {/* Form panel */}
      <div className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="auth-card"
        >
          <Link to="/" className="auth-back">
            <ArrowLeft size={16} /> Back to store
          </Link>

          <div className="auth-logo">
            <span className="auth-logo-badge">A</span>
            <span className="auth-logo-text">ASTRA</span>
          </div>

          <h1 className="auth-title">Sign in</h1>
          <p className="auth-sub">Welcome back — please enter your details.</p>

          {error && <div className="auth-error">{error}</div>}

          <button type="button" onClick={handleGoogle} disabled={googleLoading} className="google-btn">
            {googleLoading ? <Loader2 size={20} className="animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="auth-divider"><span>or sign in with email</span></div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <Mail size={19} className="auth-field-icon" />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <Lock size={19} className="auth-field-icon" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="auth-eye" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="auth-row">
              <label className="auth-check">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="auth-link">Forgot password?</a>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isSubmitting} className="auth-submit">
              {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </motion.button>
          </form>

          <p className="auth-foot">
            Don't have an account? <Link to="/register" className="auth-link strong">Create account</Link>
          </p>
        </motion.div>
      </div>

      <AuthStyles />
    </div>
  );
};

/* ---------- Shared showcase panel ---------- */
export const ShowcasePanel = ({ eyebrow, title, subtitle, image }) => (
  <div className="auth-showcase">
    <img src={image} alt="" className="auth-showcase-img" />
    <div className="auth-showcase-overlay" />
    <div className="auth-showcase-blob auth-blob-1" />
    <div className="auth-showcase-blob auth-blob-2" />

    <div className="auth-showcase-content">
      <Link to="/" className="auth-showcase-logo">
        <span className="auth-logo-badge light">A</span> ASTRA
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="auth-showcase-text"
      >
        <span className="auth-eyebrow"><Sparkles size={14} /> {eyebrow}</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </motion.div>

      <div className="auth-showcase-cards">
        <motion.div className="glass-card" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <ShieldCheck size={20} />
          <div><strong>Secure & Private</strong><span>Your data is encrypted end-to-end</span></div>
        </motion.div>
        <motion.div className="glass-card" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}>
          <Truck size={20} />
          <div><strong>Free Worldwide Shipping</strong><span>On every members order</span></div>
        </motion.div>
      </div>
    </div>
  </div>
);

/* ---------- Shared styles for both auth pages ---------- */
export const AuthStyles = () => (
  <style>{`
    .auth-wrap {
      min-height: 100vh; display: grid; grid-template-columns: 1fr;
      background-color: var(--color-background);
    }
    .auth-showcase { display: none; position: relative; overflow: hidden; }
    .auth-form-panel {
      display: flex; align-items: center; justify-content: center;
      padding: clamp(20px, 5vw, 48px); position: relative; overflow: hidden;
    }
    .auth-card {
      width: 100%; max-width: 440px; position: relative; z-index: 2;
    }
    .auth-back {
      display: inline-flex; align-items: center; gap: 7px; color: var(--color-text-muted);
      font-size: 0.88rem; font-weight: 500; margin-bottom: 28px; text-decoration: none; transition: color .2s;
    }
    .auth-back:hover { color: var(--color-accent); }
    .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 26px; }
    .auth-logo-badge {
      width: 34px; height: 34px; border-radius: 10px; background: var(--gradient-brand);
      display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800;
      font-family: var(--font-family-display); box-shadow: var(--shadow-glow);
    }
    .auth-logo-badge.light { width: 30px; height: 30px; border-radius: 9px; font-size: 0.9rem; }
    .auth-logo-text { font-family: var(--font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; color: var(--color-text-main); }
    .auth-title { font-family: var(--font-family-display); font-size: clamp(1.8rem, 4vw, 2.3rem); margin-bottom: 6px; color: var(--color-text-main); }
    .auth-sub { color: var(--color-text-muted); margin-bottom: 26px; }
    .auth-error {
      background: rgba(239,68,68,0.1); color: var(--color-error); padding: 12px 14px; border-radius: 10px;
      margin-bottom: 18px; font-size: 0.88rem; border: 1px solid rgba(239,68,68,0.2);
    }
    .google-btn {
      width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
      padding: 13px; border-radius: 12px; border: 1px solid var(--color-border-strong);
      background: var(--color-surface); color: var(--color-text-main); font-weight: 600; font-size: 0.98rem;
      cursor: pointer; transition: all .2s;
    }
    .google-btn:hover { background: var(--color-surface-2); border-color: var(--color-accent); box-shadow: var(--shadow-sm); }
    .google-btn:disabled { opacity: .7; cursor: not-allowed; }
    .auth-divider { display: flex; align-items: center; text-align: center; margin: 22px 0; color: var(--color-text-subtle); font-size: 0.82rem; }
    .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
    .auth-divider span { padding: 0 14px; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .auth-field { position: relative; display: flex; align-items: center; }
    .auth-field-icon { position: absolute; left: 15px; color: var(--color-text-muted); pointer-events: none; }
    .auth-field input {
      width: 100%; padding: 14px 14px 14px 46px; border-radius: 12px; border: 1px solid var(--color-border);
      background: var(--color-background); color: var(--color-text-main); outline: none; font-family: inherit; font-size: 1rem; transition: all .2s;
    }
    .auth-eye { position: absolute; right: 12px; background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 6px; display: flex; }
    .auth-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; }
    .auth-check { display: flex; align-items: center; gap: 8px; color: var(--color-text-muted); cursor: pointer; }
    .auth-check input { accent-color: var(--color-accent); width: 16px; height: 16px; }
    .auth-link { color: var(--color-accent); text-decoration: none; font-weight: 500; }
    .auth-link:hover { text-decoration: underline; }
    .auth-link.strong { font-weight: 700; }
    .auth-submit {
      width: 100%; padding: 14px; border: none; border-radius: 12px; background: var(--gradient-brand);
      color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 4px;
      display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: var(--shadow-glow);
    }
    .auth-submit:disabled { opacity: .75; cursor: not-allowed; }
    .auth-foot { text-align: center; margin-top: 28px; color: var(--color-text-muted); }

    /* Showcase */
    .auth-showcase-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .auth-showcase-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(79,70,229,0.82) 0%, rgba(236,72,153,0.72) 100%); mix-blend-mode: multiply; }
    .auth-showcase-blob { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.5; }
    .auth-blob-1 { width: 340px; height: 340px; background: #818cf8; top: -80px; right: -60px; }
    .auth-blob-2 { width: 300px; height: 300px; background: #f472b6; bottom: -60px; left: -40px; }
    .auth-showcase-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(32px, 4vw, 56px); color: #fff; }
    .auth-showcase-logo { display: inline-flex; align-items: center; gap: 10px; color: #fff; font-family: var(--font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; text-decoration: none; }
    .auth-eyebrow { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 999px; background: rgba(255,255,255,0.18); backdrop-filter: blur(8px); font-size: 0.8rem; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
    .auth-showcase-text h2 { font-family: var(--font-family-display); font-size: clamp(2rem, 3vw, 3rem); line-height: 1.1; margin: 18px 0 14px; letter-spacing: -1px; }
    .auth-showcase-text p { font-size: 1.05rem; opacity: 0.92; max-width: 420px; line-height: 1.6; }
    .auth-showcase-cards { display: flex; flex-direction: column; gap: 14px; }
    .glass-card { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 16px; background: rgba(255,255,255,0.14); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.22); }
    .glass-card svg { flex-shrink: 0; }
    .glass-card strong { display: block; font-size: 0.95rem; }
    .glass-card span { font-size: 0.82rem; opacity: 0.85; }

    @media (min-width: 940px) {
      .auth-wrap { grid-template-columns: 1.05fr 1fr; }
      .auth-showcase { display: block; }
    }
  `}</style>
);

export default Login;
