import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Filter, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const products = [
    { id: 1, name: "Premium Leather Jacket", price: 299, category: "Outerwear", image: "https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=500" },
    { id: 2, name: "Minimalist Watch", price: 150, category: "Accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=500" },
    { id: 3, name: "Designer Sunglasses", price: 120, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=500" },
    { id: 4, name: "Classic Denim Jeans", price: 89, category: "Pants", image: "https://images.unsplash.com/photo-1542272617-08f083157f5d?auto=format&fit=crop&q=80&w=500" },
    { id: 5, name: "Urban Sneakers", price: 110, category: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=500" },
    { id: 6, name: "Cotton Blend Hoodie", price: 65, category: "Tops", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=500" },
];

const categories = ["All", "Outerwear", "Accessories", "Pants", "Footwear", "Tops"];

const Shop = () => {
    const { addToCart } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        let result = products;

        // Search Filter
        if (searchQuery) {
            result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

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
    }, [searchQuery, selectedCategory, sortBy]);

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
                                placeholder="Search products..."
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
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
                                        src={product.image}
                                        alt={product.name}
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
                                        ${product.price}
                                    </p>
                                    <button
                                        onClick={() => addToCart(product)}
                                        style={{
                                            marginTop: 'auto',
                                            width: '100%',
                                            padding: '10px',
                                            backgroundColor: 'var(--color-text-main)',
                                            color: 'var(--color-background)',
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
