import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserCircle, Package, LogOut, Save, Check, Loader2,
  Mail, Shield, Calendar, ShoppingBag, ImagePlus, Upload, MapPin, Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { getMyOrders } from '../services/api';

const statusStyles = {
  completed: { bg: 'rgba(16,185,129,0.12)', fg: 'var(--color-success)' },
  processing: { bg: 'rgba(59,130,246,0.12)', fg: 'var(--color-info)' },
  pending: { bg: 'rgba(245,158,11,0.12)', fg: 'var(--color-warning)' },
  failed: { bg: 'rgba(239,68,68,0.12)', fg: 'var(--color-error)' },
  cancelled: { bg: 'rgba(239,68,68,0.12)', fg: 'var(--color-error)' },
};

const Profile = () => {
  const { currentUser, updateProfile, uploadAvatar, logout } = useAuth();
  const toast = useToast();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'orders' ? 'orders' : 'profile';
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: '', avatar: '', phone: '', address: '', city: '', country: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  const seed = (currentUser?.name || 'Astra').replaceAll(' ', '+');
  const initial = useMemo(() => ({
    name: currentUser?.name || '',
    avatar: currentUser?.avatar || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    country: currentUser?.country || '',
    bio: currentUser?.bio || '',
  }), [currentUser]);

  useEffect(() => { setForm(initial); }, [initial]);

  useEffect(() => {
    let active = true;
    setOrdersLoading(true);
    getMyOrders()
      .then((rows) => { if (active) { setOrders(rows); setOrdersLoading(false); } })
      .catch((err) => { if (active) { setOrdersError(err.message); setOrdersLoading(false); } });
    return () => { active = false; };
  }, []);

  const presetAvatars = useMemo(() => ([
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
    `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`,
    `https://ui-avatars.com/api/?name=${seed}&background=6366f1&color=fff&bold=true`,
  ]), [seed]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const dirty = useMemo(() => Object.keys(initial).some((k) => form[k] !== initial[k]), [form, initial]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error('Image must be under 3MB.'); return; }
    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      setForm((f) => ({ ...f, avatar: url }));
      toast.success('Photo uploaded. Click Save to apply.');
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim() || currentUser.name,
        avatar: form.avatar,
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        bio: form.bio.trim(),
      });
      setSaved(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };
  const setTab = (tab) => setSearchParams(tab === 'orders' ? { tab: 'orders' } : {});

  if (!currentUser) return null;

  const memberSince = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--spacing-2xl) var(--spacing-xl) var(--spacing-3xl)' }}>
      {/* Hero */}
      <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: 'var(--spacing-xl)', background: 'var(--gradient-brand-soft)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% -20%, var(--color-accent-soft), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', padding: 'clamp(20px, 4vw, 36px)', display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 28px)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <motion.img key={form.avatar} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={form.avatar} alt={currentUser.name}
              style={{ width: 'clamp(72px, 14vw, 104px)', height: 'clamp(72px, 14vw, 104px)', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--color-background)', boxShadow: 'var(--shadow-lg)' }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="Upload photo"
              style={{ position: 'absolute', bottom: 0, right: 0, width: '34px', height: '34px', borderRadius: '50%', background: 'var(--gradient-brand)', border: '3px solid var(--color-background)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-glow)' }}>
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', margin: 0, fontFamily: 'var(--font-family-display)', color: 'var(--color-text-main)' }}>{currentUser.name}</h1>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: currentUser.role === 'admin' ? 'var(--color-accent)' : 'var(--color-surface-2)', color: currentUser.role === 'admin' ? '#fff' : 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', border: currentUser.role === 'admin' ? 'none' : '1px solid var(--color-border)' }}>
                <Shield size={13} /> {currentUser.role}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '10px', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={15} /> {currentUser.email}</span>
              {memberSince && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={15} /> Member since {memberSince}</span>}
            </div>
          </div>
          <button onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-error)', fontWeight: 600, cursor: 'pointer' }}>
            <LogOut size={17} /> Log Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--spacing-xl)', borderBottom: '1px solid var(--color-border)' }}>
        <TabButton active={activeTab === 'profile'} onClick={() => setTab('profile')} icon={<UserCircle size={18} />}>Profile</TabButton>
        <TabButton active={activeTab === 'orders'} onClick={() => setTab('orders')} icon={<Package size={18} />}>My Orders {orders.length > 0 && `(${orders.length})`}</TabButton>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <form onSubmit={handleSave} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: 'clamp(20px, 3vw, 32px)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '4px', fontSize: '1.25rem' }}>Edit Profile</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)', fontSize: '0.92rem' }}>Update your personal information, photo and address. All location fields are optional.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--spacing-xl)' }}>
                <div>
                  <Field label="Display Name">
                    <input type="text" value={form.name} onChange={set('name')} required maxLength={60} style={inputStyle} />
                  </Field>
                  <Field label="Email Address">
                    <input type="email" value={currentUser.email} disabled style={{ ...inputStyle, opacity: 0.65, cursor: 'not-allowed' }} />
                  </Field>
                  <Field label="Phone (optional)">
                    <div style={{ position: 'relative' }}>
                      <Phone size={17} style={iconStyle} />
                      <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+94 77 123 4567" style={{ ...inputStyle, paddingLeft: '40px' }} />
                    </div>
                  </Field>
                  <Field label="Avatar Image URL (optional)">
                    <div style={{ position: 'relative' }}>
                      <ImagePlus size={17} style={iconStyle} />
                      <input type="url" value={form.avatar} onChange={set('avatar')} placeholder="https://..." style={{ ...inputStyle, paddingLeft: '40px' }} />
                    </div>
                  </Field>
                </div>

                <div>
                  <Field label="Address (optional)">
                    <div style={{ position: 'relative' }}>
                      <MapPin size={17} style={iconStyle} />
                      <input type="text" value={form.address} onChange={set('address')} placeholder="Street address" style={{ ...inputStyle, paddingLeft: '40px' }} />
                    </div>
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Field label="City (optional)">
                      <input type="text" value={form.city} onChange={set('city')} placeholder="Colombo" style={inputStyle} />
                    </Field>
                    <Field label="Country (optional)">
                      <input type="text" value={form.country} onChange={set('country')} placeholder="Sri Lanka" style={inputStyle} />
                    </Field>
                  </div>
                  <Field label="Bio (optional)">
                    <textarea value={form.bio} onChange={set('bio')} rows={3} maxLength={240} placeholder="Tell us a little about yourself..." style={{ ...inputStyle, resize: 'vertical' }} />
                  </Field>
                </div>
              </div>

              {/* Avatar picker */}
              <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>Profile Picture</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', border: '1px solid var(--color-border-strong)', background: 'var(--color-background)', color: 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer' }}>
                    {uploading ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />} Upload Photo
                  </button>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-subtle)' }}>or pick one:</span>
                  {presetAvatars.map((url) => (
                    <button type="button" key={url} onClick={() => setForm((f) => ({ ...f, avatar: url }))}
                      style={{ padding: 0, borderRadius: '50%', cursor: 'pointer', background: 'none', border: form.avatar === url ? '3px solid var(--color-accent)' : '3px solid transparent', boxShadow: form.avatar === url ? 'var(--shadow-glow)' : 'none' }}>
                      <img src={url} alt="avatar option" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', backgroundColor: 'var(--color-surface-2)' }} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                <button type="submit" disabled={saving || !dirty} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: 'var(--radius-full)', background: saved ? 'var(--color-success)' : 'var(--gradient-brand)', color: '#fff', border: 'none', fontWeight: 600, cursor: saving || !dirty ? 'not-allowed' : 'pointer', opacity: !dirty && !saved ? 0.55 : 1, boxShadow: dirty ? 'var(--shadow-glow)' : 'none', transition: 'all 0.2s' }}>
                  {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
                </button>
                {dirty && !saving && (
                  <button type="button" onClick={() => setForm(initial)} style={{ padding: '12px 22px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer' }}>Discard</button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {ordersLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} /> Loading your orders...
              </div>
            ) : ordersError ? (
              <div style={{ padding: '24px', borderRadius: '14px', backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--color-error)' }}>{ordersError}</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center', backgroundColor: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '18px' }}>
                <ShoppingBag size={42} style={{ color: 'var(--color-text-subtle)', margin: '0 auto 14px' }} />
                <h3 style={{ marginBottom: '6px' }}>No orders yet</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>When you place an order, it will appear here.</p>
                <button onClick={() => navigate('/shop')} style={{ padding: '11px 24px', borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Start Shopping</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {orders.map((order) => {
                  const st = statusStyles[order.status] || statusStyles.pending;
                  return (
                    <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '18px 22px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--gradient-brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                          <Package size={22} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{order.id}</div>
                          <div style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)' }}>{new Date(order.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <span style={{ padding: '5px 14px', borderRadius: 'var(--radius-full)', backgroundColor: st.bg, color: st.fg, fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{order.status}</span>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{order.currency ? `${order.currency} ${Number(order.amount).toFixed(2)}` : format(order.amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '12px',
  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)',
  color: 'var(--color-text-main)', outline: 'none', fontFamily: 'inherit', fontSize: '0.98rem',
};
const iconStyle = { position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' };

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '18px' }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>{label}</label>
    {children}
  </div>
);

const TabButton = ({ active, onClick, icon, children }) => (
  <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: active ? 'var(--color-accent)' : 'var(--color-text-muted)', borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent', marginBottom: '-1px' }}>
    {icon} {children}
  </button>
);

export default Profile;
