import { useEffect, useState } from 'react';
import { AudioBackend } from '../engine/audio-backend';
import { BeatEngine } from '../engine/beat-engine';

export function useBeatEngine() {
  const [engine, setEngine] = useState<BeatEngine | null>(null);

  useEffect(() => {
    const newEngine = new BeatEngine(new AudioBackend());
    setEngine(newEngine);

    return () => newEngine.stop();
  }, []);

  return engine;
}
