import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Beautiful Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="RVC Esports Management" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/images/RVCLOGO.jpg" type="image/jpeg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}