'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Building2 } from 'lucide-react';

export default function Certificates() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/certificates').then((r) => r.json()).then((d) => { setCerts(d); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <section id="certificates" className="section-padding">
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Credentials</p>
                    <h2 className="heading-lg">Certificates & <span className="gradient-text">Courses</span></h2>
                </motion.div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 180 }} />)}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {certs.map((cert, i) => (
                            <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="card-base" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'var(--accent-glow-violet)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {cert.orgLogo ? <img src={cert.orgLogo} alt={cert.organization} style={{ width: 28, height: 28, objectFit: 'contain' }} /> : <Building2 size={20} style={{ color: 'var(--accent-violet)' }} />}
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{cert.title}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--accent-violet)', fontWeight: 600 }}>{cert.organization}</p>
                                    </div>
                                </div>
                                {cert.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1rem' }}>{cert.description}</p>}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}><Calendar size={12} />{cert.date}</span>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {cert.verifyUrl && <a href={cert.verifyUrl} target="_self" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ExternalLink size={11} />Verify</a>}
                                        {cert.imageUrl && <a href={cert.imageUrl} target="_self" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>View</a>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
