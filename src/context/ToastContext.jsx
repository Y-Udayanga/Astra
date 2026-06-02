/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const variants = {
    success: { icon: CheckCircle, color: 'var(--color-success)', bg: 'rgba(16,185,129,0.12)' },
    error: { icon: XCircle, color: 'var(--color-error)', bg: 'rgba(239,68,68,0.12)' },
    info: { icon: Info, color: 'var(--color-info)', bg: 'rgba(59,130,246,0.12)' },
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((type, message, duration = 3200) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, type, message }]);
        if (duration) setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    const toast = {
        success: (m, d) => push('success', m, d),
        error: (m, d) => push('error', m, d),
        info: (m, d) => push('info', m, d),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 'min(380px, calc(100vw - 40px))', pointerEvents: 'none' }}>
                <AnimatePresence>
                    {toasts.map((t) => {
                        const v = variants[t.type] || variants.info;
                        const Icon = v.icon;
                        return (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                                style={{
                                    pointerEvents: 'auto', display: 'flex', alignItems: 'flex-start', gap: '12px',
                                    padding: '14px 16px', borderRadius: '14px', backgroundColor: 'var(--color-elevated)',
                                    border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-premium)',
                                }}
                            >
                                <span style={{ width: '32px', height: '32px', borderRadius: '9px', backgroundColor: v.bg, color: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={19} />
                                </span>
                                <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 500, lineHeight: 1.45, paddingTop: '5px' }}>{t.message}</div>
                                <button onClick={() => dismiss(t.id)} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px', flexShrink: 0 }}>
                                    <X size={16} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
