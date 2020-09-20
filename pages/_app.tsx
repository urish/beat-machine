import { AppPropsType } from 'next/dist/next-server/lib/utils';
import { GoogleAnalyticsScript } from '../components/google-analytics';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppPropsType) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalyticsScript />
    </>
  );
}

export default MyApp;
