'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/layout/LoadingScreen';
import BackToTop from '@/components/layout/BackToTop';
import Hero from '@/components/sections/Hero';

// Lazy-load below-the-fold sections for better LCP
const About = dynamic(() => import('@/components/sections/About'));
const Skills = dynamic(() => import('@/components/sections/Skills'));
const Projects = dynamic(() => import('@/components/sections/Projects'));
const Certificates = dynamic(() => import('@/components/sections/Certificates'));
const Achievements = dynamic(() => import('@/components/sections/Achievements'));
const Education = dynamic(() => import('@/components/sections/Education'));
const Blog = dynamic(() => import('@/components/sections/Blog'));
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'));
const OpenSource = dynamic(() => import('@/components/sections/OpenSource'));
const Contact = dynamic(() => import('@/components/sections/Contact'));

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Achievements />
        <Education />
        <Blog />
        <Testimonials />
        <OpenSource />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
