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
  if (!data) return 'rgba(26,42,28,0.4)';

  const rc = data.relativeChange;
  if (rc > 10) return 'rgba(6,78,59,0.85)';
  if (rc > 2) return 'rgba(21,128,61,0.85)';
  if (rc > -2) return 'rgba(22,163,74,0.8)';
  if (rc > -10) return 'rgba(180,83,9,0.85)';
  if (rc > -25) return 'rgba(194,65,12,0.85)';
  return 'rgba(153,27,27,0.85)';
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
