'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, MapPin, Send, Github, Linkedin,
    Twitter, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const INIT = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
    const [form, setForm] = useState(INIT);
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(d => setSettings(d)).catch(() => { });
    }, []);

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send');
            setStatus('success');
            setForm(INIT);
            toast.success('Message sent! I\'ll get back to you soon.');
        } catch (err) {
            setStatus('error');
            toast.error(err.message || 'Something went wrong. Please try again.');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section id="contact" className="section-padding">
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '3.5rem' }}
                >
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        Let's Connect
                    </p>
                    <h2 className="heading-lg">
                        Get In <span className="gradient-text">Touch</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: 540, margin: '1rem auto 0', lineHeight: 1.7, fontSize: '1rem' }}>
                        Have a project in mind, a question, or just want to say hi? My inbox is always open.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)', gap: '2.5rem', alignItems: 'start' }}>

                    {/* ── Left: Info + Socials ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {settings ? (
                            <>
                                {/* Availability badge */}
                                {settings.availability && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '999px', marginBottom: '2rem' }}>
                                        <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                                        <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>Available for opportunities</span>
                                    </div>
                                )}

                                {/* Contact info items */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                    {[
                                        settings.email && { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
                                        settings.phone && { icon: Phone, label: 'Phone', value: settings.phone, href: null },
                                        settings.location && { icon: MapPin, label: 'Location', value: settings.location, href: null },
                                    ].filter(Boolean).map(({ icon: Icon, label, value, href }) => (
                                        <motion.div
                                            key={label}
                                            whileHover={{ x: 4 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                                        >
                                            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--accent-glow-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Icon size={18} style={{ color: 'var(--accent-cyan)' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.1rem' }}>{label}</p>
                                                {href ? (
                                                    <a href={href} style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>{value}</a>
                                                ) : (
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div style={{ height: 1, background: 'var(--border)', marginBottom: '2rem' }} />

                                {/* Social links */}
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Find me on</p>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {[
                                        settings.githubUrl && { icon: Github, label: 'GitHub', href: settings.githubUrl, color: 'var(--text-primary)' },
                                        settings.linkedinUrl && { icon: Linkedin, label: 'LinkedIn', href: settings.linkedinUrl, color: '#0a66c2' },
                                        settings.twitterUrl && { icon: Twitter, label: 'Twitter', href: settings.twitterUrl, color: '#1d9bf0' },
                                        settings.email && { icon: Mail, label: 'Email', href: `mailto:${settings.email}`, color: 'var(--accent-cyan)' },
                                    ].filter(Boolean).map(({ icon: Icon, label, href, color }) => (
                                        <motion.a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={label}
                                            whileHover={{ y: -4, scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                width: 44, height: 44, borderRadius: '12px',
                                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: color, textDecoration: 'none', transition: 'border-color 0.2s',
                                            }}
                                        >
                                            <Icon size={18} />
                                        </motion.a>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                                <Loader2 size={24} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />
                            </div>
                        )}
                    </motion.div>

                    {/* ── Right: Form ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="card-base"
                        style={{ padding: '2rem' }}
                    >
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ textAlign: 'center', padding: '3rem 1rem' }}
                                >
                                    <CheckCircle size={56} style={{ color: '#22c55e', margin: '0 auto 1.25rem' }} />
                                    <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Message Received!</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Thanks for reaching out. I&apos;ll get back to you as soon as possible.</p>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setStatus('idle')}
                                        style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', background: 'var(--accent-glow-cyan)', color: 'var(--accent-cyan)', border: '1px solid rgba(34,211,238,0.3)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                                    >
                                        Send Another
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                >
                                    {/* Name + Email row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                Name <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Your name"
                                                required
                                                className="form-input"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                Email <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="your@email.com"
                                                required
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="What's this about?"
                                            className="form-input"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            Message <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Tell me about your project or just say hi..."
                                            rows={5}
                                            required
                                            className="form-input"
                                            style={{ resize: 'vertical', minHeight: 120 }}
                                        />
                                    </div>

                                    {/* Error banner */}
                                    {status === 'error' && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', color: '#ef4444', fontSize: '0.85rem' }}>
                                            <AlertCircle size={16} /> Something went wrong. Please try again.
                                        </motion.div>
                                    )}

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                                        whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                                            padding: '0.9rem 2rem', borderRadius: '12px',
                                            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                                            border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                            opacity: status === 'loading' ? 0.8 : 1,
                                            transition: 'opacity 0.2s',
                                        }}
                                    >
                                        {status === 'loading' ? (
                                            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                                        ) : (
                                            <><Send size={18} /> Send Message</>
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Spin keyframe (inline, avoids extra CSS) */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </section>
    );
}
