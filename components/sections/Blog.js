'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blog').then((r) => r.json()).then((d) => { setPosts(d); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (!loading && posts.length === 0) return null;

    return (
        <section id="blog" className="section-padding">
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Thoughts & Insights</p>
                    <h2 className="heading-lg">Latest <span className="gradient-text">Blog Posts</span></h2>
                </motion.div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 260 }} />)}
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            {posts.slice(0, 3).map((post, i) => (
                                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                                    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                                        <motion.div whileHover={{ y: -4 }} className="card-base" style={{ overflow: 'hidden' }}>
                                            {post.coverImage && (
                                                <div style={{ height: 160, overflow: 'hidden' }}>
                                                    <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                                                </div>
                                            )}
                                            <div style={{ padding: '1.25rem' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                                    {post.tags.slice(0, 3).map((tag) => (
                                                        <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', background: 'var(--accent-glow-cyan)', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                                                            <Tag size={9} />{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>{post.title}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                    <Calendar size={11} />
                                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        {posts.length > 3 && (
                            <div style={{ textAlign: 'center' }}>
                                <Link href="/blog"><motion.span whileHover={{ x: 4 }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem' }}>View All Posts <ArrowRight size={16} /></motion.span></Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
