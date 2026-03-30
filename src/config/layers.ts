import type { IconType } from 'react-icons';
import { FiUsers, FiZap, FiTrendingUp, FiWind } from 'react-icons/fi';
import { FaTree } from 'react-icons/fa';
import type { LayerId } from '../types';

export { FiUsers, FiZap, FiTrendingUp, FiWind, FaTree };

export interface LegendBucket {
  color: string;
  name: string;
  range: string;
}

export interface LayerConfig {
  id: LayerId;
  label: string;
  Icon: IconType;
  group: 'environment' | 'society' | 'development';
  unit: string;
  fileName: string;
  valueColumn: string;
  legendTitle: string;
  legendItems: LegendBucket[];
  colorMode: 'forest-relative' | 'lower-better' | 'higher-better' | 'population' | 'energy';
  projectionStartYear?: number;
  minYearFilter?: number;
  formatValue: (v: number) => string;
  chartColor: string;
}

export const POPULATION_PROJECTION_START = 2024;

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    id: 'population',
    label: 'Population',
    Icon: FiUsers,
    group: 'society',
    unit: 'people',
    fileName: 'population-with-un-projections.csv',
    valueColumn: 'Population, total',
    colorMode: 'population',
    chartColor: '#2d9d8f',
    projectionStartYear: POPULATION_PROJECTION_START,
    legendTitle: 'Total Population',
    formatValue: (v) => {
      if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
      if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
      return `${Math.round(v / 1000)}K`;
    },
    legendItems: [
      { color: 'rgba(213,241,228,0.85)', name: 'Micro',   range: '< 10M' },
      { color: 'rgba(132,210,188,0.87)', name: 'Small',   range: '10 – 30M' },
      { color: 'rgba(62,171,173,0.88)',  name: 'Medium',  range: '30 – 100M' },
      { color: 'rgba(30,115,161,0.90)',  name: 'Large',   range: '100 – 300M' },
      { color: 'rgba(10,51,107,0.93)',   name: 'Huge',    range: '> 300M' },
    ],
  },
  {
    id: 'forest',
    label: 'Forest',
    Icon: FaTree,
    group: 'environment',
    unit: '% of global forest',
    fileName: 'share-global-forest.csv',
    valueColumn: 'Share of global forest area',
    colorMode: 'forest-relative',
    chartColor: '#22c55e',
    legendTitle: 'Forest Change Since 1990',
    formatValue: (v) => `${v.toFixed(3)}%`,
    legendItems: [
      { color: '#059669', name: 'Strong Gain',     range: '> +10%' },
      { color: '#16a34a', name: 'Gaining',          range: '+2 – +10%' },
      { color: '#22c55e', name: 'Stable',           range: '±2%' },
      { color: '#f59e0b', name: 'Moderate Loss',    range: '-2 – -10%' },
      { color: '#ea580c', name: 'Significant Loss', range: '-10 – -25%' },
      { color: '#dc2626', name: 'Critical Loss',    range: '< -25%' },
    ],
  },
  {
    id: 'co2',
    label: 'CO₂',
    Icon: FiWind,
    group: 'environment',
    unit: 'tonnes per capita',
    fileName: 'co-emissions-per-capita.csv',
    valueColumn: 'CO₂ emissions per capita',
    colorMode: 'lower-better',
    chartColor: '#f97316',
    legendTitle: 'CO₂ Emissions Per Capita',
    formatValue: (v) => `${v.toFixed(2)}t`,
    legendItems: [
      { color: '#22c55e', name: 'Very Low',  range: '< 1t' },
      { color: '#84cc16', name: 'Low',       range: '1 – 3t' },
      { color: '#eab308', name: 'Medium',    range: '3 – 7t' },
      { color: '#f97316', name: 'High',      range: '7 – 15t' },
      { color: '#dc2626', name: 'Very High', range: '> 15t' },
    ],
  },
  {
    id: 'energy',
    label: 'Energy',
    Icon: FiZap,
    group: 'environment',
    unit: 'kWh per capita',
    fileName: 'per-capita-energy-use.csv',
    valueColumn: 'Per capita energy consumption',
    colorMode: 'energy',
    chartColor: '#38bdf8',
    legendTitle: 'Energy Use Per Capita',
    formatValue: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k kWh` : `${Math.round(v)} kWh`,
    legendItems: [
      { color: 'rgba(186,230,253,0.85)', name: 'Very Low',  range: '< 500 kWh' },
      { color: 'rgba(56,189,248,0.85)',  name: 'Low',       range: '0.5 – 2k kWh' },
      { color: 'rgba(2,132,199,0.88)',   name: 'Medium',    range: '2 – 5k kWh' },
      { color: 'rgba(29,78,216,0.88)',   name: 'High',      range: '5 – 15k kWh' },
      { color: 'rgba(79,70,229,0.9)',    name: 'Very High', range: '> 15k kWh' },
    ],
  },
  {
    id: 'hdi',
    label: 'HDI',
    Icon: FiTrendingUp,
    group: 'development',
    unit: 'index (0 – 1)',
    fileName: 'human-development-index.csv',
    valueColumn: 'Human Development Index',
    colorMode: 'higher-better',
    chartColor: '#a78bfa',
    legendTitle: 'Human Development Index',
    formatValue: (v) => v.toFixed(3),
    legendItems: [
      { color: '#dc2626', name: 'Low',        range: '< 0.55' },
      { color: '#f97316', name: 'Medium-Low', range: '0.55 – 0.65' },
      { color: '#eab308', name: 'Medium',     range: '0.65 – 0.75' },
      { color: '#84cc16', name: 'High',       range: '0.75 – 0.85' },
      { color: '#16a34a', name: 'Very High',  range: '> 0.85' },
    ],
  },
];

export const LAYER_MAP = new Map<LayerId, LayerConfig>(
  LAYER_CONFIGS.map((c) => [c.id, c])
);