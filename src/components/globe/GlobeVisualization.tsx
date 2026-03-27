import { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import type { CountryYearData } from '../../types';
import { getCountryColor, getCountryAltitude } from '../../utils/dataParser';
import { GlobeHint } from './GlobeHint';

interface Props {
  dataForYear: Map<string, CountryYearData>;
  selectedCode: string | null;
  onCountrySelect: (code: string | null) => void;
  playing: boolean;
}

const GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

const GLOBE_MATERIAL = {
  color: '#020508',
  emissive: '#020508',
  emissiveIntensity: 0.1,
  shininess: 0.1,
  opacity: 1,
  transparent: false,
};

export function GlobeVisualization({
  dataForYear,
  selectedCode,
  onCountrySelect,
  playing,
}: Props) {
  const globeEl = useRef<any>(null);
  const [countries, setCountries] = useState<{ features: any[] }>({ features: [] });

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load GeoJSON');
        return res.json();
      })
      .then(setCountries)
      .catch((err) => console.error('GeoJSON load error:', err));
  }, []);

  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = !selectedCode && !playing;
    controls.autoRotateSpeed = 0.3;
  }, [selectedCode, playing]);

  const getColor = useCallback(
    (feature: any) => {
      const code: string = feature.properties?.ISO_A3 ?? '';
      return getCountryColor(dataForYear.get(code), code === selectedCode);
    },
    [dataForYear, selectedCode]
  );

  const getAltitude = useCallback(
    (feature: any) => {
      const code: string = feature.properties?.ISO_A3 ?? '';
      return getCountryAltitude(dataForYear.get(code), code === selectedCode);
    },
    [dataForYear, selectedCode]
  );

  const getLabel = useCallback(
    (feature: any) => {
      const props = feature.properties ?? {};
      const code: string = props.ISO_A3 ?? '';
      const name: string = props.ADMIN ?? props.NAME ?? code;
      const d = dataForYear.get(code);

      const shareStr = d ? `${d.share.toFixed(3)}%` : 'No data';
      const changeStr = d
        ? d.relativeChange >= 0
          ? `<span style="color:#4ade80">+${d.relativeChange.toFixed(1)}%</span>`
          : `<span style="color:#f87171">${d.relativeChange.toFixed(1)}%</span>`
        : '<span style="color:rgba(226,232,240,0.55)">—</span>';

      return `
        <div style="
          background: rgba(6,12,20,0.92);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 10px 14px;
          min-width: 160px;
          backdrop-filter: blur(12px);
          font-family: var(--font-mono);
        ">
          <div style="color:#4ade80; font-size:13px; font-weight:600; margin-bottom:6px; font-family:var(--font-display);">${name}</div>
          <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:3px;">
            <span style="color:rgba(226,232,240,0.55);">Forest share</span>
            <span style="color:#e2e8f0;">${shareStr}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:10px;">
            <span style="color:rgba(226,232,240,0.55);">Since 1990</span>
            ${changeStr}
          </div>
        </div>
      `;
    },
    [dataForYear]
  );

  const handlePolygonClick = useCallback(
    (
      feature: any,
      _event: MouseEvent,
      coords: { lat: number; lng: number; altitude: number }
    ) => {
      const code: string = feature.properties?.ISO_A3 ?? '';
      if (!code) return;

      const next = code === selectedCode ? null : code;
      onCountrySelect(next);

      if (next && globeEl.current) {
        globeEl.current.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 2.5 }, 1000);
      }
    },
    [selectedCode, onCountrySelect]
  );

  return (
    <div className="fixed inset-0 bg-[#020508] globe-container">
      <Globe
        ref={globeEl}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={GLOBE_MATERIAL}
        atmosphereColor="rgba(192,106,16,0.25)"
        atmosphereAltitude={0.15}
        polygonsData={countries.features}
        polygonAltitude={getAltitude}
        polygonCapColor={getColor}
        polygonSideColor={() => 'rgba(0,0,0,0.7)'}
        polygonStrokeColor={() => 'rgba(34,197,94,0.08)'}
        polygonLabel={getLabel}
        onPolygonClick={handlePolygonClick}
        polygonsTransitionDuration={400}
        animateIn={true}
        enablePointerInteraction={true}
      />
      <GlobeHint visible={!selectedCode} />
    </div>
  );
}
