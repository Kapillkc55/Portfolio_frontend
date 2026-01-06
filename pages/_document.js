import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Favicon */}
                <link rel="icon" href="/images/kapil.png" type="image/png" />
                <link rel="shortcut icon" href="/images/kapil.png" type="image/png" />
                <link rel="apple-touch-icon" href="/images/kapil.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/images/kapil.png" />
                <link rel="icon" type="image/png" sizes="512x512" href="/images/kapil.png" />

                {/* Manifest for PWA */}
                <link rel="manifest" href="/manifest.json" />

                {/* Primary Meta Tags */}
                <meta name="author" content="Kapilraj KC" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />

                {/* Google Fonts - Optional for better performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
