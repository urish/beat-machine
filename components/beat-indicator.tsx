import styles from './beat-indicator.module.css';
import classnames from 'classnames';

export interface IBeatIndicatorProps {
  currentBeat: number;
  max: number;
}

export function BeatIndicator({ currentBeat, max }: IBeatIndicatorProps) {
  const spans = [];
  for (let i = 1; i <= max; i++) {
    spans.push(<span key={i} className={classnames(styles.beat, i == currentBeat && styles.active)} />);
  }
  return <>{spans}</>;
}
