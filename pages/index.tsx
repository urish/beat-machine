import { GetStaticProps } from 'next';
import Head from 'next/head';
import { BeatMachineUI, IDefaultMachines } from '../components/beat-machine-ui';
import { MobileAppLinks } from '../components/mobile-app-links';
import { loadMachine } from '../services/load-machine';
import styles from './index.module.css';

interface IHomeProps {
  machines: IDefaultMachines;
}

export default function Home({ machines }: IHomeProps) {
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
          <BeatMachineUI machines={machines} />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<IHomeProps> = async () => {
  const salsa = await loadMachine('salsa.xml');
  const merengue = await loadMachine('merengue.xml');
  return {
    props: {
      machines: { salsa, merengue },
    },
  };
};
