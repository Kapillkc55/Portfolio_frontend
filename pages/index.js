import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <AboutUs />
            <Work />
            <Experience />
            <Contact />
            <Footer />
            <WhatsAppWidget />
        </>
    );
}
