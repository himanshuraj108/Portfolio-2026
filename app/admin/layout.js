'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, FolderKanban, Wrench, GraduationCap,
    Award, FileText, MessageSquare, Users, GitFork,
    Settings, LogOut, ExternalLink, Loader2, Trophy
} from 'lucide-react';

const NAV = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Skills', href: '/admin/skills', icon: Wrench },
    { label: 'Education', href: '/admin/education', icon: GraduationCap },
    { label: 'Certificates', href: '/admin/certificates', icon: Award },
    { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
    { label: 'Blog', href: '/admin/blog', icon: FileText },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Users },
    { label: 'Open Source', href: '/admin/opensource', icon: GitFork },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/admin/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <Loader2 size={32} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (status === 'unauthenticated') return null;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
            {/* ── Sidebar ── */}
            <aside className="admin-sidebar" style={{
                width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column',
                position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
            }}>
                {/* Brand */}
                <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, color: 'white', fontSize: '0.85rem', flexShrink: 0,
                        }}>HR</div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>Admin Panel</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '0.75rem 0.75rem' }}>
                    {NAV.map(({ label, href, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link key={href} href={href} style={{ textDecoration: 'none', display: 'block', marginBottom: '0.2rem' }}>
                                <motion.div
                                    whileHover={{ x: 3 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                                        padding: '0.6rem 0.875rem', borderRadius: '10px',
                                        background: active ? 'var(--accent-glow-cyan)' : 'transparent',
                                        color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                        fontWeight: active ? 600 : 400,
                                        fontSize: '0.85rem',
                                        transition: 'background 0.15s, color 0.15s',
                                        borderLeft: active ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                                    }}
                                >
                                    <Icon size={16} />
                                    {label}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer actions */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <ExternalLink size={14} /> View Site
                    </a>
                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
                {children}
            </main>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
