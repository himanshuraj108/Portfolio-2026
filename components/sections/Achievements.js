'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trophy } from 'lucide-react';
import { SiLeetcode, SiHackerrank } from 'react-icons/si';

const PLATFORM_ICONS = { HackerRank: SiHackerrank, LeetCode: SiLeetcode };
const PLATFORM_COLORS = { HackerRank: '#00ea64', LeetCode: '#ffa116' };

export default function Achievements() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('/api/achievements').then((r) => r.json()).then(setItems).catch(() => { });
    }, []);

    return (
        <section id="achievements" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Milestones</p>
                    <h2 className="heading-lg"><span className="gradient-text">Achievements</span></h2>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {items.map((item, i) => {
                        const Icon = PLATFORM_ICONS[item.platform] || Trophy;
                        const color = PLATFORM_COLORS[item.platform] || 'var(--accent-cyan)';
                        return (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-base" style={{ padding: '1.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={22} style={{ color }} />
                                    </div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.platform}</h3>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.description}</p>
                                {item.profileUrl && (
                                    <a href={item.profileUrl} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                                        <ExternalLink size={13} /> View Profile
                                    </a>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
