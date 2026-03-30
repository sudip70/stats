import type { ProcessedData, CountryYearData, LayerId } from '../types';

// Soft caps for normalisation — values above these get clamped to 1
const LAYER_SOFT_MAX: Partial<Record<LayerId, number>> = {
  co2: 20,
  energy: 20000,
  hdi: 1,
};

// Log-normalise population (max ~1.45B, China/India)
const POP_LOG_MAX = Math.log10(1.5e9);

export function getDataForYear(
  data: ProcessedData,
  layerId: LayerId,
  year: number
): Map<string, CountryYearData> {
  const result = new Map<string, CountryYearData>();
  const layerData = data.layers.get(layerId);
  if (!layerData) return result;

  for (const [code, yearMap] of layerData.byCode) {
    const rawValue = yearMap.get(year);
    if (rawValue == null) continue;

    let colorValue: number;

    if (layerId === 'forest') {
      const base = yearMap.get(1990);
      if (base == null || base === 0) continue;
      colorValue = ((rawValue - base) / base) * 100; // relativeChange %
    } else if (layerId === 'population') {
      colorValue = Math.log10(Math.max(1, rawValue)) / POP_LOG_MAX;
    } else {
      const softMax = LAYER_SOFT_MAX[layerId] ?? layerData.globalMax;
      colorValue = softMax > 0 ? Math.max(0, Math.min(1, rawValue / softMax)) : 0;
    }

    result.set(code, { code, rawValue, colorValue });
  }

  return result;
}

export function getCountryColor(
  d: CountryYearData | undefined,
  layerId: LayerId,
  isSelected: boolean
): string {
  if (isSelected) return 'rgba(255,255,255,0.95)';
  if (!d) return 'rgba(20,32,42,0.55)';

  const cv = d.colorValue;

  switch (layerId) {
    case 'forest': {
      if (cv > 10)  return 'rgba(5,150,105,0.88)';
      if (cv > 2)   return 'rgba(22,163,74,0.88)';
      if (cv > -2)  return 'rgba(34,197,94,0.82)';
      if (cv > -10) return 'rgba(245,158,11,0.85)';
      if (cv > -25) return 'rgba(234,88,12,0.85)';
      return 'rgba(220,38,38,0.85)';
    }
    case 'co2': {
      // lower = better → green → red
      if (cv < 0.05) return 'rgba(34,197,94,0.85)';
      if (cv < 0.15) return 'rgba(132,204,22,0.85)';
      if (cv < 0.35) return 'rgba(234,179,8,0.85)';
      if (cv < 0.75) return 'rgba(249,115,22,0.85)';
      return 'rgba(220,38,38,0.85)';
    }
    case 'energy': {
      // blue palette by consumption
      if (cv < 0.025) return 'rgba(186,230,253,0.85)';
      if (cv < 0.1)   return 'rgba(56,189,248,0.85)';
      if (cv < 0.25)  return 'rgba(2,132,199,0.88)';
      if (cv < 0.75)  return 'rgba(29,78,216,0.88)';
      return 'rgba(79,70,229,0.9)';
    }
    case 'hdi': {
      // higher = better → red → green (raw value, 0–1)
      const v = d.rawValue;
      if (v < 0.55) return 'rgba(220,38,38,0.85)';
      if (v < 0.65) return 'rgba(249,115,22,0.85)';
      if (v < 0.75) return 'rgba(234,179,8,0.85)';
      if (v < 0.85) return 'rgba(132,204,22,0.85)';
      return 'rgba(22,163,74,0.88)';
    }
    case 'population': {
      // light mint → teal → dark navy (OWID style choropleth)
      // thresholds match legend: < 10M, 10–30M, 30–100M, 100–300M, > 300M
      // cv = log10(pop) / log10(1.5e9); breakpoints: 10M→0.763, 30M→0.815, 100M→0.872, 300M→0.924
      if (cv < 0.763) return 'rgba(213,241,228,0.80)';
      if (cv < 0.815) return 'rgba(132,210,188,0.84)';
      if (cv < 0.872) return 'rgba(62,171,173,0.88)';
      if (cv < 0.924) return 'rgba(30,115,161,0.90)';
      return 'rgba(10,51,107,0.93)';
    }
    default:
      return 'rgba(34,197,94,0.82)';
  }
}

export function getCountryAltitude(
  d: CountryYearData | undefined,
  layerId: LayerId,
  isSelected: boolean
): number {
  if (isSelected) return 0.06;
  if (!d) return 0.003;
  if (layerId === 'forest') {
    const rc = d.colorValue;
    if (rc < -25) return 0.015;
    if (rc < -10) return 0.01;
  }
  return 0.005;
}