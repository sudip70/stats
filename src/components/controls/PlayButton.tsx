interface Props {
  playing: boolean;
  onClick: () => void;
}

export function PlayButton({ playing, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        background: playing ? 'rgba(248,113,113,0.1)' : 'rgba(34,197,94,0.12)',
        border: playing
          ? '1px solid rgba(248,113,113,0.4)'
          : '1px solid rgba(34,197,94,0.4)',
        color: playing ? '#f87171' : '#22c55e',
        padding: '9px 20px',
        borderRadius: '24px',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '2px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <span>{playing ? '⏸' : '▶'}</span>
      <span>{playing ? 'PAUSE' : 'PLAY'}</span>
    </button>
  );
}
