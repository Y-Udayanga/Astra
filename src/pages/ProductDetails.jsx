import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Star, ArrowLeft, Truck, ShieldCheck, RefreshCw,
    Minus, Plus, Heart, Check, ChevronRight, Zap, ChevronLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { fetchStorefrontProduct } from '../services/catalog';
import { getRelatedProducts } from '../data/products';
import { handleImgError } from '../utils/imageFallback';

const MOCK_REVIEWS = [
    { name: 'Amaya P.', rating: 5, date: '2 weeks ago', text: 'Absolutely stunning quality. Exceeded my expectations — feels premium and fits perfectly.' },
    { name: 'Dilan R.', rating: 4, date: '1 month ago', text: 'Great product overall. Shipping was quick and the packaging was lovely. Knocked one star for sizing running slightly large.' },
    { name: 'Sara K.', rating: 5, date: '1 month ago', text: 'My third purchase from ASTRA and they never disappoint. Highly recommend!' },
];

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, updateQuantity, openCart } = useCart();
    const { format } = useCurrency();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [mainIndex, setMainIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [wishlisted, setWishlisted] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setNotFound(false);

        fetchStorefrontProduct(id)
            .then((row) => {
                if (!active) return;
                if (row) {
                    setProduct(row);
                    setNotFound(false);
                } else {
                    setProduct(null);
                    setNotFound(true);
                }
            })
            .catch(() => {
                if (active) {
                    setProduct(null);
                    setNotFound(true);
                }
            })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; };
    }, [id]);

    // Reset transient UI whenever the product changes.
    useEffect(() => {
        setMainIndex(0);
        setQuantity(1);
        setActiveTab('description');
        setWishlisted(false);
        setSelectedColor(0);
        setSelectedSize(product?.sizes?.[0] ?? null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [product]);

    const images = useMemo(() => {
        if (!product) return [];
        const list = (product.images && product.images.length ? product.images : [product.image]).filter(Boolean);
        return list.length ? list : [''];
    }, [product]);

    const related = useMemo(() => getRelatedProducts(product), [product]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product);
        if (quantity > 1) updateQuantity(product.id, quantity - 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    const handleBuyNow = () => {
        if (!product) return;
        addToCart(product);
        if (quantity > 1) updateQuantity(product.id, quantity - 1);
        navigate('/checkout');
    };

    if (loading) return <ProductSkeleton />;

    if (notFound || !product) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Product not found</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                    The product you're looking for doesn't exist or may have been removed.
                </p>
                <Link to="/shop" style={{ padding: '12px 26px', borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', color: '#fff', fontWeight: 600, textDecoration: 'none', boxShadow: 'var(--shadow-glow)' }}>
                    Browse the Shop
                </Link>
            </div>
        );
    }

    const inStock = product.stock === undefined || product.stock > 0;
    const lowStock = inStock && product.stock !== undefined && product.stock <= 15;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ padding: 'var(--spacing-xl) var(--spacing-xl) var(--spacing-3xl)', maxWidth: '1200px', margin: '0 auto' }}
        >
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
                <ChevronRight size={14} />
                <Link to="/shop" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Shop</Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--color-accent)' }}>{product.category}</span>
            </div>

            <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--spacing-2xl)' }}>
                {/* ===== Gallery ===== */}
                <div>
                    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-premium)', backgroundColor: 'var(--color-surface-2)' }}>
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={mainIndex}
                                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                src={images[mainIndex]} alt={product.name} onError={handleImgError}
                                style={{ width: '100%', height: 'clamp(320px, 48vw, 520px)', objectFit: 'cover', display: 'block' }}
                            />
                        </AnimatePresence>

                        {product.badge && (
                            <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'var(--gradient-brand)', color: '#fff', padding: '5px 14px', fontSize: '0.72rem', fontWeight: 700, borderRadius: 'var(--radius-full)', letterSpacing: '0.5px', boxShadow: 'var(--shadow-glow)' }}>
                                {product.badge}
                            </span>
                        )}

                        {images.length > 1 && (
                            <>
                                <GalleryNav side="left" onClick={() => setMainIndex((i) => (i - 1 + images.length) % images.length)} />
                                <GalleryNav side="right" onClick={() => setMainIndex((i) => (i + 1) % images.length)} />
                            </>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainIndex(index)}
                                    style={{
                                        width: '84px', height: '84px', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', padding: 0,
                                        border: mainIndex === index ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                                        transition: 'border-color 0.2s', background: 'none',
                                    }}
                                >
                                    <img src={img} alt="" onError={handleImgError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ===== Info ===== */}
                <div>
                    <h1 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', marginBottom: 'var(--spacing-xs)', fontFamily: 'var(--font-family-display)', lineHeight: 1.15 }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={18} fill={s <= Math.round(product.rating || 0) ? '#fbbf24' : 'none'} color="#fbbf24" />
                            ))}
                        </div>
                        <span style={{ fontWeight: 600 }}>{product.rating ?? '—'}</span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>({product.reviews ?? MOCK_REVIEWS.length} reviews)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', fontWeight: 800, color: 'var(--color-text-main)' }}>{format(product.price)}</span>
                        <span style={{ fontSize: '1.1rem', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>{format(product.price * 1.3)}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-success)', background: 'rgba(16,185,129,0.12)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>SAVE 23%</span>
                    </div>

                    {/* Stock */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)', fontSize: '0.9rem' }}>
                        <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: inStock ? 'var(--color-success)' : 'var(--color-error)' }} />
                        <span style={{ color: inStock ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                            {inStock ? (lowStock ? `Only ${product.stock} left in stock` : 'In Stock') : 'Out of Stock'}
                        </span>
                    </div>

                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 'var(--spacing-lg)' }}>{product.description}</p>

                    {/* Colors */}
                    {Array.isArray(product.colors) && product.colors.length > 0 && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <h4 style={labelStyle}>Color</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {product.colors.map((c, i) => (
                                    <button
                                        key={c + i}
                                        onClick={() => setSelectedColor(i)}
                                        aria-label={`Color ${i + 1}`}
                                        style={{
                                            width: '34px', height: '34px', borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                                            border: selectedColor === i ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                                            outline: selectedColor === i ? '2px solid var(--color-accent)' : 'none', outlineOffset: '2px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        {selectedColor === i && <Check size={16} color="#fff" style={{ mixBlendMode: 'difference' }} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <h4 style={labelStyle}>Size</h4>
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            minWidth: '50px', height: '46px', padding: '0 14px', borderRadius: 'var(--radius-md)',
                                            border: selectedSize === size ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                            backgroundColor: selectedSize === size ? 'var(--color-accent)' : 'transparent',
                                            color: selectedSize === size ? '#fff' : 'var(--color-text-main)',
                                            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.15s',
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity + actions */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={qtyBtnStyle} aria-label="Decrease quantity"><Minus size={16} /></button>
                            <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                            <button onClick={() => setQuantity((q) => q + 1)} style={qtyBtnStyle} aria-label="Increase quantity"><Plus size={16} /></button>
                        </div>

                        <motion.button
                            onClick={() => setWishlisted((w) => !w)}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Add to wishlist"
                            style={{
                                width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid var(--color-border)', cursor: 'pointer',
                                background: wishlisted ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-2)',
                                color: wishlisted ? 'var(--color-error)' : 'var(--color-text-muted)',
                            }}
                        >
                            <Heart size={20} fill={wishlisted ? 'var(--color-error)' : 'none'} />
                        </motion.button>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                        <motion.button
                            onClick={handleAddToCart} disabled={!inStock}
                            whileHover={{ scale: inStock ? 1.02 : 1 }} whileTap={{ scale: inStock ? 0.98 : 1 }}
                            style={{
                                flex: '1 1 200px', padding: 'var(--spacing-md) var(--spacing-lg)',
                                backgroundColor: added ? 'var(--color-success)' : 'var(--color-surface-2)',
                                color: added ? '#fff' : 'var(--color-text-main)',
                                border: '1px solid var(--color-border)', fontSize: '1rem', fontWeight: 700,
                                borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                cursor: inStock ? 'pointer' : 'not-allowed', opacity: inStock ? 1 : 0.6, transition: 'background-color 0.2s',
                            }}
                        >
                            {added ? <><Check size={20} /> Added to Cart</> : <><ShoppingBag size={20} /> Add to Cart</>}
                        </motion.button>
                        <motion.button
                            onClick={handleBuyNow} disabled={!inStock}
                            whileHover={{ scale: inStock ? 1.02 : 1 }} whileTap={{ scale: inStock ? 0.98 : 1 }}
                            style={{
                                flex: '1 1 200px', padding: 'var(--spacing-md) var(--spacing-lg)', background: 'var(--gradient-brand)',
                                color: '#fff', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-full)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: 'none',
                                cursor: inStock ? 'pointer' : 'not-allowed', opacity: inStock ? 1 : 0.6, boxShadow: 'var(--shadow-glow)',
                            }}
                        >
                            <Zap size={20} /> Buy Now
                        </motion.button>
                    </div>

                    {/* Trust badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-md)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-2)' }}>
                        <Trust icon={<Truck size={20} />} title="Free Shipping" text="On all orders" />
                        <Trust icon={<ShieldCheck size={20} />} title="2-Year Warranty" text="Full coverage" />
                        <Trust icon={<RefreshCw size={20} />} title="30-Day Returns" text="No questions asked" />
                    </div>
                </div>
            </div>

            {/* ===== Tabs ===== */}
            <div style={{ marginTop: 'var(--spacing-3xl)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-xl)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                    {[
                        { id: 'description', label: 'Description' },
                        { id: 'specs', label: 'Specifications' },
                        { id: 'reviews', label: `Reviews (${product.reviews ?? MOCK_REVIEWS.length})` },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                paddingBottom: 'var(--spacing-sm)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
                                borderBottom: activeTab === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                                color: activeTab === tab.id ? 'var(--color-text-main)' : 'var(--color-text-muted)', transition: 'color 0.2s',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ minHeight: '120px', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
                    {activeTab === 'description' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <p style={{ marginBottom: 'var(--spacing-lg)' }}>{product.description}</p>
                            {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', listStyle: 'none', padding: 0 }}>
                                    {product.highlights.map((h) => (
                                        <li key={h} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                                            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent-soft)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Check size={14} />
                                            </span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'specs' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {product.specs && Object.keys(product.specs).length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, maxWidth: '560px' }}>
                                    {Object.entries(product.specs).map(([key, value], i) => (
                                        <li key={key} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid var(--color-border)', background: i % 2 ? 'transparent' : 'transparent' }}>
                                            <span style={{ width: '160px', fontWeight: 600, textTransform: 'capitalize', color: 'var(--color-text-main)' }}>{key}</span>
                                            <span>{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p>No specifications available for this product.</p>}
                        </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-xl)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--spacing-xl)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1 }}>{product.rating ?? 4.7}</div>
                                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '6px 0' }}>
                                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={15} fill={s <= Math.round(product.rating || 5) ? '#fbbf24' : 'none'} color="#fbbf24" />)}
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>{product.reviews ?? MOCK_REVIEWS.length} reviews</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                {MOCK_REVIEWS.map((r) => (
                                    <div key={r.name} style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{r.name}</span>
                                            <span style={{ fontSize: '0.8rem' }}>{r.date}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} fill={s <= r.rating ? '#fbbf24' : 'none'} color="#fbbf24" />)}
                                        </div>
                                        <p style={{ margin: 0 }}>{r.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ===== Related products ===== */}
            {related.length > 0 && (
                <div style={{ marginTop: 'var(--spacing-3xl)' }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-family-display)', marginBottom: 'var(--spacing-xl)' }}>You may also like</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 'var(--spacing-lg)' }}>
                        {related.map((r) => (
                            <motion.div
                                key={r.id} whileHover={{ y: -6 }}
                                style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
                            >
                                <Link to={`/product/${r.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <img src={(r.images && r.images[0]) || r.image} alt={r.name} onError={handleImgError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: 'var(--spacing-md)' }}>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{r.category}</div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>{r.name}</div>
                                        <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{format(r.price)}</div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-2xl)', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500 }}>
                <ArrowLeft size={18} /> Back to Shop
            </Link>
        </motion.div>
    );
};

const labelStyle = {
    marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-muted)',
    textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 700,
};

const qtyBtnStyle = {
    width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-main)',
};

const GalleryNav = ({ side, onClick }) => (
    <button
        onClick={onClick}
        aria-label={side === 'left' ? 'Previous image' : 'Next image'}
        style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)', [side]: '12px',
            width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(0,0,0,0.45)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
        }}
    >
        {side === 'left' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
);

const Trust = ({ icon, title, text }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', textAlign: 'center' }}>
        <span style={{ color: 'var(--color-accent)' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)' }}>{title}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{text}</span>
    </div>
);

const ProductSkeleton = () => (
    <div style={{ padding: 'var(--spacing-xl)', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--spacing-2xl)' }}>
            <div className="pd-shimmer" style={{ height: 'clamp(320px, 48vw, 520px)', borderRadius: 'var(--radius-lg)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="pd-shimmer" style={{ height: '40px', width: '70%', borderRadius: '8px' }} />
                <div className="pd-shimmer" style={{ height: '20px', width: '40%', borderRadius: '8px' }} />
                <div className="pd-shimmer" style={{ height: '50px', width: '50%', borderRadius: '8px' }} />
                <div className="pd-shimmer" style={{ height: '90px', width: '100%', borderRadius: '8px' }} />
                <div className="pd-shimmer" style={{ height: '50px', width: '100%', borderRadius: 'var(--radius-full)' }} />
            </div>
        </div>
        <style>{`
            .pd-shimmer { background: linear-gradient(90deg, var(--color-surface-2) 25%, var(--color-border) 50%, var(--color-surface-2) 75%); background-size: 200% 100%; animation: pd-shimmer 1.3s infinite; }
            @keyframes pd-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
    </div>
);

export default ProductDetails;
