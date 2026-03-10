'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
    Languages: 'var(--accent-cyan)',
    Frontend: '#f59e0b',
    Backend: '#10b981',
    Database: '#ec4899',
    Tools: '#8b5cf6',
    'Core CS': '#06b6d4',
    'Soft Skills': '#f97316',
};

export default function Skills() {
    const [skills, setSkills] = useState([]);
    const [active, setActive] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/skills').then((r) => r.json()).then((data) => {
            setSkills(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const categories = ['All', ...new Set(skills.map((s) => s.category))];
    const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active);

    return (
        <section id="skills" className="section-padding">
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What I Know</p>
                    <h2 className="heading-lg">Technical <span className="gradient-text">Skills</span></h2>
                </motion.div>

                {/* Filter tabs */}
                <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            style={{
                                padding: '0.4rem 1rem',
                                borderRadius: '999px', border: 'none', cursor: 'pointer',
                                fontSize: '0.85rem', fontWeight: 500,
                                background: active === cat
                                    ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))'
                                    : 'var(--bg-tertiary)',
                                color: active === cat ? 'white' : 'var(--text-secondary)',
                                transition: 'all 0.2s',
                                fontFamily: 'var(--font-body)',
                            }}
                        >{cat}</button>
                    ))}
                </motion.div>

                {/* Skills grid */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 80 }} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}
                    >
                        {filtered.map((skill, i) => (
                            <motion.div
                                key={skill.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -4 }}
                                transition={{ duration: 0.3, delay: i * 0.03 }}
                                className="card-base"
                                style={{
                                    padding: '1.25rem 0.875rem',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                    textAlign: 'center', cursor: 'default',
                                }}
                            >
                                {/* Category color indicator */}
                                <div style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: CATEGORY_COLORS[skill.category] || 'var(--accent-cyan)',
                                    boxShadow: `0 0 8px ${CATEGORY_COLORS[skill.category] || 'var(--accent-cyan)'}`,
                                }} />
                                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{skill.name}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{skill.category}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
