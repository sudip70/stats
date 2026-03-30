import { PlayButton } from './PlayButton';
import { YearSlider } from './YearSlider';
import type { LayerId } from '../../types';

const SPEED_OPTIONS = [0.5, 1, 2, 4] as const;
type SpeedOption = typeof SPEED_OPTIONS[number];

interface Props {
  year: number;
  minYear: number;
  maxYear: number;
  playing: boolean;
  playSpeed: number;
  onYearChange: (year: number) => void;
  onPlayToggle: () => void;
  onSpeedChange: (speed: number) => void;
}

export function Controls({
  year,
  minYear,
  maxYear,
  playing,
  playSpeed,
  onYearChange,
  onPlayToggle,
  onSpeedChange,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '40px 24px 24px',
        background: 'linear-gradient(to top, rgba(2,5,8,0.95) 0%, transparent 100%)',
      }}
    >
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
        }}
      >
        {/* Speed selector centered above play+slider row */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.3)',
              marginRight: '2px',
            }}>SPEED</span>
            {SPEED_OPTIONS.map((s) => {
              const active = playSpeed === s;
              return (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  style={{
                    background: active ? 'rgba(34,197,94,0.15)' : 'transparent',
                    border: active ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    color: active ? '#22c55e' : 'rgba(255,255,255,0.35)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                  }}
                >
                  {s === 0.5 ? '½×' : `${s}×`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Play + slider row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <PlayButton playing={playing} onClick={onPlayToggle} />
          <div style={{ flex: 1 }}>
            <YearSlider
              year={year}
              minYear={minYear}
              maxYear={maxYear}
              onYearChange={onYearChange}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
