'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { repoName: '', description: '', githubUrl: '', stars: 0, language: '' };

export default function AdminOpenSourcePage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const load = () => { setLoading(true); fetch('/api/opensource').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false)); };
    useEffect(load, []);

    const save = async () => {
        setSaving(true);
        const isNew = modal === 'new';
        const res = await fetch(isNew ? '/api/opensource' : `/api/opensource/${modal.id}`, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, stars: Number(form.stars) || 0 }) });
        setSaving(false);
        if (res.ok) { toast.success('Saved!'); setModal(null); load(); } else toast.error('Failed.');
    };

    const del = async (id) => {
        if (!confirm('Delete?')) return;
        if ((await fetch(`/api/opensource/${id}`, { method: 'DELETE' })).ok) { toast.success('Deleted!'); load(); }
    };

    return (
        <div style={{ padding: '2rem 2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</p>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Open Source</h1>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} onClick={() => { setForm(EMPTY); setModal('new'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                    <Plus size={16} /> Add Repo
                </motion.button>
            </div>

            {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={28} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} /></div>
                : items.length === 0 ? <div className="card-base" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No repos yet.</div>
                    : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {items.map(item => (
                            <div key={item.id} className="card-base" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.repoName}</p>
                                    {item.stars > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.75rem' }}><Star size={11} fill="currentColor" />{item.stars}</span>}
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>{item.description}</p>
                                {item.language && <span style={{ padding: '0.18rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '5px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.language}</span>}
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button onClick={() => { setForm(item); setModal(item); }} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer' }}><Pencil size={12} />Edit</button>
                                    <button onClick={() => del(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer' }}><Trash2 size={12} />Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>}

            <AnimatePresence>
                {modal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
                            className="card-base" style={{ width: '100%', maxWidth: 440, padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{modal === 'new' ? 'Add Repo' : 'Edit Repo'}</h2>
                                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[['repoName', 'Repo Name *'], ['description', 'Description'], ['githubUrl', 'GitHub URL *'], ['language', 'Language'], ['stars', 'Stars']].map(([key, label]) => (
                                    <div key={key}>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</label>
                                        <input type={key === 'stars' ? 'number' : 'text'} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="form-input" />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button onClick={() => setModal(null)} style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button onClick={save} disabled={saving} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                    {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Saving…</> : 'Save'}
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
