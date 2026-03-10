'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FIELDS = [
    { key: 'name', label: 'Full Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'bio', label: 'Bio', multiline: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'location', label: 'Location' },
    { key: 'profilePhoto', label: 'Profile Photo', isFile: true, accept: 'image/*' },
    { key: 'cvUrl', label: 'CV / Resume', isFile: true, accept: '.pdf,.doc,.docx' },
    { key: 'linkedinUrl', label: 'LinkedIn URL' },
    { key: 'githubUrl', label: 'GitHub URL' },
    { key: 'twitterUrl', label: 'Twitter URL' },
    { key: 'leetcodeUrl', label: 'LeetCode URL' },
    { key: 'hackerrankUrl', label: 'HackerRank URL' },
    { key: 'devtoUrl', label: 'Dev.to URL' },
];

const VISIBILITY = [
    'showAbout', 'showSkills', 'showProjects', 'showCertificates',
    'showAchievements', 'showEducation', 'showBlog', 'showTestimonials',
    'showOpenSource', 'showContact',
];

const LABEL = (k) => k.replace('show', '') + ' Section';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(d => { setSettings(d); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const save = async () => {
        setSaving(true);
        const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
        setSaving(false);
        if (res.ok) toast.success('Settings saved!'); else toast.error('Failed to save.');
    };

    const handleUpload = async (key, file) => {
        if (!file) return;
        const toastId = toast.loading('Uploading...');
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'portfolio');
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            set(key, data.url);
            toast.success('Uploaded successfully', { id: toastId });
        } catch (err) {
            toast.error(err.message || 'Upload failed', { id: toastId });
        }
    };

    const set = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}><Loader2 size={28} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} /></div>;
    if (!settings) return <div style={{ padding: '2rem 2.5rem', color: 'var(--text-muted)' }}>Could not load settings. Is the database connected?</div>;

    return (
        <div style={{ padding: '2rem 2.5rem', maxWidth: 720 }}>
            <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</p>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Settings</h1>
            </div>

            {/* Profile fields */}
            <div className="card-base" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Profile Info</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {FIELDS.map(({ key, label, multiline, isFile, accept }) => (
                        <div key={key} style={{ gridColumn: (multiline || isFile) ? '1 / -1' : undefined }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</label>
                            {isFile ? (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input type="file" accept={accept} onChange={e => handleUpload(key, e.target.files[0])} className="form-input" style={{ flex: 1, padding: '0.6rem' }} />
                                    {settings[key] && (
                                        <a href={settings[key]} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                                            View Configured
                                        </a>
                                    )}
                                </div>
                            ) : multiline ? (
                                <textarea value={settings[key] || ''} onChange={e => set(key, e.target.value)} rows={4} className="form-input" style={{ resize: 'vertical' }} />
                            ) : (
                                <input value={settings[key] || ''} onChange={e => set(key, e.target.value)} className="form-input" />
                            )}
                        </div>
                    ))}
                </div>
                {/* Availability toggle */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                        <div onClick={() => set('availability', !settings.availability)}
                            style={{ width: 44, height: 24, borderRadius: '999px', background: settings.availability ? 'var(--accent-cyan)' : 'var(--border)', position: 'relative', transition: 'background 0.2s', flexShrink: 0, cursor: 'pointer' }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: settings.availability ? 23 : 3, transition: 'left 0.2s' }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Available for opportunities</span>
                    </label>
                </div>
            </div>

            {/* Section visibility */}
            <div className="card-base" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Section Visibility</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {VISIBILITY.map(key => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <div onClick={() => set(key, !settings[key])}
                                style={{ width: 36, height: 20, borderRadius: '999px', background: settings[key] ? 'var(--accent-cyan)' : 'var(--border)', position: 'relative', transition: 'background 0.2s', flexShrink: 0, cursor: 'pointer' }}>
                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: settings[key] ? 19 : 3, transition: 'left 0.2s' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{LABEL(key)}</span>
                        </label>
                    ))}
                </div>
            </div>

            <motion.button onClick={save} disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.875rem 2rem', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.8 : 1 }}>
                {saving ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />Saving…</> : <><Save size={18} />Save Settings</>}
            </motion.button>

            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </div>
    );
}
