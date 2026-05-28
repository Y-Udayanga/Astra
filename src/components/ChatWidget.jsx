import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! How can we help you today?', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInputValue('');

        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Thanks for reaching out! One of our style experts will be with you shortly.",
                sender: 'bot'
            }]);
        }, 1000);
    };

    return (
        <>
            <div style={{ position: 'fixed', bottom: 'var(--spacing-lg)', right: 'var(--spacing-lg)', zIndex: 100 }}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            style={{
                                position: 'absolute',
                                bottom: '80px',
                                right: '0',
                                width: 'min(350px, calc(100vw - 40px))',
                                height: 'min(500px, calc(100vh - 140px))',
                                backgroundColor: 'var(--color-surface)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-premium)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: 'var(--spacing-md)',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>Support</h4>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>We reply immediately</span>
                                </div>
                                <button onClick={toggleChat} style={{ color: 'white' }}><X size={20} /></button>
                            </div>

                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                padding: 'var(--spacing-md)',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--spacing-md)'
                            }}>
                                {messages.map((msg) => (
                                    <div key={msg.id} style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        backgroundColor: msg.sender === 'user' ? 'var(--color-accent)' : 'var(--color-background)',
                                        color: msg.sender === 'user' ? 'white' : 'var(--color-text-main)',
                                        padding: 'var(--spacing-sm) var(--spacing-md)',
                                        borderRadius: 'var(--radius-md)',
                                        maxWidth: '80%',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} style={{
                                padding: 'var(--spacing-md)',
                                borderTop: '1px solid var(--color-border)',
                                display: 'flex',
                                gap: 'var(--spacing-sm)'
                            }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    style={{
                                        flex: 1,
                                        padding: 'var(--spacing-sm)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        outline: 'none'
                                    }}
                                />
                                <button type="submit" style={{
                                    padding: 'var(--spacing-sm)',
                                    backgroundColor: 'var(--color-accent)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={toggleChat}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <MessageCircle size={30} />
                </motion.button>
            </div>
        </>
    );
};

export default ChatWidget;
