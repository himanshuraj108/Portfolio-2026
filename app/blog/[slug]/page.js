'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/blog/${slug}`)
            .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return; } return r.json(); })
            .then(d => { if (d) { setPost(d); setLoading(false); } })
            .catch(() => { setNotFound(true); setLoading(false); });
    }, [slug]);

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '6rem', minHeight: '80vh' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem' }}>
                        <Loader2 size={32} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : notFound ? (
                    <div style={{ maxWidth: 640, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Post Not Found</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This post doesn&apos;t exist or has been removed.</p>
                        <Link href="/blog" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>← Back to Blog</Link>
                    </div>
                ) : post ? (
                    <article style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
                        {/* Back link */}
                        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '2rem' }}>
                            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                <ArrowLeft size={15} /> Back to Blog
                            </Link>
                        </motion.div>

                        {/* Cover image */}
                        {post.coverImage && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '2.5rem', maxHeight: 380 }}>
                                <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>
                        )}

                        {/* Tags */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                            {(post.tags || []).map(tag => (
                                <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', background: 'var(--accent-glow-cyan)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                                    <Tag size={10} />{tag}
                                </span>
                            ))}
                        </motion.div>

                        {/* Title */}
                        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            {post.title}
                        </motion.h1>

                        {/* Meta */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Calendar size={13} />
                                {new Date(post.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            {post.views > 0 && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Eye size={13} />{post.views} views
                                </span>
                            )}
                        </motion.div>

                        {/* Content (rendered as preformatted markdown — improve with react-markdown if needed) */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1rem', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)' }}>
                            {post.content}
                        </motion.div>
                    </article>
                ) : null}
            </main>
            <Footer />
            <BackToTop />
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </>
    );
}
