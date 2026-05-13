import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <motion.div
            className="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5 }}
        >
            {/* Modern Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: 'calc(var(--spacing-3xl) * 2) var(--spacing-xl)',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'var(--color-background)'
            }}>
                {/* Dynamic Background Elements */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: '-10%',
                            right: '-5%',
                            width: '60vw',
                            height: '60vw',
                            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
                            borderRadius: '50%',
                            filter: 'blur(60px)'
                        }}
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            rotate: [0, -90, 0],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            bottom: '-20%',
                            left: '-10%',
                            width: '50vw',
                            height: '50vw',
                            background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(0,0,0,0) 70%)',
                            borderRadius: '50%',
                            filter: 'blur(60px)'
                        }}
                    />
                </div>

                <div style={{ zIndex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-3xl)', alignItems: 'center' }}>

                    {/* Text Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                backgroundColor: 'rgba(var(--color-primary-rgb, 99, 102, 241), 0.1)',
                                color: 'var(--color-primary, #6366f1)',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 600,
                                letterSpacing: '1px',
                                fontSize: '0.85rem',
                                marginBottom: 'var(--spacing-lg)'
                            }}
                        >
                            NEW COLLECTION 2026
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                                lineHeight: 1.1,
                                marginBottom: 'var(--spacing-md)',
                                fontFamily: 'var(--font-family-display, "Outfit", sans-serif)',
                                fontWeight: 800,
                                letterSpacing: '-2px',
                                color: 'var(--color-text-main)'
                            }}
                        >
                            <span style={{ display: 'block' }}>Elevate</span>
                            <span style={{
                                display: 'block',
                                background: 'linear-gradient(135deg, var(--color-primary, #6366f1) 0%, var(--color-accent, #ec4899) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                paddingRight: '10px'
                            }}>Your Style.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            style={{
                                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                                color: 'var(--color-text-muted)',
                                marginBottom: 'var(--spacing-2xl)',
                                maxWidth: '500px',
                                lineHeight: 1.6
                            }}
                        >
                            Discover premium fabrics and cutting-edge designs engineered for those who dare to stand out. Welcome to the future of fashion.
                        </motion.p>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                            <Link to="/shop" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '16px 40px',
                                        backgroundColor: 'var(--color-primary, #6366f1)',
                                        color: '#ffffff',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 'var(--radius-full)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Shop Now
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </motion.button>
                            </Link>

                            <Link to="/about" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '16px 40px',
                                        backgroundColor: 'transparent',
                                        color: 'var(--color-text-main)',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 'var(--radius-full)',
                                        border: '2px solid var(--color-border)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Lookbook
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Images Grid */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ position: 'relative', height: '450px' }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '10%',
                            right: '5%',
                            width: '60%',
                            height: '80%',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            zIndex: 2
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
                                alt="Fashion Model"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <motion.div
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            style={{
                                position: 'absolute',
                                bottom: '5%',
                                left: '5%',
                                width: '45%',
                                height: '50%',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                                zIndex: 3,
                                border: '4px solid var(--color-background)'
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
                                alt="Fashion Accessorie"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Products Showcase */}
            <section style={{ padding: 'calc(var(--spacing-3xl) * 1.5) var(--spacing-xl)', backgroundColor: 'var(--color-surface)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'var(--spacing-3xl)', flexWrap: 'wrap', gap: 'var(--spacing-lg)' }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontFamily: 'var(--font-family-display)', letterSpacing: '-1px', color: 'var(--color-text-main)', marginBottom: '8px' }}>Trending Now</h2>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Handpicked selections for the modern wardrobe.</p>
                        </div>
                        <Link to="/shop" style={{
                            color: 'var(--color-primary, #6366f1)',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(var(--color-primary-rgb, 99, 102, 241), 0.1)'
                        }}>
                            Explore All <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 'var(--spacing-2xl)',
                    }}>
                        {[
                            { id: 1, title: "Urban Velocity Jacket", price: "$249.00", img: "1551028919-6a014909a909" },
                            { id: 2, title: "Astra Signature Shades", price: "$129.00", img: "1511499767150-a48a237f0083" },
                            { id: 3, title: "Minimalist Chrono Watch", price: "$189.00", img: "1524805444758-089113d48a6d" }
                        ].map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                whileHover={{ y: -15 }}
                                style={{
                                    backgroundColor: 'var(--color-background)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(var(--color-border-rgb, 0, 0, 0), 0.05)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                                }}
                            >
                                <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        src={`https://images.unsplash.com/photo-${item.img}?auto=format&fit=crop&q=80&w=800`}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{
                                            position: 'absolute',
                                            bottom: '20px',
                                            right: '20px',
                                            width: '48px',
                                            height: '48px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            color: 'black',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                                    </motion.button>
                                </div>
                                <div style={{ padding: 'var(--spacing-xl)' }}>
                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--color-text-main)', fontWeight: 600 }}>{item.title}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{item.price}</p>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {[1, 2, 3, 4, 5].map(star => <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" color="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
