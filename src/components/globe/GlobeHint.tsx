import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  visible: boolean;
}

export function GlobeHint({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ delay: 1.2 }}
          style={{ position: 'fixed', bottom: '80px', left: '50%', zIndex: 30 }}
          className="pointer-events-none"
        >
          <div
            style={{
              background: 'rgba(6,12,20,0.72)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              padding: '6px 18px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '2px',
                color: 'rgba(226,232,240,0.65)',
              }}
            >
              Click on a country to view details
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
