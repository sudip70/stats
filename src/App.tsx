import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDataLoader } from './hooks/useDataLoader';
import { getDataForYear } from './utils/dataParser';
import { GlobeVisualization } from './components/globe/GlobeVisualization';
import { Header } from './components/Header';
import { LeftPanel } from './components/panels/LeftPanel';
import { RightPanel } from './components/panels/RightPanel';
import { Controls } from './components/controls/Controls';
import { LayerSwitcher } from './components/controls/LayerSwitcher';
import { CountryDetailPanel } from './components/panels/CountryDetailPanel';
import { ErrorOverlay } from './components/ErrorOverlay';
import type { SelectedCountry, LayerId } from './types';

const VIGNETTE_STYLE: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(2,5,8,0.6) 100%),
    linear-gradient(to bottom, rgba(2,5,8,0.55) 0%, transparent 18%, transparent 72%, rgba(2,5,8,0.92) 100%)
  `,
};

function LoadingOverlay() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(2,5,8,0.75)', backdropFilter: 'blur(4px)',
    }}>
      <div className="spin" style={{
        width: '38px', height: '38px',
        border: '2px solid rgba(34,197,94,0.2)', borderTopColor: '#22c55e',
        borderRadius: '50%', marginBottom: '16px',
      }} />
      <div style={{ color: '#22c55e', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px' }}>
        LOADING DATA...
      </div>
    </div>
  );
}

export default function App() {
  const { data, loading, error, retry } = useDataLoader();

  const [activeLayer, setActiveLayer] = useState<LayerId>('population');
  const [year, setYear] = useState(2025);
  const [playing, setPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Layer-aware year bounds
  const activeLayerData = useMemo(
    () => data?.layers.get(activeLayer),
    [data, activeLayer]
  );
  const minYear = activeLayerData?.years[0] ?? 1990;
  const maxYear = activeLayerData?.years.slice(-1)[0] ?? 2025;

  // Snap to 2025 for population/forest, max year for everything else
  const handleLayerChange = useCallback((newLayer: LayerId) => {
    setActiveLayer(newLayer);
    if (newLayer === 'population' || newLayer === 'forest') {
      setYear(2025);
    } else {
      const ld = data?.layers.get(newLayer);
      if (ld) setYear(ld.years.slice(-1)[0]);
    }
  }, [data]);

  // Clamp year when data loads
  useEffect(() => {
    if (activeLayerData) {
      const lo = activeLayerData.years[0];
      const hi = activeLayerData.years.slice(-1)[0];
      setYear((y) => Math.max(lo, Math.min(hi, y)));
    }
  }, [activeLayerData]);

  // Playback
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setYear((y) => {
          if (y >= maxYear) { setPlaying(false); return y; }
          return y + 1;
        });
      }, Math.round(700 / playSpeed));
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [playing, maxYear, playSpeed]);

  useEffect(() => {
    if (year >= maxYear && playing) setPlaying(false);
  }, [year, maxYear, playing]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'Escape') setSelectedCode(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const dataForYear = useMemo(
    () => (data ? getDataForYear(data, activeLayer, year) : new Map()),
    [data, activeLayer, year]
  );

  const selectedCountry = useMemo<SelectedCountry | null>(() => {
    if (!selectedCode || !data) return null;
    const entity = data.codeToName.get(selectedCode) ?? selectedCode;
    const region = data.regions.get(selectedCode);
    return { code: selectedCode, entity, region };
  }, [selectedCode, data]);

  function togglePlay() {
    if (!playing && year >= maxYear) setYear(minYear);
    setPlaying((p) => !p);
  }

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#000000' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ ...VIGNETTE_STYLE, zIndex: 2 }} />

      <GlobeVisualization
        dataForYear={dataForYear}
        activeLayer={activeLayer}
        selectedCode={selectedCode}
        onCountrySelect={setSelectedCode}
        playing={playing}
        year={year}
      />

      <Header year={year} />

      {/* Left center: layer category switcher */}
      <div style={{
        position: 'fixed',
        left: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
      }}>
        <LayerSwitcher activeLayer={activeLayer} onChange={handleLayerChange} />
      </div>

      {/* Right-middle: stats panel + legend/detail stacked */}
      <div style={{
        position: 'fixed',
        top: '50%',
        right: '24px',
        transform: 'translateY(-50%)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
      }}>
        <LeftPanel activeLayer={activeLayer} data={data} year={year} />

        <AnimatePresence mode="wait">
          {selectedCountry && data ? (
            <CountryDetailPanel
              key="detail"
              selected={selectedCountry}
              data={data}
              activeLayer={activeLayer}
              year={year}
              onClose={() => setSelectedCode(null)}
            />
          ) : (
            <RightPanel key={`legend-${activeLayer}`} activeLayer={activeLayer} />
          )}
        </AnimatePresence>
      </div>

      <Controls
        year={year}
        minYear={minYear}
        maxYear={maxYear}
        playing={playing}
        playSpeed={playSpeed}
        onYearChange={setYear}
        onPlayToggle={togglePlay}
        onSpeedChange={setPlaySpeed}
      />

      {loading && <LoadingOverlay />}
      {error && !loading && <ErrorOverlay message={error} onRetry={retry} />}
    </div>
  );
}