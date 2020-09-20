import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Select,
  Slider,
  Typography,
} from '@material-ui/core';
import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Machine } from '../engine/machine';
import { useBeatEngine } from '../hooks/use-beat-engine';
import { useMachine } from '../hooks/use-machine';
import { useWindowListener } from '../hooks/use-window-listener';
import { BeatIndicator } from './beat-indicator';
import styles from './beat-machine-ui.module.css';
import { InstrumentTile } from './instrument-tile';

export const BeatMachineUI = observer(() => {
  const engine = useBeatEngine();
  const salsa = useMachine('/assets/machines/salsa.xml');
  const merengue = useMachine('/assets/machines/merengue.xml');
  const [machine, setMachine] = useState(new Machine());

  useEffect(() => {
    if (engine && machine) {
      engine.machine = machine;
    }
  }, [engine, machine]);

  useEffect(() => {
    if (salsa) {
      setMachine(salsa);
    }
  }, [salsa]);

  const beatCount = machine.flavor === 'Merengue' ? 4 : 8;
  const beatIndex = engine?.playing ? Math.round(0.5 + (engine.beat % beatCount)) : 0;

  useWindowListener(
    'keydown',
    (event: KeyboardEvent) => {
      switch (event.key) {
        case '+':
        case '=':
          machine.bpm = Math.min(250, machine.bpm + 5);
          break;

        case '-':
          machine.bpm = Math.max(80, machine.bpm - 5);
          break;

        case 'k':
          machine.keyNote = (machine.keyNote + 7) % 12;
          break;

        case 'K':
          machine.keyNote = (machine.keyNote + 5) % 12;
      }
      if (event.key >= '0' && event.key <= '9') {
        const index = (parseInt(event.key, 10) + 10 - 1) % 10;
        const instrument = machine.instruments[index];
        if (instrument) {
          if (event.altKey) {
            instrument.activeProgram = (instrument.activeProgram + 1) % instrument.programs.length;
          } else {
            instrument.enabled = !instrument.enabled;
          }
        }
      }
    },
    [machine],
  );

  const playClick = () => {
    if (engine?.playing) {
      engine?.stop();
    } else {
      engine?.play();
    }
  };

  return (
    <div>
      <div className={styles.card}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <IconButton onClick={playClick} aria-label={engine?.playing ? 'Pause' : 'Play'} style={{ color: '#000' }}>
              {engine?.playing ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <Slider
              min={80}
              max={250}
              valueLabelDisplay="auto"
              value={machine.bpm}
              aria-labelledby="bpm-slider"
              onChange={(e, newValue) => (machine.bpm = newValue as number)}
            />
          </Grid>
          <Grid item>
            <Typography id="bpm-slider" gutterBottom>
              {machine.bpm} BPM
            </Typography>
          </Grid>
          <Grid item xs={1} />
          <Grid item>
            {engine && salsa && merengue && (
              <ButtonGroup variant="text" color="primary" aria-label="Music style">
                <Button
                  onClick={() => setMachine(salsa)}
                  variant={machine.flavor === 'Salsa' ? 'contained' : undefined}
                >
                  Salsa
                </Button>
                <Button
                  onClick={() => setMachine(merengue)}
                  variant={machine.flavor === 'Merengue' ? 'contained' : undefined}
                >
                  Merengue
                </Button>
              </ButtonGroup>
            )}
          </Grid>
          <Grid item xs={1} />
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="machine-key-note">Key</InputLabel>
              <Select
                native
                value={machine.keyNote}
                onChange={(e) => (machine.keyNote = parseInt(e.target.value as string, 10))}
                inputProps={{
                  id: 'machine-key-note',
                }}
              >
                <option value="0">C</option>
                <option value="1">C#</option>
                <option value="2">D</option>
                <option value="3">D#</option>
                <option value="4">E</option>
                <option value="5">F</option>
                <option value="6">F#</option>
                <option value="7">G</option>
                <option value="8">G#</option>
                <option value="9">A</option>
                <option value="10">A#</option>
                <option value="11">B</option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <div className={styles.controlsIndicator}>
          <BeatIndicator currentBeat={beatIndex} max={beatCount} />
        </div>
      </div>

      <div className={classnames(styles.card, styles.instrumentList)}>
        {machine?.instruments.map((instrument) => (
          <div key={instrument.id} className={styles.instrumentTile}>
            <InstrumentTile instrument={instrument} />
          </div>
        ))}
      </div>
    </div>
  );
});
