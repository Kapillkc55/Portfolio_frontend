import '@/styles/globals.css'
import '@/styles/Hero.css'
import '@/styles/AboutUs.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                {/* Default SEO Meta Tags */}
                <title>Kapilraj KC - Full-Stack Developer & DevOps Learner</title>
                <meta name="description" content="Full-Stack Developer with 2+ years of experience specializing in React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, Spring Boot, AWS, and Docker. Building scalable web applications and learning DevOps fundamentals." />
                <meta name="keywords" content="Kapilraj KC, Full-Stack Developer, DevOps, React, Next.js, Node.js, TypeScript, Express.js, MongoDB, PostgreSQL, Spring Boot, AWS, Docker, Web Development, Nepal, Software Engineer" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.kapilrajkc.com.np/" />
                <meta property="og:title" content="Kapilraj KC - Full-Stack Developer & DevOps Learner" />
                <meta property="og:description" content="Full-Stack Developer with 2+ years of experience building scalable web applications. Expert in React, Next.js, Node.js, and cloud deployment." />
                <meta property="og:image" content="https://www.kapilrajkc.com.np/images/kapil.png" />
                <meta property="og:site_name" content="Kapilraj KC Portfolio" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://www.kapilrajkc.com.np/" />
                <meta name="twitter:title" content="Kapilraj KC - Full-Stack Developer & DevOps Learner" />
                <meta name="twitter:description" content="Full-Stack Developer with 2+ years of experience building scalable web applications. Expert in React, Next.js, Node.js, and cloud deployment." />
                <meta name="twitter:image" content="https://www.kapilrajkc.com.np/images/kapil.png" />

                {/* Additional Meta Tags */}
                <meta name="theme-color" content="#7c3aed" />
                <link rel="canonical" href="https://www.kapilrajkc.com.np/" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}
