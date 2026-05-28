import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--color-secondary)',
            padding: 'var(--spacing-3xl) var(--spacing-xl) var(--spacing-xl)',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
                gap: 'var(--spacing-2xl)'
            }}>
                {/* Brand */}
                <div>
                    <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>ANTIGRAVITY</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', lineHeight: '1.6' }}>
                        Premium e-commerce experience. Redefining online shopping with style and speed.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <SocialIcon icon={<Facebook size={20} />} />
                        <SocialIcon icon={<Twitter size={20} />} />
                        <SocialIcon icon={<Instagram size={20} />} />
                        <SocialIcon icon={<Linkedin size={20} />} />
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4>Shop</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', color: 'var(--color-text-muted)' }}>
                        <li><a href="#">New Arrivals</a></li>
                        <li><a href="#">Best Sellers</a></li>
                        <li><a href="#">Accessories</a></li>
                        <li><a href="#">Sale</a></li>
                    </ul>
                </div>

                <div>
                    <h4>Support</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', color: 'var(--color-text-muted)' }}>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Shipping & Returns</a></li>
                        <li><a href="#">Size Guide</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4>Stay Updated</h4>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
                        Subscribe to our newsletter for exclusive offers.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            style={{
                                flex: 1,
                                minWidth: '0',
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                outline: 'none',
                                fontFamily: 'inherit',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text-main)'
                            }}
                        />
                        <button style={{
                            backgroundColor: 'var(--color-accent)',
                            color: '#ffffff',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div style={{
                borderTop: '1px solid var(--color-border)',
                marginTop: 'var(--spacing-2xl)',
                paddingTop: 'var(--spacing-lg)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem'
            }}>
                © {new Date().getFullYear()} Antigravity Layouts. All rights reserved.
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <a href="#" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-main)',
        border: '1px solid var(--color-border)',
        transition: 'var(--transition-fast)'
    }}>
        {icon}
    </a>
);

export default Footer;
