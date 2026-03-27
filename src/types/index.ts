export interface ForestRow {
  entity: string;
  code: string;
  year: number;
  share: number; // % of global forest
}

export interface CountryYearData {
  code: string;
  share: number;
  share1990: number;
  relativeChange: number; // (share - share1990) / share1990 * 100
}

export interface ProcessedData {
  rows: ForestRow[];
  // code -> year -> share
  byCode: Map<string, Map<number, number>>;
  // entity name -> code
  nameToCode: Map<string, string>;
  years: number[];
}

export interface SelectedCountry {
  code: string;
  entity: string;
  history: { year: number; share: number }[];
}
