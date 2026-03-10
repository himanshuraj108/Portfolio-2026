import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import Projects from '@/components/sections/Projects';

export const metadata = {
    title: 'Projects',
    description: 'Explore the projects built by Himanshu Raj — full-stack web apps, tools, and open-source contributions.',
};

export default function ProjectsPage() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '5rem' }}>
                <Projects />
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}
