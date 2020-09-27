import Head from 'next/head';
import styles from './404.module.css';

export default function Error404() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Not Found - The Salsa Beat Machine 🎼🎹</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather:300" rel="stylesheet" />
        <link rel="manifest" href="manifest.json" />
        <meta name="theme-color" content="#1976d2" />
        <meta
          name="description"
          content="Explore Salsa music with an interactive rhythm machine. Practice Salsa timing and train your ears. Combine and arrange instruments to create different salsa tunes."
        />
        <meta property="og:title" content="The Salsa Beat Machine" />
        <meta
          property="og:description"
          content="Explore Salsa music with an interactive rhythm machine. Practice Salsa timing and train your ears. Combine and arrange instruments to create different salsa tunes."
        />
        <meta property="og:url" content="https://www.salsabeatmachine.org/" />
        <meta property="og:image" content="https://www.salsabeatmachine.org/assets/images/salsabeatmachine-cover.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>

      <div className={styles.page}>
        <h1>Page Not Found (404)</h1>

        <a href="/">Take me 🏠</a>
      </div>
    </>
  );
}
