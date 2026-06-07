import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search, Filter, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { CATEGORIES as categories } from '../data/products';
import { fetchStorefrontProducts, searchProducts } from '../services/catalog';
import { handleImgError } from '../utils/imageFallback';

const Shop = () => {
    const { addToCart } = useCart();
    const { format } = useCurrency();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All');
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(Boolean(location.state?.category));

    useEffect(() => {
        let active = true;
        fetchStorefrontProducts()
            .then((rows) => { if (active) setProducts(rows); })
            .catch((err) => console.error('Shop: failed to load products', err))
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) setSearchQuery(q);
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        let result = searchProducts(products, searchQuery);

        // Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Sorting
        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            // Reset to default order
            result.sort((a, b) => a.id - b.id);
        }

        return result;
    }, [products, searchQuery, selectedCategory, sortBy]);

    if (loading) {
        return (
            <div style={{ padding: 'var(--spacing-3xl) var(--spacing-xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Loading collection...
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: 'var(--spacing-2xl) var(--spacing-xl)' }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 800
                }}>
                    The Collection
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-2xl)', fontSize: '1rem' }}>
                    Curated essentials for the modern pioneer.
                </p>

                {/* Filters and Search Bar */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-2xl)',
                    backgroundColor: 'var(--color-surface)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Search Input */}
                        <div style={{ flex: '1 1 300px', position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search products, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background)',
                                    color: 'var(--color-text-main)',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        {/* Filter Toggle Mobile */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                backgroundColor: 'var(--color-background)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                color: 'var(--color-text-main)',
                                fontWeight: 500
                            }}
                        >
                            <Filter size={18} /> Filters
                        </button>

                        {/* Sort Dropdown */}
                        <div style={{ position: 'relative', minWidth: '180px' }}>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 35px 12px 15px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background)',
                                    color: 'var(--color-text-main)',
                                    appearance: 'none',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                            <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    {/* Expandable Category Filters */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--spacing-sm)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            style={{
                                                padding: '6px 16px',
                                                borderRadius: 'var(--radius-full)',
                                                border: selectedCategory === category ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                                backgroundColor: selectedCategory === category ? 'var(--color-accent)' : 'var(--color-background)',
                                                color: selectedCategory === category ? 'white' : 'var(--color-text-main)',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                    gap: 'var(--spacing-lg)',
                }}>
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -5 }}
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'box-shadow 0.3s ease'
                                }}
                            >
                                <Link to={`/product/${product.id}`} style={{ overflow: 'hidden', position: 'relative' }}>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        src={(product.images && product.images[0]) || product.image}
                                        alt={product.name}
                                        onError={handleImgError}
                                        style={{
                                            width: '100%',
                                            height: '280px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {product.id < 3 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            backgroundColor: 'white',
                                            color: 'black',
                                            padding: '4px 10px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            borderRadius: 'var(--radius-full)'
                                        }}>
                                            BESTSELLER
                                        </div>
                                    )}
                                </Link>
                                <div style={{ padding: 'var(--spacing-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text-main)', fontWeight: 600 }}>{product.name}</h3>
                                    </Link>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>
                                        {format(product.price)}
                                    </p>
                                    <button
                                        onClick={() => addToCart(product)}
                                        style={{
                                            marginTop: 'auto',
                                            width: '100%',
                                            padding: '10px',
                                            backgroundColor: 'var(--color-accent)',
                                            color: '#ffffff',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 'var(--spacing-sm)',
                                            transition: 'opacity 0.2s',
                                            cursor: 'pointer',
                                            border: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.9rem'
                                        }}>
                                        <ShoppingBag size={16} />
                                        Add to Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredProducts.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-3xl)', color: 'var(--color-text-muted)' }}>
                            <h3>No products found matching your criteria.</h3>
                            <button 
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSortBy('featured'); }}
                                style={{ marginTop: 'var(--spacing-md)', padding: '8px 16px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Shop;
