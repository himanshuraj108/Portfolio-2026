'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Star, ExternalLink, Github, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '', featured: false, order: 0 };

export default function AdminProjectsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'new' | item
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        fetch('/api/projects').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
    };
    useEffect(load, []);

    const openNew = () => { setForm(EMPTY); setModal('new'); };
    const openEdit = (item) => { setForm({ ...item, techStack: Array.isArray(item.techStack) ? item.techStack.join(', ') : item.techStack }); setModal(item); };
    const close = () => setModal(null);

    const save = async () => {
        setSaving(true);
        const body = { ...form, techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean), order: Number(form.order) || 0 };
        const isNew = modal === 'new';
        const url = isNew ? '/api/projects' : `/api/projects/${modal.id}`;
        const method = isNew ? 'POST' : 'PUT';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        setSaving(false);
        if (res.ok) { toast.success(isNew ? 'Project added!' : 'Project updated!'); close(); load(); }
        else toast.error('Failed to save.');
    };

    const del = async (id) => {
        if (!confirm('Delete this project?')) return;
        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (res.ok) { toast.success('Deleted!'); load(); } else toast.error('Failed.');
    };

    return (
        <div style={{ padding: '2rem 2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</p>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Projects</h1>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openNew}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                    <Plus size={16} /> Add Project
                </motion.button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={28} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} /></div>
            ) : items.length === 0 ? (
                <div className="card-base" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No projects yet. Add your first one!</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {items.map(item => (
                        <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-base" style={{ padding: '1.25rem' }}>
                            {item.featured && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', background: 'rgba(245,158,11,0.12)', borderRadius: '6px', fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600, marginBottom: '0.75rem' }}><Star size={10} fill="currentColor" />Featured</span>}
                            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{item.description?.slice(0, 100)}{item.description?.length > 100 ? '…' : ''}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                                {(Array.isArray(item.techStack) ? item.techStack : []).slice(0, 4).map(t => (
                                    <span key={t} style={{ padding: '0.15rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '5px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t}</span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => openEdit(item)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer' }}><Pencil size={12} />Edit</button>
                                <button onClick={() => del(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer' }}><Trash2 size={12} />Delete</button>
                                {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--accent-glow-cyan)', border: '1px solid rgba(34,211,238,0.2)', color: 'var(--accent-cyan)', fontSize: '0.78rem', textDecoration: 'none' }}><ExternalLink size={12} /></a>}
                                {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.78rem', textDecoration: 'none' }}><Github size={12} /></a>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {modal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={close}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="card-base" style={{ width: '100%', maxWidth: 560, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{modal === 'new' ? 'Add Project' : 'Edit Project'}</h2>
                                <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[['title', 'Title *'], ['description', 'Description'], ['techStack', 'Tech Stack (comma separated)'], ['githubUrl', 'GitHub URL'], ['liveUrl', 'Live URL'], ['imageUrl', 'Image URL'], ['order', 'Order']].map(([key, label]) => (
                                    <div key={key}>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</label>
                                        {key === 'description' ? (
                                            <textarea value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={3} className="form-input" style={{ resize: 'vertical' }} />
                                        ) : (
                                            <input type={key === 'order' ? 'number' : 'text'} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="form-input" />
                                        )}
                                    </div>
                                ))}
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <input type="checkbox" checked={form.featured || false} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
                                    Featured project
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button onClick={close} style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button onClick={save} disabled={saving} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                    {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : 'Save Project'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </div>
    );
}
