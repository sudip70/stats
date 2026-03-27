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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px 0',
      }}
    >
      {/* Brand */}
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

      {/* Year display */}
      <div style={{ textAlign: 'center' }}>
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
            fontSize: '72px',
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

      {/* Live badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '2px',
          color: '#22c55e',
          border: '1px solid rgba(34,197,94,0.3)',
          padding: '5px 12px',
          borderRadius: '20px',
          background: 'rgba(34,197,94,0.06)',
        }}
      >
        <span
          className="pulse-dot"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            flexShrink: 0,
          }}
        />
        LIVE DATA
      </div>
    </motion.header>
  );
}
