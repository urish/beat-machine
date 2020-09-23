import Head from 'next/head';
import styles from './android-videos.module.css';
import videos from '../public/assets/timing-videos.json';

export default function AndroidVideos() {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
        <title>Salsa Rhythm &amp; Timing Videos</title>
      </Head>

      <ul className={styles.nav}>
        {videos.data.map((item) => (
          <li className={styles.videoItem} key={item.id}>
            <a href={`http://www.youtube.com/watch?v=${item.youtube_id}`}>
              <img src={item.thumbnail_url} alt={item.title} />
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      <style jsx global>{`
        body {
          background: #eee;
        }
      `}</style>
    </div>
  );
}
