import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Browser Tab Title - RVC ESPORTS */}
        <title>RVC ESPORTS</title>
        
        {/* Favicon */}
        <link rel="icon" href="/images/RVCLOGO.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/images/RVCLOGO.jpg" />
        
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        <meta name="description" content="RVC Esports" />
        <meta name="theme-color" content="#0a0a0a" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}