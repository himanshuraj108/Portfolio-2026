'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blog').then(r => r.json()).then(d => { setPosts(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '6rem', minHeight: '80vh' }}>
                <section className="section-padding">
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>

                        {/* Header */}
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Thoughts & Insights</p>
                            <h1 className="heading-xl">The <span className="gradient-text">Blog</span></h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: 520, margin: '1rem auto 0', lineHeight: 1.7 }}>
                                Articles on web development, open-source, problem solving, and tech.
                            </p>
                        </motion.div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                                <Loader2 size={32} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="card-base" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No posts yet</p>
                                <p style={{ fontSize: '0.875rem' }}>Check back soon for new articles!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {posts.map((post, i) => (
                                    <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                                        <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                                            <motion.div whileHover={{ y: -4 }} className="card-base" style={{ overflow: 'hidden', height: '100%' }}>
                                                {post.coverImage && (
                                                    <div style={{ height: 180, overflow: 'hidden' }}>
                                                        <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                                                    </div>
                                                )}
                                                <div style={{ padding: '1.5rem' }}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.875rem' }}>
                                                        {(post.tags || []).slice(0, 3).map(tag => (
                                                            <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.55rem', background: 'var(--accent-glow-cyan)', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                                                                <Tag size={9} />{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>{post.title}</h2>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                                            <Calendar size={12} />
                                                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <motion.span whileHover={{ x: 3 }} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600 }}>
                                                            Read <ArrowRight size={13} />
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
            <BackToTop />
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </>
    );
}
