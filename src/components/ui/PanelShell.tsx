interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function PanelShell({ children, style }: Props) {
  return (
    <div
      style={{
        background: 'rgba(6,12,20,0.72)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
