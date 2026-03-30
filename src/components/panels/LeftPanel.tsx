import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';
import { StatBlock } from '../ui/StatBlock';
import { getLayerStats } from '../../utils/layerStats';
import { LAYER_MAP } from '../../config/layers';
import type { ProcessedData, LayerId } from '../../types';

interface Props {
  activeLayer: LayerId;
  data: ProcessedData | null;
  year: number;
}

export function LeftPanel({ activeLayer, data, year }: Props) {
  const config = LAYER_MAP.get(activeLayer)!;

  const stats = useMemo(() => {
    if (!data) return null;
    return getLayerStats(activeLayer, data, year);
  }, [activeLayer, data, year]);

  return (
    <div>
      <motion.aside
        key={activeLayer}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <PanelShell style={{ width: '172px' }}>
          <div style={{ marginBottom: '18px' }}>
            <PanelLabel>
              <config.Icon size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
              {config.label}
            </PanelLabel>
            <div style={{ marginTop: '8px' }}>
              <SectionDivider gradient />
            </div>
          </div>

          {stats ? (
            <>
              <StatBlock
                value={stats.primary.value}
                unit={stats.primary.unit}
                label={stats.primary.label}
                color={stats.primary.color}
                barWidth={stats.primary.barWidth}
                barColor={stats.primary.barColor}
              />

              <div style={{ margin: '14px 0' }}>
                <SectionDivider />
              </div>

              <StatBlock
                value={stats.secondary.value}
                unit={stats.secondary.unit}
                label={stats.secondary.label}
                color={stats.secondary.color}
                barWidth={stats.secondary.barWidth}
                barColor={stats.secondary.barColor}
              />

              <div style={{ margin: '14px 0' }}>
                <SectionDivider />
              </div>

              <StatBlock
                value={stats.tertiary.value}
                unit={stats.tertiary.unit}
                label={stats.tertiary.label}
                color={stats.tertiary.color}
              />
            </>
          ) : (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              color: 'rgba(226,232,240,0.3)', letterSpacing: '1px',
            }}>
              Loading...
            </div>
          )}
        </PanelShell>
      </motion.aside>
    </div>
  );
}