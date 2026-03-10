'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Quote } from 'lucide-react';

export default function Testimonials() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('/api/testimonials').then((r) => r.json()).then(setItems).catch(() => { });
    }, []);

    if (items.length === 0) return null;

    return (
        <section id="testimonials" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What People Say</p>
                    <h2 className="heading-lg"><span className="gradient-text">Testimonials</span></h2>
                </motion.div>

                <Swiper modules={[Pagination, Autoplay]} pagination={{ clickable: true }} autoplay={{ delay: 5000 }} spaceBetween={24} style={{ paddingBottom: '3rem' }}>
                    {items.map((t) => (
                        <SwiperSlide key={t.id}>
                            <div className="card-base" style={{ padding: '2rem' }}>
                                <Quote size={32} style={{ color: 'var(--accent-violet)', opacity: 0.4, marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.5rem' }}>{t.message}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-cyan)', flexShrink: 0 }}>
                                        {t.avatar ? <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.name}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.role}{t.company && ` at ${t.company}`}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
