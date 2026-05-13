import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: 'var(--spacing-3xl) var(--spacing-xl)', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}
        >
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-family-display)', marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>Contact Us</h1>
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-3xl)', fontSize: '1.2rem' }}>
                We'd love to hear from you. Get in touch!
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-3xl)' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Get in Touch</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={20} color="var(--color-accent)" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>Email</h4>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>support@astra.com</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Phone size={20} color="var(--color-accent)" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>Phone</h4>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>+1 (555) 123-4567</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={20} color="var(--color-accent)" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>Location</h4>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>123 Fashion Ave, NY 10001</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }} onSubmit={(e) => e.preventDefault()}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <input type="text" placeholder="First Name" style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                            <input type="text" placeholder="Last Name" style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                        </div>
                        <input type="email" placeholder="Email Address" style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                        <textarea placeholder="Message" rows="5" style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', resize: 'vertical' }}></textarea>
                        <button type="submit" style={{ padding: '14px', backgroundColor: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>Send Message</button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default Contact;
