'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';
import { SiLeetcode, SiHackerrank, SiDevdotto } from 'react-icons/si';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Certificates', href: '/certificates' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

const SOCIAL_LINKS = [
    { icon: Github, href: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/himanshuraj108', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/himanshuraj108', label: 'LinkedIn' },
    { icon: SiLeetcode, href: 'https://leetcode.com/himanshuraj', label: 'LeetCode' },
    { icon: SiHackerrank, href: 'https://hackerrank.com/himanshuraj', label: 'HackerRank' },
    { icon: Twitter, href: 'https://twitter.com/himanshuraj', label: 'Twitter' },
    { icon: SiDevdotto, href: 'https://dev.to/himanshuraj', label: 'Dev.to' },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
            padding: '3rem 0 1.5rem',
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                {/* Top row */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '2.5rem', marginBottom: '2.5rem',
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{
                            width: 42, height: 42, borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, color: 'white', fontSize: '1rem',
                            marginBottom: '1rem',
                        }}>HR</div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 220 }}>
                            Full-Stack Developer building impactful digital experiences.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <MapPin size={13} />
                            Punjab, India
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.875rem' }}>Navigation</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {NAV_LINKS.map((link) => (
                                <Link key={link.href} href={link.href} style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                                >{link.label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.875rem' }}>Connect</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    title={label}
                                    style={{
                                        width: 36, height: 36, borderRadius: '9px',
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-secondary)', transition: 'color 0.2s',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <Icon size={16} />
                                </motion.a>
                            ))}
                        </div>
                        <a href="mailto:himanshuraj97653@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>
                            <Mail size={13} />
                            himanshuraj97653@gmail.com
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--border)', marginBottom: '1.25rem' }} />

                {/* Bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        Made with <Heart size={12} style={{ color: 'var(--accent-violet)', fill: 'currentColor' }} /> by Himanshu Raj &ndash; &copy; {year}
                    </p>
                    {/* Admin login link */}
                    <Link href="/admin/login" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none', opacity: 0.6, transition: 'opacity 0.2s, color 0.2s' }}
                        onMouseEnter={(e) => { e.target.style.opacity = '1'; e.target.style.color = 'var(--accent-cyan)'; }}
                        onMouseLeave={(e) => { e.target.style.opacity = '0.6'; e.target.style.color = 'var(--text-muted)'; }}
                    >
                        🔒 Admin Login
                    </Link>
                </div>
            </div>
        </footer>
    );
}
