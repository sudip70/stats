import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';

const LEGEND_ITEMS = [
  { color: '#059669', name: 'Strong Gain',     range: '> +10%'    },
  { color: '#16a34a', name: 'Gaining',          range: '0 – +10%'  },
  { color: '#22c55e', name: 'Stable',           range: '±2%'       },
  { color: '#f59e0b', name: 'Moderate Loss',    range: '-10 – 0%'  },
  { color: '#ea580c', name: 'Significant Loss', range: '-10 – -25%'},
  { color: '#dc2626', name: 'Critical Loss',    range: '< -25%'    },
] as const;

function LegendItem({ color, name, range }: { color: string; name: string; range: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '7px',
          flexShrink: 0,
          background: color,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      />
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#e2e8f0',
            lineHeight: 1.2,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'rgba(226,232,240,0.55)',
            marginTop: '1px',
          }}
        >
          {range}
        </div>
      </div>
    </div>
  );
}

export function RightPanel() {
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
      <motion.aside
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        <PanelShell style={{ width: '172px' }}>
          <div style={{ marginBottom: '18px' }}>
            <PanelLabel>Forest Change Index</PanelLabel>
            <div style={{ marginTop: '8px' }}>
              <SectionDivider gradient />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {LEGEND_ITEMS.map((item) => (
              <LegendItem key={item.name} {...item} />
            ))}
          </div>
        </PanelShell>
      </motion.aside>
    </div>
  );
}
