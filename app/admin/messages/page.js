'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Mail, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => { setLoading(true); fetch('/api/messages').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false)); };
    useEffect(load, []);

    const markRead = async (id, read) => {
        const res = await fetch('/api/messages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, read }) });
        if (res.ok) { toast.success(read ? 'Marked as read' : 'Marked unread'); load(); }
    };

    const del = async (id) => {
        if (!confirm('Delete message?')) return;
        const res = await fetch('/api/messages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        if (res.ok) { toast.success('Deleted!'); load(); }
    };

    const unread = items.filter(m => !m.read).length;

    return (
        <div style={{ padding: '2rem 2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</p>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Messages {unread > 0 && <span style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem', background: 'rgba(34,211,238,0.12)', borderRadius: '6px', color: 'var(--accent-cyan)', marginLeft: '0.5rem' }}>{unread} new</span>}
                </h1>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={28} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} /></div>
            ) : items.length === 0 ? (
                <div className="card-base" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No messages yet.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {items.map(msg => (
                        <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-base"
                            style={{ padding: '1.5rem', borderLeft: msg.read ? '3px solid var(--border)' : '3px solid var(--accent-cyan)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{msg.name}</span>
                                        <a href={`mailto:${msg.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', textDecoration: 'none' }}><Mail size={12} />{msg.email}</a>
                                        {!msg.read && <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(34,211,238,0.12)', borderRadius: '5px', fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>NEW</span>}
                                    </div>
                                    {msg.subject && <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Subject: {msg.subject}</p>}
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{msg.message}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>{new Date(msg.createdAt).toLocaleString('en-IN')}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button onClick={() => markRead(msg.id, !msg.read)} title={msg.read ? 'Mark unread' : 'Mark read'}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: msg.read ? 'var(--bg-tertiary)' : 'rgba(34,211,238,0.1)', border: `1px solid ${msg.read ? 'var(--border)' : 'rgba(34,211,238,0.3)'}`, color: msg.read ? 'var(--text-muted)' : 'var(--accent-cyan)', fontSize: '0.78rem', cursor: 'pointer' }}>
                                        <Check size={13} />{msg.read ? 'Unread' : 'Read'}
                                    </button>
                                    <button onClick={() => del(msg.id)}
                                        style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 0.6rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </div>
    );
}
