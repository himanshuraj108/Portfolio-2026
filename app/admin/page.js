'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FolderKanban, Award, FileText, MessageSquare,
    Users, GitFork, Wrench, GraduationCap, Trophy,
    TrendingUp, Eye
} from 'lucide-react';
import Link from 'next/link';

const STAT_CARDS = [
    { label: 'Projects', icon: FolderKanban, href: '/admin/projects', api: '/api/projects', color: 'var(--accent-cyan)' },
    { label: 'Skills', icon: Wrench, href: '/admin/skills', api: '/api/skills', color: '#a78bfa' },
    { label: 'Certificates', icon: Award, href: '/admin/certificates', api: '/api/certificates', color: '#f59e0b' },
    { label: 'Education', icon: GraduationCap, href: '/admin/education', api: '/api/education', color: '#22c55e' },
    { label: 'Achievements', icon: Trophy, href: '/admin/achievements', api: '/api/achievements', color: '#f97316' },
    { label: 'Blog Posts', icon: FileText, href: '/admin/blog', api: '/api/blog', color: '#06b6d4' },
    { label: 'Messages', icon: MessageSquare, href: '/admin/messages', api: '/api/messages', color: '#ec4899' },
    { label: 'Testimonials', icon: Users, href: '/admin/testimonials', api: '/api/testimonials', color: '#8b5cf6' },
    { label: 'Open Source', icon: GitFork, href: '/admin/opensource', api: '/api/opensource', color: '#10b981' },
];

const QUICK_LINKS = [
    { label: 'Add Project', href: '/admin/projects?new=1', icon: FolderKanban },
    { label: 'New Blog Post', href: '/admin/blog?new=1', icon: FileText },
    { label: 'Read Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Site Settings', href: '/admin/settings', icon: TrendingUp },
    { label: 'View Portfolio', href: '/', icon: Eye, external: true },
];

function StatCard({ label, icon: Icon, href, api, color }) {
    const [count, setCount] = useState(null);

    useEffect(() => {
        fetch(api)
            .then((r) => r.ok ? r.json() : [])
            .then((d) => setCount(Array.isArray(d) ? d.length : '-'))
            .catch(() => setCount('-'));
    }, [api]);

    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <motion.div
                whileHover={{ y: -4 }}
                className="card-base"
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
            >
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} style={{ color }} />
                </div>
                <div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {count === null ? <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>…</span> : count}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{label}</p>
                </div>
            </motion.div>
        </Link>
    );
}

export default function AdminDashboard() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div style={{ padding: '2rem 2.5rem', maxWidth: 1100 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dashboard</p>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {greeting}, Himanshu 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Content Overview</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                    {STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)}
                </div>
            </motion.div>

            {/* Quick links */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Quick Actions</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {QUICK_LINKS.map(({ label, href, icon: Icon, external }) => (
                        <Link key={label} href={href} target={external ? '_blank' : undefined} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.6rem 1.1rem', borderRadius: '10px',
                                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500,
                                    cursor: 'pointer', transition: 'border-color 0.2s',
                                }}
                                onHoverStart={(e) => e.target.style && (e.target.style.borderColor = 'var(--accent-cyan)')}
                            >
                                <Icon size={15} style={{ color: 'var(--accent-cyan)' }} />
                                {label}
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
