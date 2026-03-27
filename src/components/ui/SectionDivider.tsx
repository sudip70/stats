interface Props {
  gradient?: boolean;
}

export function SectionDivider({ gradient }: Props) {
  return (
    <div
      style={{
        height: '1px',
        background: gradient
          ? 'linear-gradient(to right, rgba(255,255,255,0.14), transparent)'
          : 'rgba(255,255,255,0.07)',
      }}
    />
  );
}
