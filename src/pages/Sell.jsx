import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, DollarSign, Tag, Image as ImageIcon } from 'lucide-react';

const Sell = () => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: 'var(--spacing-3xl) var(--spacing-xl)'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>List a Product</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Share your collection with the world</p>
            </div>

            <form style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xl)',
                backgroundColor: 'var(--color-surface)',
                padding: 'var(--spacing-2xl)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)'
            }}>

                {/* Image Upload */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    style={{
                        border: `2px dashed ${dragActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-2xl)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)'
                    }}
                >
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.5
                    }}>
                        <Upload size={32} />
                    </div>
                    <div>
                        <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>Click to upload or drag and drop</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                </div>

                {/* Product Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Product Name</label>
                        <div style={{ position: 'relative' }}>
                            <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="e.g. Vintage Leather Jacket"
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background)',
                                    color: 'var(--color-text-main)',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Price</label>
                        <div style={{ position: 'relative' }}>
                            <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="number"
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background)',
                                    color: 'var(--color-text-main)',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                    <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Description</label>
                    <textarea
                        rows="5"
                        placeholder="Describe your product..."
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-text-main)',
                            outline: 'none',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        style={{
                            padding: '12px 24px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'transparent',
                            color: 'var(--color-text-main)',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button" // Prevent submit for demo
                        style={{
                            padding: '12px 32px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-accent)',
                            color: '#ffffff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Plus size={18} /> List Product
                    </button>
                </div>

            </form>
        </motion.div>
    );
};

export default Sell;
