interface Props {
  children: React.ReactNode;
}

export function PanelLabel({ children }: Props) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '8.5px',
        letterSpacing: '3px',
        color: 'rgba(226,232,240,0.55)',
        textTransform: 'uppercase' as const,
      }}
    >
      {children}
    </div>
  );
}
