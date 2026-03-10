'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star } from 'lucide-react';

export default function OpenSource() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('/api/opensource').then((r) => r.json()).then(setItems).catch(() => { });
    }, []);

    const formatUrl = (url) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;

    if (items.length === 0) return null;

    return (
        <section id="opensource" className="section-padding">
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Community</p>
                    <h2 className="heading-lg">Open <span className="gradient-text">Source</span></h2>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {items.map((repo, i) => (
                        <motion.a key={repo.id} href={formatUrl(repo.githubUrl)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                            <motion.div whileHover={{ y: -4 }} className="card-base" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Github size={16} style={{ color: 'var(--text-secondary)' }} />
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{repo.repoName}</span>
                                    </div>
                                    {repo.stars > 0 && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>
                                            <Star size={12} fill="currentColor" />{repo.stars}
                                        </span>
                                    )}
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{repo.description}</p>
                                {repo.language && (
                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'var(--bg-tertiary)', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{repo.language}</span>
                                )}
                            </motion.div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
