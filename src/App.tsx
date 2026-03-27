import { useState, useMemo, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDataLoader } from './hooks/useDataLoader';
import { getDataForYear, getGlobalStats } from './utils/dataParser';
import { GlobeVisualization } from './components/globe/GlobeVisualization';
import { Header } from './components/Header';
import { LeftPanel } from './components/panels/LeftPanel';
import { RightPanel } from './components/panels/RightPanel';
import { Controls } from './components/controls/Controls';
import { CountryDetailPanel } from './components/panels/CountryDetailPanel';
import type { SelectedCountry } from './types';

const VIGNETTE_STYLE: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(2,5,8,0.6) 100%),
    linear-gradient(to bottom, rgba(2,5,8,0.55) 0%, transparent 18%, transparent 72%, rgba(2,5,8,0.92) 100%)
  `,
};

function LoadingOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2,5,8,0.75)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="spin"
        style={{
          width: '38px',
          height: '38px',
          border: '2px solid rgba(34,197,94,0.2)',
          borderTopColor: '#22c55e',
          borderRadius: '50%',
          marginBottom: '16px',
        }}
      />
      <div
        style={{
          color: '#22c55e',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '3px',
        }}
      >
        LOADING GLOBE...
      </div>
    </div>
  );
}

export default function App() {
  const { data, loading } = useDataLoader();

  const minYear = data?.years[0] ?? 1990;
  const maxYear = data?.years[data.years.length - 1] ?? 2025;

  const [year, setYear] = useState(2000);
  const [playing, setPlaying] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (data) setYear((y) => Math.max(minYear, Math.min(maxYear, y)));
  }, [data, minYear, maxYear]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setYear((y) => {
          if (y >= maxYear) { setPlaying(false); return y; }
          return y + 1;
        });
      }, 700);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [playing, maxYear]);

  useEffect(() => {
    if (year >= maxYear && playing) setPlaying(false);
  }, [year, maxYear, playing]);

  const dataForYear = useMemo(
    () => (data ? getDataForYear(data, year) : new Map()),
    [data, year]
  );

  const globalStats = useMemo(() => getGlobalStats(year), [year]);

  const selectedCountry = useMemo<SelectedCountry | null>(() => {
    if (!selectedCode || !data) return null;
    let entity = selectedCode;
    for (const [name, code] of data.nameToCode) {
      if (code === selectedCode) { entity = name; break; }
    }
    const yearMap = data.byCode.get(selectedCode);
    if (!yearMap) return null;
    const history = Array.from(yearMap.entries())
      .map(([y, share]) => ({ year: y, share }))
      .sort((a, b) => a.year - b.year);
    return { code: selectedCode, entity, history };
  }, [selectedCode, data]);

  function togglePlay() {
    if (!playing && year >= maxYear) setYear(minYear);
    setPlaying((p) => !p);
  }

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#020508' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ ...VIGNETTE_STYLE, zIndex: 2 }} />

      <GlobeVisualization
        dataForYear={dataForYear}
        selectedCode={selectedCode}
        onCountrySelect={setSelectedCode}
        playing={playing}
      />

      <Header year={year} />

      <LeftPanel
        coverage={globalStats.coverage}
        lostSince2000={globalStats.lostSince2000}
        lossBarWidth={globalStats.lossBarWidth}
        coverageBarWidth={globalStats.coverageBarWidth}
      />

      <AnimatePresence mode="wait">
        {selectedCountry ? (
          <CountryDetailPanel
            key="detail"
            selected={selectedCountry}
            year={year}
            onClose={() => setSelectedCode(null)}
          />
        ) : (
          <RightPanel key="legend" />
        )}
      </AnimatePresence>

      <Controls
        year={year}
        minYear={minYear}
        maxYear={maxYear}
        playing={playing}
        onYearChange={setYear}
        onPlayToggle={togglePlay}
      />

      {loading && <LoadingOverlay />}
    </div>
  );
}
