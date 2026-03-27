interface Props {
  value: string;
  unit: string;
  label: string;
  color: string;
  barWidth?: number;
  barColor?: string;
}

export function StatBlock({ value, unit, label, color, barWidth, barColor }: Props) {
  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '3px' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: 1,
            color,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'rgba(226,232,240,0.55)',
            marginBottom: '1px',
          }}
        >
          {unit}
        </div>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '1px',
          color: 'rgba(226,232,240,0.55)',
          marginBottom: barWidth !== undefined ? '7px' : 0,
        }}
      >
        {label}
      </div>

      {barWidth !== undefined && (
        <div
          style={{
            height: '3px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: '2px',
              background: barColor ?? color,
              width: `${barWidth}%`,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      )}
    </div>
  );
}
