import { isProduction } from '../utils/environment';

export function GoogleAnalyticsScript() {
  if (!isProduction) {
    return null;
  }

  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-1666271-5" />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-1666271-5');
          `,
        }}
      />
    </>
  );
}
