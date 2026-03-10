'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Languages', 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'];
const EMPTY = { name: '', category: 'Languages', icon: '', order: 0 };

export default function AdminSkillsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    const load = () => { setLoading(true); fetch('/api/skills').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false)); };
    useEffect(load, []);

    const openNew = () => { setForm(EMPTY); setModal('new'); };
    const openEdit = (item) => { setForm(item); setModal(item); };
    const close = () => setModal(null);

    const save = async () => {
        setSaving(true);
        const isNew = modal === 'new';
        const url = isNew ? '/api/skills' : `/api/skills/${modal.id}`;
        const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, order: Number(form.order) || 0 }) });
        setSaving(false);
        if (res.ok) { toast.success(isNew ? 'Skill added!' : 'Updated!'); close(); load(); } else toast.error('Failed.');
    };

    const del = async (id) => {
        if (!confirm('Delete?')) return;
        const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
        if (res.ok) { toast.success('Deleted!'); load(); } else toast.error('Failed.');
    };

    const grouped = CATEGORIES.reduce((acc, cat) => { acc[cat] = items.filter(i => i.category === cat); return acc; }, {});

    return (
        <div style={{ padding: '2rem 2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</p>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Skills</h1>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openNew}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                    <Plus size={16} /> Add Skill
                </motion.button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={28} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} /></div>
            ) : (
                CATEGORIES.map(cat => grouped[cat]?.length > 0 && (
                    <div key={cat} style={{ marginBottom: '2rem' }}>
                        <p style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{cat}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {grouped[cat].map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                    {item.icon && <span>{item.icon}</span>}
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</span>
                                    <button onClick={() => openEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}><Pencil size={12} /></button>
                                    <button onClick={() => del(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, display: 'flex' }}><Trash2 size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {!loading && items.length === 0 && (
                <div className="card-base" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No skills yet. Add your first one!</div>
            )}

            <AnimatePresence>
                {modal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
                            className="card-base" style={{ width: '100%', maxWidth: 420, padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{modal === 'new' ? 'Add Skill' : 'Edit Skill'}</h2>
                                <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Skill Name *</label>
                                    <input value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" placeholder="e.g. React" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Category</label>
                                    <select value={form.category || 'Languages'} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="form-input">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Icon (emoji or URL)</label>
                                    <input value={form.icon || ''} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="form-input" placeholder="e.g. ⚛️" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Order</label>
                                    <input type="number" value={form.order || 0} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} className="form-input" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button onClick={close} style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button onClick={save} disabled={saving} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                    {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Saving…</> : 'Save'}
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
