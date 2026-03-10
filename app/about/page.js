import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import About from '@/components/sections/About';

export const metadata = {
    title: 'About',
    description: 'Learn more about Himanshu Raj — Full-Stack Developer, CS student at LPU, and problem solver.',
};

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '5rem' }}>
                <About />
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}
