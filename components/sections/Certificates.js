'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Building2, Award } from 'lucide-react';

export default function Certificates() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/certificates')
            .then((r) => r.json())
            .then((d) => { setCerts(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const formatUrl = (url) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;

    return (
        <section id="certificates" className="section-padding">
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Credentials</p>
                    <h2 className="heading-lg">Certificates &amp; <span className="gradient-text">Courses</span></h2>
                </motion.div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 340 }} />)}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {certs.map((cert, i) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                className="card-base"
                                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                            >
                                {/* Website Preview via verifyUrl iframe */}
                                <div
                                    onClick={() => {
                                        const url = cert.verifyUrl || cert.imageUrl;
                                        if (url) window.open(formatUrl(url), '_blank', 'noopener,noreferrer');
                                    }}
                                    style={{
                                        height: 180,
                                        background: 'var(--bg-tertiary)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: (cert.verifyUrl || cert.imageUrl) ? 'pointer' : 'default',
                                    }}
                                >
                                    {cert.verifyUrl ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#fff' }}>
                                            <iframe
                                                src={formatUrl(cert.verifyUrl)}
                                                title={`${cert.title} verification`}
                                                loading="lazy"
                                                style={{
                                                    width: '200%',
                                                    height: '200%',
                                                    transform: 'scale(0.5)',
                                                    transformOrigin: 'top left',
                                                    border: 'none',
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                            {/* Overlay to capture click + show verify badge */}
                                            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
                                            <div style={{
                                                position: 'absolute', bottom: 10, right: 10, zIndex: 2,
                                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                                padding: '0.25rem 0.6rem', borderRadius: '999px',
                                                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                                fontSize: '0.68rem', fontWeight: 700, color: 'white',
                                            }}>
                                                <ExternalLink size={10} /> Verify
                                            </div>
                                        </div>
                                    ) : cert.imageUrl ? (
                                        <img src={formatUrl(cert.imageUrl)} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'linear-gradient(135deg, var(--accent-glow-cyan), var(--accent-glow-violet))',
                                            fontSize: '2.5rem', fontWeight: 800,
                                            color: 'var(--accent-violet)', fontFamily: 'var(--font-heading)',
                                        }}>
                                            <Award size={48} strokeWidth={1.5} style={{ color: 'var(--accent-violet)', opacity: 0.6 }} />
                                        </div>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '0.75rem' }}>
                                        <div style={{
                                            width: 38, height: 38, borderRadius: '8px',
                                            background: 'var(--accent-glow-violet)',
                                            border: '1px solid rgba(167,139,250,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            {cert.orgLogo
                                                ? <img src={cert.orgLogo} alt={cert.organization} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                                                : <Building2 size={18} style={{ color: 'var(--accent-violet)' }} />
                                            }
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.15rem', lineHeight: 1.3 }}>{cert.title}</h3>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--accent-violet)', fontWeight: 600 }}>{cert.organization}</p>
                                        </div>
                                    </div>

                                    {cert.description && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
                                            {cert.description.length > 100 ? cert.description.substring(0, 100) + '…' : cert.description}
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                            <Calendar size={12} />{cert.date}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            {cert.verifyUrl && (
                                                <a
                                                    href={formatUrl(cert.verifyUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                >
                                                    <ExternalLink size={11} /> Verify
                                                </a>
                                            )}
                                            {cert.imageUrl && (
                                                <a
                                                    href={formatUrl(cert.imageUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                >
                                                    View
                                                </a>
                                            )}
                                        </div>
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
