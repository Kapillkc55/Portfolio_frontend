import Head from 'next/head';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import SEOSchema from '@/components/SEOSchema';

export default function Home() {
    return (
        <>
            <Head>
                <title>Kapilraj KC - Full-Stack Developer | React, Next.js, Node.js Expert</title>
                <meta name="description" content="Portfolio of Kapilraj KC - Full-Stack Developer with 2+ years of experience in React, Next.js, Node.js, TypeScript, MongoDB, AWS, Docker. Building scalable web applications from Nepal." />
            </Head>
            <SEOSchema />
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
