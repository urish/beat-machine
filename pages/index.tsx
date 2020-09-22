import Head from 'next/head';
import { BeatMachineUI } from '../components/beat-machine-ui';
import { MobileAppLinks } from '../components/mobile-app-links';
import styles from './index.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>The Salsa Beat Machine</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather:300" rel="stylesheet" />
        <link rel="manifest" href="manifest.json" />
        <meta name="theme-color" content="#1976d2" />
      </Head>

      <div className={styles.homepage}>
        <h1>The Salsa Beat Machine</h1>

        <MobileAppLinks />
        <div className={styles.appContainer}>
          <BeatMachineUI />
        </div>
      </div>
    </>
  );
}
