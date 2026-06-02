import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, X, Loader2, Save, ImageOff, AlertTriangle } from 'lucide-react';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';

const emptyProduct = { name: '', description: '', price: '', category: '', image: '', stock: '', status: 'active' };
const CATEGORIES = ['Outerwear', 'Accessories', 'Pants', 'Footwear', 'Tops', 'Bags', 'Watches'];

const Products = () => {
    const toast = useToast();
    const { format } = useCurrency();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [activeOnly, setActiveOnly] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // product being edited, or null for create
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        try {
            setProducts(await getProducts());
        } catch (err) {
            toast.error(err.message || 'Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProducts(); /* eslint-disable-next-line */ }, []);

    const filteredProducts = useMemo(() => products.filter((p) => {
        const matchesQuery = [p.name, p.category, p.status].join(' ').toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (!activeOnly || p.status === 'active');
    }), [activeOnly, products, query]);

    const openCreate = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (product) => { setEditing(product); setModalOpen(true); };

    const handleSave = async (formData) => {
        if (editing) {
            const saved = await updateProduct(editing.id, formData);
            toast.success(`"${saved.name}" updated successfully.`);
        } else {
            const created = await createProduct(formData);
            toast.success(`"${created.name}" added to the catalog.`);
        }
        await loadProducts();
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteProduct(deleteTarget.id);
            toast.success(`"${deleteTarget.name}" deleted.`);
            setDeleteTarget(null);
            await loadProducts();
        } catch (err) {
            toast.error(err.message || 'Failed to delete product.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', marginBottom: '8px' }}>Products</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your product catalog</p>
                </div>
                <button type="button" onClick={openCreate} style={{ background: 'var(--gradient-brand)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-glow)' }}>
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '14px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '320px', minWidth: '180px' }}>
                        <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', outline: 'none' }} />
                    </div>
                    <button type="button" onClick={() => setActiveOnly((v) => !v)} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--color-border)', background: activeOnly ? 'var(--color-accent-soft)' : 'var(--color-background)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: activeOnly ? 'var(--color-accent)' : 'var(--color-text-main)', fontWeight: 500 }}>
                        <Filter size={18} /> {activeOnly ? 'Showing Active' : 'All Statuses'}
                    </button>
                    <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{filteredProducts.length} product(s)</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-background)' }}>
                            <tr>
                                {['Product', 'Category', 'Price', 'Stock', 'Status', ''].map((h, i) => (
                                    <th key={i} style={{ padding: '14px 24px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}><Loader2 size={22} className="animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                            ) : filteredProducts.length > 0 ? filteredProducts.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '14px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--color-surface-2)', borderRadius: '10px', backgroundImage: item.image ? `url(${item.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 24px', color: 'var(--color-text-muted)' }}>{item.category}</td>
                                    <td style={{ padding: '14px 24px', fontWeight: 600 }}>{format(item.price)}</td>
                                    <td style={{ padding: '14px 24px', color: item.stock <= 10 ? 'var(--color-warning)' : 'var(--color-text-muted)', fontWeight: item.stock <= 10 ? 600 : 400 }}>{item.stock} in stock</td>
                                    <td style={{ padding: '14px 24px' }}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                            <button type="button" onClick={() => openEdit(item)} title="Edit" style={iconBtn}><Edit2 size={17} /></button>
                                            <button type="button" onClick={() => setDeleteTarget(item)} title="Delete" style={{ ...iconBtn, color: 'var(--color-error)' }}><Trash2 size={17} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No products match your filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <ProductFormModal key="form" product={editing} onClose={() => setModalOpen(false)} onSave={handleSave} />
                )}
                {deleteTarget && (
                    <ConfirmModal
                        key="confirm"
                        product={deleteTarget}
                        deleting={deleting}
                        onCancel={() => setDeleteTarget(null)}
                        onConfirm={confirmDelete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const map = {
        active: { c: 'var(--color-success)', bg: 'rgba(16,185,129,0.12)' },
        draft: { c: 'var(--color-warning)', bg: 'rgba(245,158,11,0.12)' },
        archived: { c: 'var(--color-text-muted)', bg: 'var(--color-surface-2)' },
    };
    const s = map[status] || map.draft;
    return <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', backgroundColor: s.bg, color: s.c, fontWeight: 600, textTransform: 'capitalize' }}>{status}</span>;
};

const ProductFormModal = ({ product, onClose, onSave }) => {
    const [form, setForm] = useState(product ? {
        name: product.name || '', description: product.description || '', price: product.price ?? '',
        category: product.category || '', image: product.image || '', stock: product.stock ?? '', status: product.status || 'active',
    } : emptyProduct);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name.trim()) { setError('Product name is required.'); return; }
        setSaving(true);
        try {
            await onSave({
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price) || 0,
                category: form.category.trim() || 'Uncategorized',
                image: form.image.trim(),
                stock: Number(form.stock) || 0,
                status: form.status,
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save product.');
            setSaving(false);
        }
    };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
                style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', zIndex: 200 }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(620px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', backgroundColor: 'var(--color-elevated)', borderRadius: '20px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-premium)', zIndex: 201 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, backgroundColor: 'var(--color-elevated)', zIndex: 2 }}>
                    <h2 style={{ fontSize: '1.3rem', margin: 0 }}>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}><X size={22} /></button>
                </div>

                <form onSubmit={submit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Image preview */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '88px', height: '88px', borderRadius: '14px', backgroundColor: 'var(--color-surface-2)', backgroundImage: form.image ? `url(${form.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--color-border)' }}>
                            {!form.image && <ImageOff size={26} color="var(--color-text-subtle)" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Label>Image URL</Label>
                            <input type="url" value={form.image} onChange={set('image')} placeholder="https://images..." style={field} />
                        </div>
                    </div>

                    <div>
                        <Label>Product Name *</Label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Premium Leather Jacket" required style={field} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '16px' }}>
                        <div>
                            <Label>Price</Label>
                            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="0.00" style={field} />
                        </div>
                        <div>
                            <Label>Stock</Label>
                            <input type="number" min="0" value={form.stock} onChange={set('stock')} placeholder="0" style={field} />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <select value={form.status} onChange={set('status')} style={field}>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <Label>Category</Label>
                        <input type="text" list="cat-list" value={form.category} onChange={set('category')} placeholder="Select or type a category" style={field} />
                        <datalist id="cat-list">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
                    </div>

                    <div>
                        <Label>Description</Label>
                        <textarea value={form.description} onChange={set('description')} rows={4} placeholder="Describe the product..." style={{ ...field, resize: 'vertical' }} />
                    </div>

                    {error && <div style={{ color: 'var(--color-error)', fontSize: '0.88rem' }}>{error}</div>}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '11px 22px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={saving} style={{ padding: '11px 26px', borderRadius: '10px', border: 'none', background: 'var(--gradient-brand)', color: '#fff', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}>
                            {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> {product ? 'Save Changes' : 'Create Product'}</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </>
    );
};

const ConfirmModal = ({ product, deleting, onCancel, onConfirm }) => (
    <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', zIndex: 200 }} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(420px, calc(100vw - 32px))', backgroundColor: 'var(--color-elevated)', borderRadius: '18px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-premium)', zIndex: 201, padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={28} />
            </div>
            <h3 style={{ marginBottom: '8px' }}>Delete product?</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={onCancel} style={{ padding: '11px 22px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={onConfirm} disabled={deleting} style={{ padding: '11px 22px', borderRadius: '10px', border: 'none', background: 'var(--color-error)', color: '#fff', fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    {deleting ? <><Loader2 size={18} className="animate-spin" /> Deleting...</> : <><Trash2 size={18} /> Delete</>}
                </button>
            </div>
        </motion.div>
    </>
);

const iconBtn = { padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', borderRadius: '8px', display: 'flex' };
const field = { width: '100%', padding: '11px 13px', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem' };
const Label = ({ children }) => <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '7px' }}>{children}</label>;

export default Products;
