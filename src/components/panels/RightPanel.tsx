import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';
import { LAYER_MAP } from '../../config/layers';
import type { LayerId } from '../../types';

interface Props {
  activeLayer: LayerId;
}

export function RightPanel({ activeLayer }: Props) {
  const config = LAYER_MAP.get(activeLayer)!;

  return (
    <div>
      <motion.aside
        key={activeLayer}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <PanelShell style={{ width: '178px' }}>
          {/* Title */}
          <div style={{ marginBottom: '12px' }}>
            <PanelLabel>{config.legendTitle}</PanelLabel>
            <div style={{ marginTop: '8px' }}>
              <SectionDivider gradient />
            </div>
          </div>

          {/* Legend items — color + text in same row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {config.legendItems.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{
                  width: '12px', height: '12px', borderRadius: '2px', flexShrink: 0,
                  background: item.color, border: '1px solid rgba(255,255,255,0.08)',
                }} />
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600,
                  color: '#e2e8f0', flex: 1,
                }}>
                  {item.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px',
                  color: 'rgba(226,232,240,0.45)', whiteSpace: 'nowrap',
                }}>
                  {item.range}
                </span>
              </div>
            ))}
          </div>

          {/* No-data indicator */}
          <div style={{ marginTop: '12px' }}>
            <SectionDivider />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
            <div style={{
              width: '12px', height: '12px', borderRadius: '2px', flexShrink: 0,
              background: 'rgba(20,32,42,0.55)', border: '1px solid rgba(255,255,255,0.08)',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              color: 'rgba(226,232,240,0.4)',
            }}>
              No data
            </span>
          </div>
        </PanelShell>
      </motion.aside>
    </div>
  );
}
