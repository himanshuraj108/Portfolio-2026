'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Briefcase, Github, Linkedin, Twitter } from 'lucide-react';
import { SiLeetcode, SiHackerrank, SiDevdotto } from 'react-icons/si';
import Link from 'next/link';

const ROLES = [
    'Full-Stack Developer',
    'Problem Solver',
    'Open Source Contributor',
    'CS Student @ LPU',
];

const SOCIAL = [
    { icon: Github, href: 'https://github.com/himanshuraj108', label: 'GitHub', event: 'github_click' },
    { icon: Linkedin, href: 'https://linkedin.com/in/himanshuraj108', label: 'LinkedIn', event: 'linkedin_click' },
    { icon: SiLeetcode, href: 'https://leetcode.com/himanshuraj', label: 'LeetCode', event: 'leetcode_click' },
    { icon: SiHackerrank, href: 'https://hackerrank.com/himanshuraj', label: 'HackerRank', event: 'hackerrank_click' },
    { icon: Twitter, href: 'https://twitter.com/himanshuraj', label: 'Twitter', event: 'twitter_click' },
    { icon: SiDevdotto, href: 'https://dev.to/himanshuraj', label: 'Dev.to', event: 'devto_click' },
];

function TypewriterText({ words }) {
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const word = words[index];
        let timeout;
        if (!deleting && displayed.length < word.length) {
            timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
        } else if (!deleting && displayed.length === word.length) {
            timeout = setTimeout(() => setDeleting(true), 2000);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setIndex((i) => (i + 1) % words.length);
        }
        return () => clearTimeout(timeout);
    }, [displayed, deleting, index, words]);

    return (
        <span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{displayed}</span>
            <span style={{ color: 'var(--accent-cyan)', animation: 'blink 1s infinite' }}>|</span>
            <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
        </span>
    );
}

// Particle canvas component  
function ParticleCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.documentElement.classList.contains('dark');
            const color = isDark ? '34, 211, 238' : '6, 182, 212';

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fill();
            });

            // Draw connections
            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach((b) => {
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} id="particle-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

export default function Hero() {
    const [cvUrl, setCvUrl] = useState(null);

    useEffect(() => {
        fetch('/api/cv').then((r) => r.json()).then((d) => setCvUrl(d.cvUrl)).catch(() => { });
        // Log page view
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'page_view', page: '/' }),
        });
    }, []);

    const handleSocialClick = (event) => {
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, page: '/' }),
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };
    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
    };

    return (
        <section style={{
            minHeight: '100vh', position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center',
            paddingTop: '80px',
        }}>
            <ParticleCanvas />

            {/* Background orbs */}
            <div style={{
                position: 'absolute', top: '10%', left: '-10%',
                width: '40vw', height: '40vw', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '10%', right: '-10%',
                width: '40vw', height: '40vw', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none',
            }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
                <motion.div variants={container} initial="hidden" animate="show">

                    {/* Availability badge */}
                    <motion.div variants={item} style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 1rem',
                            background: 'rgba(34, 197, 94, 0.08)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '999px',
                            fontSize: '0.8rem', fontWeight: 600, color: '#22c55e',
                        }}>
                            <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                            Open to Work
                        </div>
                    </motion.div>

                    {/* Name */}
                    <motion.h1 variants={item} className="heading-xl" style={{ marginBottom: '1rem', maxWidth: 900 }}>
                        Hi, I&apos;m{' '}
                        <span className="gradient-text">Himanshu Raj</span>
                    </motion.h1>

                    {/* Typewriter */}
                    <motion.div variants={item} style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', marginBottom: '1.5rem', color: 'var(--text-secondary)', minHeight: '2.5rem' }}>
                        <TypewriterText words={ROLES} />
                    </motion.div>

                    {/* Description */}
                    <motion.p variants={item} style={{
                        fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                        maxWidth: 580, marginBottom: '2.5rem',
                    }}>
                        Computer Science student at LPU building high-performance web applications,
                        solving algorithmic problems, and contributing to open source.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={item} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                        <Link href="/projects" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.875rem 1.75rem',
                                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                    borderRadius: '14px', color: 'white', fontWeight: 700, fontSize: '0.95rem',
                                    boxShadow: '0 8px 32px var(--accent-glow-violet)',
                                    cursor: 'pointer',
                                }}
                            >
                                View Projects <ArrowRight size={18} />
                            </motion.div>
                        </Link>

                        {cvUrl && (
                            <motion.a
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                href={cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleSocialClick('cv_download')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.875rem 1.75rem',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '14px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem',
                                    textDecoration: 'none', cursor: 'pointer',
                                }}
                            >
                                <Download size={18} />
                                Download CV
                            </motion.a>
                        )}
                    </motion.div>

                    {/* Social icons */}
                    <motion.div variants={item} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {SOCIAL.map(({ icon: Icon, href, label, event }) => (
                            <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleSocialClick(event)}
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.9 }}
                                title={label}
                                style={{
                                    width: 44, height: 44, borderRadius: '12px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-secondary)', textDecoration: 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Icon size={19} />
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                style={{
                    position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                    color: 'var(--text-muted)', fontSize: '0.75rem',
                }}
            >
                <div style={{ width: 22, height: 36, border: '1.5px solid var(--border)', borderRadius: '999px', display: 'flex', justifyContent: 'center', paddingTop: '5px' }}>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ width: 3, height: 8, background: 'var(--accent-cyan)', borderRadius: '999px' }}
                    />
                </div>
                Scroll
            </motion.div>
        </section>
    );
}
