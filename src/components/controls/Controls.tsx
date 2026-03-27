import { PlayButton } from './PlayButton';
import { YearSlider } from './YearSlider';

interface Props {
  year: number;
  minYear: number;
  maxYear: number;
  playing: boolean;
  onYearChange: (year: number) => void;
  onPlayToggle: () => void;
}

export function Controls({
  year,
  minYear,
  maxYear,
  playing,
  onYearChange,
  onPlayToggle,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '48px 24px 28px',
        background: 'linear-gradient(to top, rgba(2,5,8,0.9) 0%, transparent 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <PlayButton playing={playing} onClick={onPlayToggle} />
        <YearSlider
          year={year}
          minYear={minYear}
          maxYear={maxYear}
          onYearChange={onYearChange}
        />
      </div>
    </div>
  );
}
