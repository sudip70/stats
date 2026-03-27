import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import type { ProcessedData, ForestRow } from '../types';

export function useDataLoader() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const response = await fetch(`${import.meta.env.BASE_URL}share-global-forest.csv`);
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();

        const result = await new Promise<ForestRow[]>((resolve, reject) => {
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
              const rows: ForestRow[] = [];
              for (const raw of results.data as Record<string, unknown>[]) {
                const code = raw['Code'] as string;
                if (!code || !/^[A-Z]{3}$/.test(code)) continue;
                const entity = raw['Entity'] as string;
                const year = raw['Year'] as number;
                const share = raw['Share of global forest area'] as number;
                if (!entity || !year || share == null) continue;
                rows.push({ entity, code, year, share });
              }
              resolve(rows);
            },
            error: (err: Error) => reject(err),
          });
        });

        // Build byCode: code -> year -> share
        const byCode = new Map<string, Map<number, number>>();
        const nameToCode = new Map<string, string>();
        const yearSet = new Set<number>();

        for (const row of result) {
          if (!byCode.has(row.code)) {
            byCode.set(row.code, new Map());
          }
          byCode.get(row.code)!.set(row.year, row.share);
          nameToCode.set(row.entity, row.code);
          yearSet.add(row.year);
        }

        const years = Array.from(yearSet).sort((a, b) => a - b);

        setData({ rows: result, byCode, nameToCode, years });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { data, loading, error };
}
