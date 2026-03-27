import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';
import { HistoryChart } from '../charts/HistoryChart';
import type { SelectedCountry } from '../../types';

interface Props {
  selected: SelectedCountry;
  year: number;
  onClose: () => void;
}

export function CountryDetailPanel({ selected, year, onClose }: Props) {
  const currentEntry = selected.history.find((h) => h.year === year);
  const entry1990 = selected.history.find((h) => h.year === 1990);

  const currentShare = currentEntry?.share ?? null;
  const share1990 = entry1990?.share ?? null;

  const changeSince1990 =
    currentShare != null && share1990 != null && share1990 !== 0
      ? ((currentShare - share1990) / share1990) * 100
      : null;

  const changeColor =
    changeSince1990 == null
      ? 'rgba(226,232,240,0.55)'
      : changeSince1990 >= 0
      ? '#4ade80'
      : '#f87171';

  const changeStr =
    changeSince1990 == null
      ? '—'
      : changeSince1990 >= 0
      ? `+${changeSince1990.toFixed(1)}%`
      : `${changeSince1990.toFixed(1)}%`;

  const chartData = selected.history
    .filter((h) => h.share != null)
    .map((h) => ({ year: h.year, share: parseFloat(h.share.toFixed(4)) }));

  return (
    // Outer div owns the fixed centering — untouched by framer-motion
    <div
      style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
      }}
    >
      {/* Inner motion element owns only the slide-in animation */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        <PanelShell
          style={{
            width: '220px',
            maxHeight: 'calc(100vh - 160px)',
            overflowY: 'auto',
            background: 'rgba(6,12,20,0.92)',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'rgba(226,232,240,0.55)',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'background 0.15s',
            }}
          >
            ✕
          </button>

          {/* Country name */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: '#4ade80',
              lineHeight: 1.2,
              marginBottom: '3px',
              paddingRight: '28px',
            }}
          >
            {selected.entity}
          </div>

          {/* ISO code */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '2px',
              color: 'rgba(226,232,240,0.55)',
              marginBottom: '16px',
            }}
          >
            {selected.code}
          </div>

          <div style={{ marginBottom: '14px' }}>
            <SectionDivider />
          </div>

          {/* Forest share */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '4px' }}>
              <PanelLabel>Forest Share {year}</PanelLabel>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 700,
                color: '#e2e8f0',
                lineHeight: 1,
              }}
            >
              {currentShare != null ? `${currentShare.toFixed(3)}%` : '—'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'rgba(226,232,240,0.55)',
                marginTop: '2px',
              }}
            >
              of global forests
            </div>
          </div>

          {/* Change since 1990 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '4px' }}>
              <PanelLabel>Change Since 1990</PanelLabel>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 700,
                color: changeColor,
                lineHeight: 1,
              }}
            >
              {changeStr}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <SectionDivider />
          </div>

          {/* Historical chart */}
          {chartData.length > 1 && (
            <>
              <div style={{ marginBottom: '8px' }}>
                <PanelLabel>Historical Trend</PanelLabel>
              </div>
              <HistoryChart data={chartData} currentYear={year} />
            </>
          )}
        </PanelShell>
      </motion.div>
    </div>
  );
}
