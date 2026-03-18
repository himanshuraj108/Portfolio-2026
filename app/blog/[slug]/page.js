'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const mdComponents = {
    h1: ({ node, ...props }) => <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, margin: '2.5rem 0 1rem', letterSpacing: '-0.02em', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }} {...props} />,
    h2: ({ node, ...props }) => <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, margin: '2rem 0 0.75rem', paddingLeft: '0.75rem', borderLeft: '3px solid var(--accent-cyan)' }} {...props} />,
    h3: ({ node, ...props }) => <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.5rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, margin: '1.75rem 0 0.5rem' }} {...props} />,
    h4: ({ node, ...props }) => <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', lineHeight: 1.4, margin: '1.5rem 0 0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }} {...props} />,
    p: ({ node, ...props }) => <p style={{ marginBottom: '1.2rem', lineHeight: 1.9, color: 'var(--text-secondary)' }} {...props} />,
    strong: ({ node, ...props }) => <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }} {...props} />,
    em: ({ node, ...props }) => <em style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }} {...props} />,
    a: ({ node, ...props }) => <a style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', textUnderlineOffset: '3px', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.75'} onMouseLeave={e => e.currentTarget.style.opacity = '1'} {...props} />,
    ul: ({ node, ...props }) => <ul style={{ listStyleType: 'disc', paddingLeft: '1.75rem', margin: '0.75rem 0 1.25rem', color: 'var(--text-secondary)' }} {...props} />,
    ol: ({ node, ...props }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '1.75rem', margin: '0.75rem 0 1.25rem', color: 'var(--text-secondary)' }} {...props} />,
    li: ({ node, ...props }) => <li style={{ marginBottom: '0.4rem', lineHeight: 1.8 }} {...props} />,
    blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '4px solid var(--accent-cyan)', paddingLeft: '1.1rem', margin: '1.5rem 0', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(99,179,237,0.05)', borderRadius: '0 8px 8px 0', padding: '0.75rem 1.1rem' }} {...props} />,
    hr: ({ node, ...props }) => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} {...props} />,
    table: ({ node, ...props }) => <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }} {...props} /></div>,
    thead: ({ node, ...props }) => <thead style={{ background: 'rgba(99,179,237,0.08)' }} {...props} />,
    th: ({ node, ...props }) => <th style={{ padding: '0.65rem 1rem', border: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 700 }} {...props} />,
    td: ({ node, ...props }) => <td style={{ padding: '0.55rem 1rem', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} {...props} />,
    img: ({ node, ...props }) => <img style={{ maxWidth: '100%', borderRadius: '10px', margin: '1rem 0' }} {...props} />,
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        if (!inline && match) {
            return (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ borderRadius: '12px', margin: '1.25rem 0', fontSize: '0.875rem', lineHeight: 1.75 }}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            );
        }
        return (
            <code style={{ fontFamily: 'monospace', fontSize: '0.85em', background: 'rgba(99,179,237,0.1)', color: 'var(--accent-cyan)', padding: '0.15em 0.4em', borderRadius: '5px', border: '1px solid rgba(99,179,237,0.2)' }} {...props}>
                {children}
            </code>
        );
    },
};

export default function BlogPostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/blog/${slug}`)
            .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return; } return r.json(); })
            .then(d => { if (d) { setPost(d); setLoading(false); } })
            .catch(() => { setNotFound(true); setLoading(false); });
    }, [slug]);

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '6rem', minHeight: '80vh' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem' }}>
                        <Loader2 size={32} style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : notFound ? (
                    <div style={{ maxWidth: 640, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Post Not Found</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This post doesn&apos;t exist or has been removed.</p>
                        <Link href="/blog" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>← Back to Blog</Link>
                    </div>
                ) : post ? (
                    <article style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

                        {/* Back link */}
                        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '2rem' }}>
                            <Link href="/blog"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                <ArrowLeft size={15} /> Back to Blog
                            </Link>
                        </motion.div>

                        {/* Cover image */}
                        {post.coverImage && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '2.5rem', maxHeight: 380 }}>
                                <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>
                        )}

                        {/* Tags */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                            {(post.tags || []).map(tag => (
                                <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', background: 'var(--accent-glow-cyan)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                                    <Tag size={10} />{tag}
                                </span>
                            ))}
                        </motion.div>

                        {/* Title */}
                        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            {post.title}
                        </motion.h1>

                        {/* Meta */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Calendar size={13} />
                                {new Date(post.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            {post.views > 0 && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Eye size={13} />{post.views} views
                                </span>
                            )}
                        </motion.div>

                        {/* Markdown Content */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                {post.content}
                            </ReactMarkdown>
                        </motion.div>

                    </article>
                ) : null}
            </main>
            <Footer />
            <BackToTop />
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </>
    );
}
