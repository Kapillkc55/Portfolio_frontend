import Head from 'next/head';

export default function SEOSchema() {
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Kapilraj KC",
        "url": "https://www.kapilrajkc.com.np/",
        "image": "https://www.kapilrajkc.com.np/images/kapil.png",
        "sameAs": [
            "https://github.com/kapilrajkc",
            "https://www.linkedin.com/in/kapilrajkc"
        ],
        "jobTitle": "Full-Stack Developer",
        "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
        },
        "description": "Full-Stack Developer with 2+ years of experience specializing in React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, Spring Boot, AWS, and Docker",
        "knowsAbout": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Next.js",
            "Node.js",
            "TypeScript",
            "Express.js",
            "MongoDB",
            "PostgreSQL",
            "Spring Boot",
            "AWS",
            "Docker",
            "DevOps"
        ],
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Nepal"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Kapilraj KC Portfolio",
        "url": "https://www.kapilrajkc.com.np/",
        "description": "Portfolio of Kapilraj KC - Full-Stack Developer & DevOps Learner",
        "author": {
            "@type": "Person",
            "name": "Kapilraj KC"
        }
    };

    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Kapilraj KC - Web Development Services",
        "image": "https://www.kapilrajkc.com.np/images/kapil.png",
        "url": "https://www.kapilrajkc.com.np/",
        "telephone": "+977-XXXXXXXXXX",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Nepal"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "27.7172",
            "longitude": "85.3240"
        },
        "priceRange": "$$",
        "description": "Professional web development services including full-stack development, cloud deployment, and DevOps solutions"
    };

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
            />
        </Head>
    );
}
