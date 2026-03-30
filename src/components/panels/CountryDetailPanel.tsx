import { useMemo } from 'react';
import { FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';
import { HistoryChart } from '../charts/HistoryChart';
import { LAYER_MAP, POPULATION_PROJECTION_START } from '../../config/layers';
import type { ProcessedData, SelectedCountry, LayerId } from '../../types';

interface Props {
  selected: SelectedCountry;
  data: ProcessedData;
  activeLayer: LayerId;
  year: number;
  onClose: () => void;
}

export function CountryDetailPanel({ selected, data, activeLayer, year, onClose }: Props) {
  const config = LAYER_MAP.get(activeLayer)!;

  const { currentValue, baselineYear, baselineValue, chartData } = useMemo(() => {
    const layerData = data.layers.get(activeLayer);
    const yearMap = layerData?.byCode.get(selected.code);

    if (!yearMap) return { currentValue: null, baselineYear: null, baselineValue: null, chartData: [] };

    const cv = yearMap.get(year) ?? null;

    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);
    const by = sortedYears[0] ?? null;
    const bv = by != null ? (yearMap.get(by) ?? null) : null;

    const cd = sortedYears.map((y) => ({ year: y, value: yearMap.get(y)! }));

    return { currentValue: cv, baselineYear: by, baselineValue: bv, chartData: cd };
  }, [data, activeLayer, selected.code, year]);

  const changePct = useMemo(() => {
    if (currentValue == null || baselineValue == null || baselineValue === 0) return null;
    return ((currentValue - baselineValue) / Math.abs(baselineValue)) * 100;
  }, [currentValue, baselineValue]);

  const isProjected = activeLayer === 'population' && year >= POPULATION_PROJECTION_START;

  const changeColor =
    changePct == null ? 'rgba(226,232,240,0.55)'
    : activeLayer === 'forest' || activeLayer === 'hdi'
      ? changePct >= 0 ? '#4ade80' : '#f87171'   // higher = better
      : changePct <= 0 ? '#4ade80' : '#f87171';   // lower = better (co2, poverty, etc.)

  const changeStr =
    changePct == null ? '—'
    : changePct >= 0 ? `+${changePct.toFixed(1)}%`
    : `${changePct.toFixed(1)}%`;

  return (
    <div>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        <PanelShell style={{
          width: '220px',
          maxHeight: 'calc(100vh - 160px)',
          overflowY: 'auto',
          background: 'rgba(6,12,20,0.92)',
          position: 'relative',
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px', color: 'rgba(226,232,240,0.55)',
              width: '24px', height: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '12px', transition: 'background 0.15s',
            }}
          >
            <FiX size={12} />
          </button>

          {/* Country name */}
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700,
            color: config.chartColor, lineHeight: 1.2,
            marginBottom: '2px', paddingRight: '28px',
          }}>
            {selected.entity}
          </div>

          {/* Code + region */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
            color: 'rgba(226,232,240,0.4)', marginBottom: '4px',
          }}>
            {selected.code}
            {selected.region && (
              <span style={{ marginLeft: '6px', letterSpacing: '1px' }}>
                · {selected.region}
              </span>
            )}
          </div>

          {/* Active layer badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            marginBottom: '14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '2px 8px',
          }}>
            <config.Icon size={10} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '8px',
              letterSpacing: '1px', color: 'rgba(226,232,240,0.55)',
            }}>
              {config.label.toUpperCase()}
            </span>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <SectionDivider />
          </div>

          {/* Current value */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '4px' }}>
              <PanelLabel>
                {config.label} {year}{isProjected ? ' *' : ''}
              </PanelLabel>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
              color: '#e2e8f0', lineHeight: 1,
            }}>
              {currentValue != null ? config.formatValue(currentValue) : '—'}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              color: 'rgba(226,232,240,0.4)', marginTop: '3px',
            }}>
              {isProjected ? '* UN projection' : config.unit}
            </div>
          </div>

          {/* Change since baseline */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '4px' }}>
              <PanelLabel>Change Since {baselineYear ?? '—'}</PanelLabel>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
              color: changeColor, lineHeight: 1,
            }}>
              {changeStr}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <SectionDivider />
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <>
              <div style={{ marginBottom: '8px' }}>
                <PanelLabel>Historical Trend</PanelLabel>
              </div>
              <HistoryChart
                data={chartData}
                currentYear={year}
                lineColor={config.chartColor}
                formatValue={config.formatValue}
                projectionStartYear={config.projectionStartYear}
              />
            </>
          )}
        </PanelShell>
      </motion.div>
    </div>
  );
}