import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: 'var(--spacing-3xl) var(--spacing-xl)', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--spacing-2xl)', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-family-display)', marginBottom: 'var(--spacing-lg)' }}>About ASTRA</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
                        Founded in 2026, ASTRA was born out of a desire to create a modern, minimalist wardrobe for the forward-thinking individual. We believe that fashion should be effortless, sustainable, and timeless.
                    </p>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
                        Our design philosophy centers on clean lines, premium materials, and ethical manufacturing processes. Every piece in our collection is thoughtfully designed to empower you in your daily life.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-xl)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div>
                            <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-accent)' }}>10K+</h3>
                            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Happy Customers</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-accent)' }}>100%</h3>
                            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Sustainable Materials</p>
                        </div>
                    </div>
                </div>
                <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-premium)', height: 'clamp(300px, 50vw, 600px)' }}>
                    <img src="https://images.unsplash.com/photo-1550614000-4b95d4662d85?auto=format&fit=crop&q=80&w=800" alt="About Astra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </div>
        </motion.div>
    );
};

export default About;
