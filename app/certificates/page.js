import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import Certificates from '@/components/sections/Certificates';

export const metadata = {
    title: 'Certificates',
    description: 'Certifications and credentials earned by Himanshu Raj across various platforms and organizations.',
};

export default function CertificatesPage() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '5rem' }}>
                <Certificates />
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}
