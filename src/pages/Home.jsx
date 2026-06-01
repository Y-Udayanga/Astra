import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Star, Truck, ShieldCheck, RefreshCw, Headphones, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';

const fallbackProducts = [
  { id: 1, name: 'Premium Leather Jacket', price: 299, image: 'https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=800', category: 'Outerwear' },
  { id: 2, name: 'Minimalist Watch', price: 150, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800', category: 'Accessories' },
  { id: 3, name: 'Designer Sunglasses', price: 120, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800', category: 'Accessories' },
  { id: 5, name: 'Urban Sneakers', price: 110, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800', category: 'Footwear' },
];

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((rows) => { if (active && rows.length) setProducts(rows.slice(0, 4)); })
      .catch((err) => console.error('Home: failed to load products', err));
    return () => { active = false; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.5 }}>
      {/* ===== HERO ===== */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        padding: 'clamp(3rem, 8vw, 7rem) var(--spacing-xl)', position: 'relative', overflow: 'hidden',
        backgroundColor: 'var(--color-background)',
      }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: '-10%', right: '-5%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)' }}
          />
        </div>

        <div className="hero-grid" style={{ zIndex: 1, maxWidth: '1320px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'center' }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', background: 'var(--color-accent-soft)', color: 'var(--color-accent)', borderRadius: 'var(--radius-full)', fontWeight: 600, letterSpacing: '0.5px', fontSize: '0.82rem', marginBottom: 'var(--spacing-lg)' }}
            >
              <Sparkles size={15} /> NEW COLLECTION 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 'clamp(2.7rem, 8vw, 6rem)', lineHeight: 1.05, marginBottom: 'var(--spacing-md)', fontFamily: 'var(--font-family-display)', fontWeight: 800, letterSpacing: '-2px', color: 'var(--color-text-main)' }}
            >
              <span style={{ display: 'block' }}>Elevate</span>
              <span className="text-gradient" style={{ display: 'block', paddingRight: '10px' }}>Your Style.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)', maxWidth: '500px', lineHeight: 1.6 }}
            >
              Discover premium fabrics and cutting-edge designs engineered for those who dare to stand out. Welcome to the future of fashion.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }} style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', marginBottom: 'var(--spacing-2xl)' }}>
              <Link to="/shop" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '15px 34px', background: 'var(--gradient-brand)', color: '#fff', fontSize: '1.05rem', fontWeight: 600, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-glow)', border: 'none', cursor: 'pointer' }}>
                  Shop Now <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '15px 34px', backgroundColor: 'transparent', color: 'var(--color-text-main)', fontSize: '1.05rem', fontWeight: 600, borderRadius: 'var(--radius-full)', border: '2px solid var(--color-border-strong)', cursor: 'pointer' }}>
                  View Lookbook
                </motion.button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ display: 'flex', gap: 'clamp(1.5rem, 4vw, 3rem)', flexWrap: 'wrap' }}>
              {[['10K+', 'Happy Customers'], ['500+', 'Premium Products'], ['4.9★', 'Average Rating']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, fontFamily: 'var(--font-family-display)', color: 'var(--color-text-main)' }}>{n}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero images */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} style={{ position: 'relative', height: 'clamp(340px, 50vw, 480px)', minHeight: '320px' }}>
            <div style={{ position: 'absolute', top: '5%', right: '5%', width: '66%', height: '88%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.35)', zIndex: 2 }}>
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" alt="Fashion model" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)', padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 10px #4ade80' }} />
                <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Spring '26 Live</span>
              </motion.div>
            </div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', bottom: 0, left: 0, width: '46%', height: '52%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', zIndex: 3, border: '4px solid var(--color-background)' }}>
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" alt="Accessories" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, y: [0, 15, 0] }} transition={{ opacity: { duration: 1, delay: 0.8 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
              style={{ position: 'absolute', top: '12%', left: '-4%', width: '30%', height: '30%', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)', zIndex: 4, border: '3px solid var(--color-background)' }}>
              <img src="https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=400" alt="Detail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div style={{ backgroundColor: 'var(--color-text-main)', color: 'var(--color-background)', padding: '14px 0', overflow: 'hidden', display: 'flex', whiteSpace: 'nowrap' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
          style={{ display: 'flex', gap: '2rem', fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span>Free Worldwide Shipping</span><span style={{ color: 'var(--color-accent)' }}>✦</span>
              <span>Secure Payments</span><span style={{ color: 'var(--color-accent)' }}>✦</span>
              <span>30-Day Returns</span><span style={{ color: 'var(--color-accent)' }}>✦</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* ===== BENEFITS STRIP ===== */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) var(--spacing-xl)', backgroundColor: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 'var(--spacing-lg)' }}>
          {[
            { icon: Truck, title: 'Free Shipping', text: 'On all orders worldwide' },
            { icon: ShieldCheck, title: 'Secure Checkout', text: 'PayHere encrypted payments' },
            { icon: RefreshCw, title: '30-Day Returns', text: 'Hassle-free refund policy' },
            { icon: Headphones, title: '24/7 Support', text: 'Dedicated style experts' },
          ].map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px', borderRadius: '16px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '13px', background: 'var(--gradient-brand-soft)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <b.icon size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{b.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{b.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TRENDING (LIVE) ===== */}
      <section style={{ padding: 'clamp(2rem, 5vw, 5rem) var(--spacing-xl)', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'var(--spacing-2xl)', flexWrap: 'wrap', gap: 'var(--spacing-lg)' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontFamily: 'var(--font-family-display)', letterSpacing: '-1px', color: 'var(--color-text-main)', marginBottom: '8px' }}>Trending Now</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}>Handpicked selections for the modern wardrobe.</p>
            </div>
            <Link to="/shop" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-accent-soft)' }}>
              Explore All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 'var(--spacing-xl)' }}>
            {products.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -8 }}
                style={{ backgroundColor: 'var(--color-background)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/product/${item.id}`} style={{ display: 'block', height: 'clamp(220px, 28vw, 300px)', position: 'relative', overflow: 'hidden' }}>
                  <motion.img whileHover={{ scale: 1.06 }} transition={{ duration: 0.4 }} src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {i < 2 && <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--gradient-brand)', color: '#fff', padding: '4px 12px', fontSize: '0.7rem', fontWeight: 700, borderRadius: 'var(--radius-full)', letterSpacing: '0.5px' }}>BESTSELLER</span>}
                </Link>
                <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                  <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--color-text-main)', fontWeight: 600 }}>{item.name}</h3>
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>${Number(item.price).toFixed(2)}</span>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)} aria-label="Add to cart"
                      style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--gradient-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-glow)' }}>
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section style={{ padding: 'clamp(2rem, 5vw, 5rem) var(--spacing-xl)', backgroundColor: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontFamily: 'var(--font-family-display)', letterSpacing: '-1px', color: 'var(--color-text-main)', marginBottom: '12px' }}>Curated Collections</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', maxWidth: '600px', margin: '0 auto' }}>Discover pieces that define your personal aesthetic across our premium categories.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--spacing-xl)' }}>
            {[
              { name: 'Outerwear', img: '1551028919-6a014909a909' },
              { name: 'Accessories', img: '1511499767150-a48a237f0083' },
              { name: 'Footwear', img: '1549298916-b41d501d3772' },
            ].map((cat, i) => (
              <Link key={cat.name} to="/shop" state={{ category: cat.name }} style={{ textDecoration: 'none' }}>
                <motion.div whileHover="hover" initial="initial" whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{ position: 'relative', height: 'clamp(300px, 40vw, 420px)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                  <motion.img variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }} transition={{ duration: 0.6 }} src={`https://images.unsplash.com/photo-${cat.img}?auto=format&fit=crop&q=80&w=800`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)', display: 'flex', alignItems: 'flex-end', padding: 'var(--spacing-xl)' }}>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '8px' }}>{cat.name}</h3>
                      <motion.div variants={{ initial: { x: -10, opacity: 0.7 }, hover: { x: 0, opacity: 1 } }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontWeight: 500 }}>
                        Shop Collection <ArrowRight size={16} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL ===== */}
      <section style={{ padding: 'clamp(2rem, 5vw, 6rem) var(--spacing-xl)', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontFamily: 'var(--font-family-display)', letterSpacing: '-1px', color: 'var(--color-text-main)', marginBottom: '12px' }}>The Editorial</motion.h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', maxWidth: '600px', margin: '0 auto' }}>As seen on the streets of Milan, Paris, and Tokyo.</p>
          </div>
          <div className="editorial-grid" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {[
              { cls: 'editorial-item-1', src: '1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800', h: 'clamp(280px, 50vw, 500px)' },
              { cls: 'editorial-item-2', src: '1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200', h: 'clamp(200px, 30vw, 240px)' },
              { cls: 'editorial-item-3', src: '1485230405346-71acb9518d9c?auto=format&fit=crop&q=80&w=600', h: 'clamp(200px, 30vw, 240px)' },
              { cls: 'editorial-item-4', src: '1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600', h: 'clamp(200px, 30vw, 240px)' },
            ].map((it, i) => (
              <motion.div key={it.cls} className={it.cls} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ borderRadius: '20px', overflow: 'hidden', height: it.h }}>
                <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }} src={`https://images.unsplash.com/photo-${it.src}`} alt="Lookbook" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section style={{ padding: 'clamp(2rem, 5vw, 6rem) var(--spacing-xl)', backgroundColor: 'var(--color-background)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, rgba(0,0,0,0) 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontFamily: 'var(--font-family-display)', fontWeight: 800, marginBottom: '18px', color: 'var(--color-text-main)' }}>Join the Inner Circle</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', marginBottom: '36px', lineHeight: 1.6 }}>Subscribe for early access to new collections, exclusive events, and insider-only promotions.</p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}>
              <input type="email" placeholder="Enter your email address" style={{ flex: '1 1 250px', minWidth: 0, padding: '15px 22px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none' }} />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
                style={{ padding: '15px 30px', background: 'var(--gradient-brand)', color: '#fff', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-glow)' }}>
                Subscribe
              </motion.button>
            </form>
            <p style={{ color: 'var(--color-text-subtle)', fontSize: '0.85rem', marginTop: '16px' }}>By subscribing you agree to our Terms & Privacy Policy.</p>
          </motion.div>
        </div>
      </section>

      <style>{`
        .editorial-grid { grid-template-columns: 1fr; }
        @media (min-width: 640px) { .editorial-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 900px) {
          .editorial-grid { grid-template-columns: 5fr 7fr; }
          .editorial-item-1 { grid-row: span 2; }
        }
      `}</style>
    </motion.div>
  );
};

export default Home;
