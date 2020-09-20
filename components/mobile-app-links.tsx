import styles from './mobile-app-links.module.css';

export function MobileAppLinks() {
  return (
    <div className={styles.mobileLinks}>
      <a
        href="https://play.google.com/store/apps/details?id=com.salsarhythm"
        className={styles.android}
        target="_blank"
        rel="noopener noreferrer"
      >
        Android
      </a>
      <a
        href="https://itunes.apple.com/us/app/salsa-rhythm-the-latin-dance-practice-tool/id379868541"
        target="_blank"
        rel="noopener noreferrer"
      >
        iOS
      </a>
    </div>
  );
}
