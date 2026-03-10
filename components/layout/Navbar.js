'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, ExternalLink } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Certificates', href: '/certificates' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cvUrl, setCvUrl] = useState('/resume.pdf');
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleCvDownload = () => {
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'cv_download', page: pathname }),
        });
        if (cvUrl) window.open(cvUrl, '_blank');
    };

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                    transition: 'all 0.3s ease',
                    background: scrolled ? 'var(--navbar-bg)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
                }}
            >
                <nav style={{
                    maxWidth: 1280, margin: '0 auto',
                    padding: '0 1.5rem',
                    height: 68,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 42, height: 42, borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem', fontWeight: 800, color: 'white',
                                fontFamily: 'var(--font-heading)',
                                boxShadow: '0 4px 16px var(--accent-glow-violet)',
                            }}
                        >
                            HR
                        </motion.div>
                    </Link>

                    {/* Desktop links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                    <motion.span
                                        whileHover={{ y: -1 }}
                                        style={{
                                            padding: '0.5rem 0.875rem',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                            background: isActive ? 'var(--accent-glow-cyan)' : 'transparent',
                                            display: 'block',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {link.label}
                                    </motion.span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleCvDownload}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.5rem 1.1rem',
                                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                border: 'none', borderRadius: '10px',
                                color: 'white', fontSize: '0.875rem', fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px var(--accent-glow-violet)',
                            }}
                            className="cv-btn"
                        >
                            <Download size={15} />
                            CV
                        </motion.button>

                        {/* Mobile menu button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{
                                display: 'none',
                                width: 40, height: 40, borderRadius: '10px',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border)',
                                alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--text-primary)',
                            }}
                            className="mobile-menu-btn"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 999,
                            background: 'var(--bg-primary)',
                            display: 'flex', flexDirection: 'column',
                            padding: '5rem 2rem 2rem',
                        }}
                    >
                        {NAV_LINKS.map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06, duration: 0.3 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div style={{
                                        padding: '1rem 0',
                                        borderBottom: '1px solid var(--border)',
                                        fontSize: '1.5rem', fontWeight: 700,
                                        color: pathname === link.href ? 'var(--accent-cyan)' : 'var(--text-primary)',
                                        fontFamily: 'var(--font-heading)',
                                    }}>
                                        {link.label}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onClick={() => { handleCvDownload(); setMobileOpen(false); }}
                            style={{
                                marginTop: '2rem', padding: '1rem',
                                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                border: 'none', borderRadius: '14px',
                                color: 'white', fontSize: '1rem', fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            }}
                        >
                            <Download size={18} />
                            Download CV
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .cv-btn { display: none !important; }
        }
      `}</style>
        </>
    );
}
