import { motion } from 'framer-motion';

interface Props {
  year: number;
}

export function Header({ year }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        padding: '20px 28px 0',
      }}
    >
      {/* Left + right anchored with flexbox, center absolutely positioned */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Brand — left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '2px',
            color: 'rgba(226,232,240,0.55)',
            textTransform: 'uppercase',
            paddingTop: '6px',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
              flexShrink: 0,
            }}
          />
          Earth Observatory
        </div>

        <div />
      </div>

      {/* Year — truly centered via absolute */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '4px',
            color: 'rgba(226,232,240,0.55)',
            marginBottom: '2px',
          }}
        >
          MONITORING YEAR
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '64px',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-2px',
            background: 'linear-gradient(160deg, #ffffff 30%, #4ade80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {year}
        </div>
      </div>
    </motion.header>
  );
}