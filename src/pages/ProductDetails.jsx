import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { format } = useCurrency();
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeTab, setActiveTab] = useState('description');

    // Mock data - normally fetched by ID
    const product = {
        id: id,
        name: "Premium Leather Jacket",
        price: 299,
        rating: 4.8,
        description: "Experience ultimate luxury with our premium leather jacket. Handcrafted from Italian leather, it features a modern slim fit and durable hardware. Perfect for any occasion.",
        images: [
            "https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800"
        ],
        specs: {
            material: "100% Full-grain Italian Leather",
            lining: "Viscose Rayon",
            fit: "Slim Fit",
            care: "Professional Leather Clean Only"
        }
    };

    const [mainImage, setMainImage] = useState(product.images[0]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: 'var(--spacing-3xl) var(--spacing-xl)', maxWidth: '1200px', margin: '0 auto' }}
        >
            <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                <ArrowLeft size={18} /> Back to Shop
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 'var(--spacing-2xl)' }}>
                {/* Gallery */}
                <div>
                    <motion.div
                        key={mainImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            height: 'clamp(280px, 50vw, 400px)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            marginBottom: 'var(--spacing-md)',
                            boxShadow: 'var(--shadow-premium)',
                            backgroundColor: 'white'
                        }}>
                        <img src={mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        {product.images.map((img, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(img)}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: mainImage === img ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 'var(--spacing-xs)', fontFamily: 'var(--font-family-display)' }}>{product.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xl)', color: '#fbbf24' }}>
                        <Star fill="#fbbf24" size={20} />
                        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{product.rating}</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>(128 reviews)</span>
                    </div>

                    <p style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-main)' }}>
                        {format(product.price)}
                    </p>

                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Select Size</h4>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: 'var(--radius-md)',
                                        border: selectedSize === size ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                        backgroundColor: selectedSize === size ? 'var(--color-accent)' : 'transparent',
                                        color: selectedSize === size ? 'white' : 'var(--color-text-main)',
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
                        <motion.button
                            onClick={() => addToCart(product)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                flex: 1,
                                padding: 'var(--spacing-lg)',
                                backgroundColor: 'var(--color-accent)',
                                color: '#ffffff',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-md)',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            <ShoppingBag size={20} />
                            Add to Cart
                        </motion.button>
                    </div>

                    {/* Tabs */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--spacing-lg)' }}>
                            <button
                                onClick={() => setActiveTab('description')}
                                style={{
                                    paddingRight: 'var(--spacing-xl)',
                                    paddingBottom: 'var(--spacing-sm)',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === 'description' ? '2px solid var(--color-accent)' : '2px solid transparent',
                                    color: activeTab === 'description' ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('specs')}
                                style={{
                                    paddingRight: 'var(--spacing-xl)',
                                    paddingBottom: 'var(--spacing-sm)',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === 'specs' ? '2px solid var(--color-accent)' : '2px solid transparent',
                                    color: activeTab === 'specs' ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                Specifications
                            </button>
                        </div>

                        <div style={{ minHeight: '100px', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
                            {activeTab === 'description' && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{product.description}</motion.p>
                            )}
                            {activeTab === 'specs' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {Object.entries(product.specs).map(([key, value]) => (
                                            <li key={key} style={{ display: 'flex', marginBottom: 'var(--spacing-sm)' }}>
                                                <span style={{ width: '120px', fontWeight: 600, textTransform: 'capitalize' }}>{key}:</span>
                                                <span>{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                            <Truck size={20} />
                            <span style={{ fontSize: '0.9rem' }}>Free Shipping</span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                            <ShieldCheck size={20} />
                            <span style={{ fontSize: '0.9rem' }}>2 Year Warranty</span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                            <RefreshCw size={20} />
                            <span style={{ fontSize: '0.9rem' }}>30 Day Returns</span>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetails;
