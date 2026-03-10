import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import Contact from '@/components/sections/Contact';

export const metadata = {
    title: 'Contact',
    description: 'Get in touch with Himanshu Raj — open to freelance, internships, and collaboration opportunities.',
};

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '5rem' }}>
                <Contact />
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}
