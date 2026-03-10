'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 300);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 80);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="loading-screen"
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{ background: 'var(--bg-primary)', zIndex: 99999, position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem' }}
                >
                    {/* Animated HR Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{
                            width: 80, height: 80,
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem', fontWeight: 800, color: 'white',
                            fontFamily: 'var(--font-heading)',
                            boxShadow: '0 0 40px var(--accent-glow-cyan)',
                        }}
                    >
                        HR
                    </motion.div>

                    {/* Name */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        style={{ textAlign: 'center' }}
                    >
                        <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>
                            Himanshu Raj
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Full-Stack Developer</p>
                    </motion.div>

                    {/* Progress bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ width: 200, height: 3, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}
                    >
                        <motion.div
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))',
                                borderRadius: 999,
                                width: `${Math.min(progress, 100)}%`,
                                transition: 'width 0.1s ease',
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
