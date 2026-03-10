'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title: '', slug: '', content: '', coverImage: '', tags: '', published: false };

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function AdminBlogPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const load = () => { setLoading(true); fetch('/api/blog').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false)); };
    useEffect(load, []);

    const openNew = () => { setForm(EMPTY); setModal('new'); };
    const openEdit = (item) => { setForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags }); setModal(item); };

    const save = async () => {
        setSaving(true);
        const isNew = modal === 'new';
        const body = { ...form, tags: form.tags.split(',').map(s => s.trim()).filter(Boolean), slug: form.slug || slugify(form.title) };
        const res = await fetch(isNew ? '/api/blog' : `/api/blog/${modal.id}`, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        setSaving(false);
        if (res.ok) { toast.success('Saved!'); setModal(null); load(); } else toast.error('Failed.');
    };

    const del = async (id) => {
        if (!confirm('Delete post?')) return;
        if ((await fetch(`/api/blog/${id}`, { method: 'DELETE' })).ok) { toast.success('Deleted!'); load(); }
    };

    const togglePublish = async (item) => {
        const res = await fetch(`/api/blog/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, published: !item.published }) });
        if (res.ok) { toast.success(item.published ? 'Unpublished' : 'Published!'); load(); }
    };

    return (
        <div style={{ padding: '2rem 2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</p>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Blog Posts</h1>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} onClick={openNew}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                    <Plus size={16} /> New Post
                </motion.button>
            </div>

            {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={28} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} /></div>
                : items.length === 0 ? <div className="card-base" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No posts yet. Write your first!</div>
                    : <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {items.map(item => (
                            <div key={item.id} className="card-base" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                                        <span style={{ padding: '0.15rem 0.5rem', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 600, background: item.published ? 'rgba(34,197,94,0.12)' : 'rgba(148,163,184,0.12)', color: item.published ? '#22c55e' : 'var(--text-muted)' }}>
                                            {item.published ? 'Published' : 'Draft'}
                                        </span>
                                        <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</p>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>/{item.slug} · {new Date(item.createdAt).toLocaleDateString()} · {item.views} views</p>
                                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                                        {(Array.isArray(item.tags) ? item.tags : []).map(t => <span key={t} style={{ padding: '0.1rem 0.4rem', background: 'var(--accent-glow-cyan)', borderRadius: '4px', fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>{t}</span>)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button onClick={() => togglePublish(item)} title={item.published ? 'Unpublish' : 'Publish'}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: item.published ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.1)', border: `1px solid ${item.published ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.25)'}`, color: item.published ? '#ef4444' : '#22c55e', fontSize: '0.78rem', cursor: 'pointer' }}>
                                        {item.published ? <EyeOff size={12} /> : <Eye size={12} />}{item.published ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button onClick={() => openEdit(item)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer' }}><Pencil size={12} />Edit</button>
                                    <button onClick={() => del(item.id)} style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 0.6rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>}

            <AnimatePresence>
                {modal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
                            className="card-base" style={{ width: '100%', maxWidth: 560, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{modal === 'new' ? 'New Post' : 'Edit Post'}</h2>
                                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[['title', 'Title *'], ['slug', 'Slug (auto-generated if empty)'], ['coverImage', 'Cover Image URL'], ['tags', 'Tags (comma separated)']].map(([key, label]) => (
                                    <div key={key}>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</label>
                                        <input value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="form-input" />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Content * (Markdown)</label>
                                    <textarea value={form.content || ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={8} className="form-input" style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }} />
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <input type="checkbox" checked={form.published || false} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} /> Publish immediately
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button onClick={() => setModal(null)} style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button onClick={save} disabled={saving} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                    {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Saving…</> : 'Save Post'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
