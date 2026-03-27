import type { ProcessedData, CountryYearData } from '../types';

/**
 * Returns a Map<code, CountryYearData> for the given year.
 */
export function getDataForYear(
  data: ProcessedData,
  year: number
): Map<string, CountryYearData> {
  const result = new Map<string, CountryYearData>();

  for (const [code, yearMap] of data.byCode) {
    const share = yearMap.get(year);
    const share1990 = yearMap.get(1990);

    if (share == null || share1990 == null) continue;

    const relativeChange =
      share1990 !== 0 ? ((share - share1990) / share1990) * 100 : 0;

    result.set(code, { code, share, share1990, relativeChange });
  }

  return result;
}

/**
 * Returns a color string based on the country's relative change and selection state.
 */
export function getCountryColor(
  data: CountryYearData | undefined,
  isSelected: boolean
): string {
  if (isSelected) return 'rgba(255,255,255,0.95)';
  if (!data) return 'rgba(30,58,38,0.55)';       // slate-ish dark green

  const rc = data.relativeChange;
  if (rc > 10)  return 'rgba(5,150,105,0.88)';   // emerald-600
  if (rc > 2)   return 'rgba(22,163,74,0.88)';   // green-600
  if (rc > -2)  return 'rgba(34,197,94,0.82)';   // green-500
  if (rc > -10) return 'rgba(245,158,11,0.85)';  // amber-500
  if (rc > -25) return 'rgba(234,88,12,0.85)';   // orange-600
  return 'rgba(220,38,38,0.85)';                  // red-600
}

/**
 * Returns an altitude value based on the country's relative change and selection state.
 */
export function getCountryAltitude(
  data: CountryYearData | undefined,
  isSelected: boolean
): number {
  if (isSelected) return 0.06;
  if (!data) return 0.003;

  const rc = data.relativeChange;
  if (rc < -25) return 0.015;
  if (rc < -10) return 0.01;
  return 0.005;
}

/**
 * Returns global forest coverage statistics for a given year.
 */
export function getGlobalStats(year: number): {
  coverage: string;
  lostSince2000: string;
  lossBarWidth: number;
  coverageBarWidth: number;
} {
  const yp = year - 2000;
  const coverageNum = Math.max(0, 31.6 - yp * 0.04);
  const lostNum = Math.max(0, yp * 0.2);

  const coverage = coverageNum.toFixed(1);
  const lostSince2000 = lostNum.toFixed(1);
  const lossBarWidth = Math.min((lostNum / 5.0) * 100, 100);
  const coverageBarWidth = coverageNum;

  return { coverage, lostSince2000, lossBarWidth, coverageBarWidth };
}
