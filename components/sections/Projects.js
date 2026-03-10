'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star } from 'lucide-react';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/projects').then((r) => r.json()).then((data) => {
            setProjects(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const allTags = ['All', ...new Set(projects.flatMap((p) => p.techStack))].slice(0, 10);
    const filtered = filter === 'All' ? projects : projects.filter((p) => p.techStack.includes(filter));

    return (
        <section id="projects" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What I've Built</p>
                    <h2 className="heading-lg">Featured <span className="gradient-text">Projects</span></h2>
                </motion.div>

                {/* Filter */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                    {allTags.map((tag) => (
                        <button key={tag} onClick={() => setFilter(tag)} style={{
                            padding: '0.35rem 0.875rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                            fontSize: '0.8rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                            background: filter === tag ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))' : 'var(--bg-tertiary)',
                            color: filter === tag ? 'white' : 'var(--text-secondary)',
                            transition: 'all 0.2s',
                        }}>{tag}</button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 340 }} />)}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {filtered.map((project, i) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                className="card-base"
                                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                            >
                                {/* Image */}
                                <div
                                    onClick={() => {
                                        const url = project.liveUrl || project.githubUrl;
                                        if (url) window.open(url, '_blank', 'noopener,noreferrer');
                                    }}
                                    style={{
                                        height: 180, background: 'var(--bg-tertiary)', position: 'relative',
                                        overflow: 'hidden', cursor: (project.liveUrl || project.githubUrl) ? 'pointer' : 'default',
                                    }}
                                >
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : project.liveUrl ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#fff' }}>
                                            <iframe
                                                src={project.liveUrl}
                                                title={`${project.title} preview`}
                                                loading="lazy"
                                                style={{
                                                    width: '200%', height: '200%',
                                                    transform: 'scale(0.5)', transformOrigin: 'top left',
                                                    border: 'none', pointerEvents: 'none',
                                                }}
                                            />
                                            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'linear-gradient(135deg, var(--accent-glow-cyan), var(--accent-glow-violet))',
                                            fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-heading)',
                                        }}>
                                            {project.title.substring(0, 2).toUpperCase()}
                                        </div>
                                    )
                                    }
                                    {project.featured && (
                                        <div style={{
                                            position: 'absolute', top: 12, left: 12,
                                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                                            padding: '0.25rem 0.6rem', borderRadius: '999px',
                                            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                            fontSize: '0.7rem', fontWeight: 700, color: 'white',
                                        }}>
                                            <Star size={10} fill="white" /> Featured
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{project.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                                        {project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}
                                    </p>

                                    {/* Tech stack */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                                        {project.techStack.slice(0, 4).map((tech) => (
                                            <span key={tech} style={{
                                                padding: '0.2rem 0.6rem', borderRadius: '6px',
                                                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                                                fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500,
                                            }}>{tech}</span>
                                        ))}
                                        {project.techStack.length > 4 && (
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>+{project.techStack.length - 4}</span>
                                        )}
                                    </div>

                                    {/* Links */}
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}
                                                onClick={() => fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'github_click', page: '/projects' }) })}
                                            ><Github size={14} /> Code</a>
                                        )}
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}
                                            ><ExternalLink size={14} /> Live Demo</a>
                                        )}
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
