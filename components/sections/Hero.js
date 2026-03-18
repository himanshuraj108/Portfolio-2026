'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin } from 'lucide-react';
import { SiLeetcode, SiHackerrank } from 'react-icons/si';
import Link from 'next/link';

const ROLES = [
    'Full-Stack Developer',
    'Data Scientist',
    'Problem Solver',
    'Open Source Contributor',
    'CS Student @ LPU',
];

const SOCIAL = [
    { icon: Github, href: 'https://github.com/himanshuraj108', label: 'GitHub', event: 'github_click' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/himanshu-raj-184488303/', label: 'LinkedIn', event: 'linkedin_click' },
    { icon: SiLeetcode, href: 'https://leetcode.com/himanshuraj108', label: 'LeetCode', event: 'leetcode_click' },
    { icon: SiHackerrank, href: 'https://www.hackerrank.com/profile/himanshuraj48512', label: 'HackerRank', event: 'hackerrank_click' },
];

/* ─── Typewriter ────────────────────────────────────────────────────────── */
function TypewriterText({ words }) {
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const word = words[index];
        let t;
        if (!deleting && displayed.length < word.length)
            t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
        else if (!deleting && displayed.length === word.length)
            t = setTimeout(() => setDeleting(true), 2000);
        else if (deleting && displayed.length > 0)
            t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        else { setDeleting(false); setIndex(i => (i + 1) % words.length); }
        return () => clearTimeout(t);
    }, [displayed, deleting, index, words]);

    return (
        <span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{displayed}</span>
            <span style={{ color: 'var(--accent-cyan)', animation: 'blink 1s infinite' }}>|</span>
            <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </span>
    );
}

/* ─── Particle canvas ───────────────────────────────────────────────────── */
function ParticleCanvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener('resize', resize);
        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.4 + 0.1,
        }));
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const color = '34, 211, 238';
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${p.opacity})`; ctx.fill();
            });
            particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 120) {
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${color},${0.08 * (1 - d / 120)})`;
                    ctx.lineWidth = 0.5; ctx.stroke();
                }
            }));
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

/* ─── Orbital Universe ──────────────────────────────────────────────────── */
/*
 * Uses requestAnimationFrame + Math.cos/sin for each planet.
 * Each planet is offset by exactly (i * π/2) = 0°, 90°, 180°, 270° —
 * so they are ALWAYS perfectly equally spaced, no CSS delay tricks needed.
 */
function OrbitalUniverse({ socialLinks, onSocialClick }) {
    const [mounted, setMounted] = useState(false);

    const SIZE = 500;
    const CX = SIZE / 2;

    const config = [
        { ...socialLinks[0], radius: 80,  durationMs: 20000, color: '#e2e8f0' },
        { ...socialLinks[1], radius: 130, durationMs: 30000, color: '#0a66c2' },
        { ...socialLinks[2], radius: 180, durationMs: 42000, color: '#ffa116' },
        { ...socialLinks[3], radius: 230, durationMs: 55000, color: '#00ea64' },
    ];


    const iconRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const startTs = useRef(null);

    // Mount guard: renders nothing on SSR to avoid hydration mismatch
    // (Math.cos/sin produces different float precision on server vs client)
    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted) return;
        let raf;
        const animate = (ts) => {
            if (!startTs.current) startTs.current = ts;
            const elapsed = ts - startTs.current;

            config.forEach(({ radius, durationMs }, i) => {
                const el = iconRefs[i].current;
                if (!el) return;
                // Offset each planet by 90° so all four are always equally spread
                const angle = (2 * Math.PI * elapsed / durationMs) + (i * Math.PI / 2);
                el.style.left = (CX + radius * Math.cos(angle)) + 'px';
                el.style.top = (CX + radius * Math.sin(angle)) + 'px';
            });

            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
            <style>{`
                @keyframes ob-pulse {
                    0%,100% { box-shadow: 0 0 18px 5px rgba(34,211,238,.55), 0 0 45px 14px rgba(34,211,238,.2), 0 0 80px 28px rgba(139,92,246,.15); }
                    50%     { box-shadow: 0 0 28px 9px rgba(34,211,238,.75), 0 0 65px 22px rgba(34,211,238,.3), 0 0 110px 40px rgba(139,92,246,.25); }
                }
                @keyframes ob-twinkle { 0%,100% { opacity: .12; } 50% { opacity: .65; } }
                .ob-planet {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    width: 48px; height: 48px;
                    border-radius: 50%;
                    background: rgba(8, 8, 24, .9);
                    border: 2px solid transparent;
                    display: flex; align-items: center; justify-content: center;
                    text-decoration: none;
                    transition: transform .2s ease, box-shadow .2s ease;
                    backdrop-filter: blur(6px);
                    z-index: 5;
                    cursor: pointer;
                }
                .ob-planet:hover { transform: translate(-50%, -50%) scale(1.3); }
            `}</style>

            {/* Twinkling star dots — golden-angle spread */}
            {Array.from({ length: 32 }).map((_, i) => {
                const ang = (i * 137.508 * Math.PI) / 180;
                const r = 55 + (i % 9) * 24;
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: CX + r * Math.cos(ang),
                        top: CX + r * Math.sin(ang),
                        width: i % 5 === 0 ? 2.5 : 1.5,
                        height: i % 5 === 0 ? 2.5 : 1.5,
                        borderRadius: '50%', background: 'white',
                        transform: 'translate(-50%,-50%)',
                        pointerEvents: 'none',
                        animation: `ob-twinkle ${1.6 + (i % 4) * 0.5}s ${i * 0.18}s ease-in-out infinite`,
                    }} />
                );
            })}

            {/* Static orbit rings */}
            {config.map(({ radius, label }) => (
                <div key={label} style={{
                    position: 'absolute',
                    left: CX - radius, top: CX - radius,
                    width: radius * 2, height: radius * 2,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.08)',
                    pointerEvents: 'none',
                }} />
            ))}

            {/* Central glowing star */}
            <div style={{
                position: 'absolute', left: CX, top: CX,
                transform: 'translate(-50%,-50%)',
                width: 62, height: 62, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #fff 0%, #22d3ee 45%, #7c3aed 100%)',
                animation: 'ob-pulse 3s ease-in-out infinite',
                zIndex: 10,
            }}>
                <div style={{
                    position: 'absolute', top: '13%', left: '15%',
                    width: '27%', height: '27%', borderRadius: '50%',
                    background: 'rgba(255,255,255,.9)', filter: 'blur(3px)',
                }} />
            </div>

            {/* Planet icons — positions updated every frame by rAF */}
            {config.map(({ icon: Icon, href, label, event, color }, i) => (
                <a
                    key={label}
                    ref={iconRefs[i]}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onSocialClick(event)}
                    title={label}
                    className="ob-planet"
                    style={{ borderColor: color, boxShadow: `0 0 14px 4px ${color}44`, color }}
                >
                    <Icon size={22} />
                </a>
            ))}
        </div>
    );
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */
export default function Hero() {
    const [cvUrl] = useState('/resume.pdf');

    useEffect(() => {
        fetch('/api/analytics', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'page_view', page: '/' }),
        });
    }, []);

    const handleSocialClick = (event) => {
        fetch('/api/analytics', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
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
            display: 'flex', alignItems: 'center', paddingTop: '80px',
        }}>
            <ParticleCanvas />

            {/* Background glow orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,211,238,.05) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,.05) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            {/* Two-column layout */}
            <div style={{
                maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem',
                width: '100%', position: 'relative', zIndex: 1,
                display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', justifyContent: 'space-between', gap: '2rem',
            }}>
                {/* LEFT — text */}
                <motion.div
                    variants={container} initial="hidden" animate="show"
                    style={{ flex: '1 1 400px', minWidth: 0 }}
                >
                    {/* Open-to-work badge */}
                    <motion.div variants={item} style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 1rem',
                            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                            borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, color: '#22c55e',
                        }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                            Open to Work
                        </div>
                    </motion.div>

                    {/* Name */}
                    <motion.h1 variants={item} className="heading-xl" style={{ marginBottom: '1rem', maxWidth: 900 }}>
                        Hi, I&apos;m <span className="gradient-text">Himanshu Raj</span>
                    </motion.h1>

                    {/* Typewriter */}
                    <motion.div variants={item} style={{ fontSize: 'clamp(1.2rem,3vw,1.8rem)', marginBottom: '1.5rem', color: 'var(--text-secondary)', minHeight: '2.5rem' }}>
                        <TypewriterText words={ROLES} />
                    </motion.div>

                    {/* Description */}
                    <motion.p variants={item} style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2.5rem' }}>
                        Computer Science student at LPU building high-performance web applications,
                        solving algorithmic problems, and contributing to open source.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div variants={item} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/projects" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.875rem 1.75rem',
                                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                                    borderRadius: '14px', color: 'white', fontWeight: 700, fontSize: '0.95rem',
                                    boxShadow: '0 8px 32px var(--accent-glow-violet)', cursor: 'pointer',
                                }}
                            >
                                View Projects <ArrowRight size={18} />
                            </motion.div>
                        </Link>

                        {cvUrl && (
                            <motion.a
                                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                                href={cvUrl} target="_blank" rel="noopener noreferrer"
                                onClick={() => handleSocialClick('cv_download')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.875rem 1.75rem',
                                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                                    borderRadius: '14px', color: 'var(--text-primary)',
                                    fontWeight: 600, fontSize: '0.95rem',
                                    textDecoration: 'none', cursor: 'pointer',
                                }}
                            >
                                <Download size={18} /> Download CV
                            </motion.a>
                        )}
                    </motion.div>
                </motion.div>

                {/* RIGHT — universe */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <OrbitalUniverse socialLinks={SOCIAL} onSocialClick={handleSocialClick} />
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
