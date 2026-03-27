const TICKS = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];

interface Props {
  year: number;
  minYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
}

export function YearSlider({ year, minYear, maxYear, onYearChange }: Props) {
  const range = maxYear - minYear;
  const progress = range > 0 ? ((year - minYear) / range) * 100 : 0;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ position: 'relative', height: '4px', marginBottom: '8px' }}>
        {/* Track */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '2px',
          }}
        />
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress}%`,
            background: 'linear-gradient(to right, #15803d, #22c55e)',
            borderRadius: '2px',
            pointerEvents: 'none',
            transition: 'width 0.15s',
          }}
        />
        {/* Input */}
        <input
          type="range"
          className="slider-input"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '4px' }}
        />
      </div>

      {/* Tick labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '1px',
          color: 'rgba(226,232,240,0.55)',
        }}
      >
        {TICKS.filter((t) => t >= minYear && t <= maxYear).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
