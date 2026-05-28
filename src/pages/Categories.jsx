import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
    { name: "Outerwear", image: "https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=800", count: 12 },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800", count: 24 },
    { name: "Pants", image: "https://images.unsplash.com/photo-1542272617-08f083157f5d?auto=format&fit=crop&q=80&w=800", count: 8 },
    { name: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800", count: 15 },
    { name: "Tops", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800", count: 30 },
];

const Categories = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: 'var(--spacing-3xl) var(--spacing-xl)', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}
        >
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-family-display)', marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>Categories</h1>
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-3xl)', fontSize: '1.2rem' }}>
                Browse our collection by category.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--spacing-xl)' }}>
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        style={{ position: 'relative', height: '250px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer' }}
                    >
                        <Link to="/shop" state={{ category: cat.name }} style={{ display: 'block', height: '100%', width: '100%', textDecoration: 'none' }}>
                            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <h2 style={{ color: 'white', fontSize: '2rem', margin: 0, fontFamily: 'var(--font-family-display)' }}>{cat.name}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>{cat.count} Items</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Categories;
