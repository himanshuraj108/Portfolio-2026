'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';

export default function Education() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('/api/education').then((r) => r.json()).then(setItems).catch(() => { });
    }, []);

    return (
        <section id="education" className="section-padding">
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Academic Background</p>
                    <h2 className="heading-lg">My <span className="gradient-text">Education</span></h2>
                </motion.div>

                {/* Timeline */}
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '2rem', top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, var(--accent-cyan), var(--accent-violet))', borderRadius: 999 }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingLeft: '5rem' }}>
                        {items.map((edu, i) => (
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                style={{ position: 'relative' }}
                            >
                                {/* Timeline dot */}
                                <div style={{
                                    position: 'absolute', left: '-3.25rem', top: '1.25rem',
                                    width: 14, height: 14, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                    boxShadow: '0 0 16px var(--accent-glow-cyan)',
                                }} />

                                <div className="card-base" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.625rem' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{edu.institution}</h3>
                                        <span style={{ padding: '0.25rem 0.625rem', borderRadius: '999px', background: 'var(--accent-glow-violet)', border: '1px solid rgba(167,139,250,0.2)', fontSize: '0.75rem', color: 'var(--accent-violet)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                            {edu.scoreType}: {edu.score}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.625rem' }}>
                                        <GraduationCap size={15} />
                                        {edu.degree} {edu.field && `— ${edu.field}`}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}><Calendar size={12} />{edu.startYear} – {edu.endYear}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}><MapPin size={12} />{edu.location}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
