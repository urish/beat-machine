import { FormControl, IconButton, Select, Slider } from '@material-ui/core';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { IInstrument } from '../engine/machine-interfaces';
import styles from './instrument-tile.module.css';
import SettingsIcon from '@material-ui/icons/Settings';
import VolumeIcon from '@material-ui/icons/VolumeUp';

interface IInstrumentTileProps {
  instrument: IInstrument;
}

export const InstrumentTile = observer(({ instrument }: IInstrumentTileProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(instrument.volume);
  const showTitle = !showSettings && !showVolume;

  const toggle = () => {
    if (instrument.enabled) {
      setPreviousVolume(instrument.volume);
      instrument.volume = 0;
    } else if (previousVolume > 0) {
      instrument.volume = previousVolume;
    }
    instrument.enabled = !instrument.enabled;
  };

  return (
    <div className={styles.container}>
      <div className={styles.main} title={instrument.title}>
        <div
          className={classnames(styles.thumbnail, !instrument.enabled && styles.disabled)}
          onClick={toggle}
          style={{ backgroundImage: `url(assets/instruments/${instrument.id}.svg)` }}
        />
        <div className={styles.tools}>
          <IconButton
            className={styles.iconButton}
            onClick={() => {
              setShowSettings(!showSettings);
              setShowVolume(false);
            }}
          >
            <SettingsIcon className={classnames(showSettings && styles.active)} />
          </IconButton>
          <IconButton
            className={styles.iconButton}
            onClick={() => {
              setShowVolume(!showVolume);
              setShowSettings(false);
            }}
          >
            <VolumeIcon className={classnames(showVolume && styles.active)} />
          </IconButton>
        </div>
      </div>
      {showTitle && <div className={classnames(styles.bottom, styles.instrumentLabel)}>{instrument.title}</div>}
      {showVolume && (
        <Slider
          min={0}
          max={1}
          step={0.1}
          aria-label="Instrument volume"
          value={instrument.volume}
          onChange={(e, newValue) => {
            instrument.volume = newValue as number;
          }}
        />
      )}
      {showSettings && (
        <FormControl>
          <Select
            native
            value={instrument.activeProgram + 1}
            onChange={(e) => (instrument.activeProgram = parseInt(e.target.value as string, 10) - 1)}
          >
            {instrument.programs.map((program, index) => (
              <option key={program.title} value={index + 1}>
                {program.title}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
      {/* filter is used by CSS to draw disabled instruments */}
      <svg height="0" width="0">
        <filter id="gray-overlay">
          <feFlood id="gray-overlay-flood" floodColor="rgb(104,104,104)" />
          <feComposite in2="SourceAlpha" operator="in" k1="-8.8" />
        </filter>
      </svg>
    </div>
  );
});
