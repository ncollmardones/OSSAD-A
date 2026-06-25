export type SalarAmbiente = 'Costero' | 'PreAndino' | 'Andino';
export type IndexType = 'NDVI' | 'NDWI' | 'NDSI' | 'Albedo' | 'BSI' | 'Clasificación';
export type LandClass = 'Costra' | 'Tierra' | 'Agua' | 'Vegas';
export type Estacion = 'Verano' | 'Otoño' | 'Invierno' | 'Primavera';
export type StatType = 'mean' | 'median' | 'max' | 'min' | 'stdDev';

export interface ComplementaryConfig {
  dem: boolean;
  slope: boolean;
  aspect: boolean;
  hydrology: boolean;
  geology: boolean;
  snaspe: boolean;
}

export interface SceneConfig {
  indice: IndexType;
  anio: string;
  estacion: Estacion;
  cloudCover: number;
  stat?: StatType;
}

export interface HistoricalDataPoint {
  year: number;
  value: number;
  anomaly: number;
}

export interface SceneMetadata {
  title: string;
  abstract: string;
  status: string;
  topicCategory: string;
  crs: string;
  datum: string;
  spatialRepresentationType: string;
  resolution: string;
  sensor: string;
  platform: string;
  processingLevel: string;
  lineage: string;
  cloudCover: number;
  sceneId: string;
  dateStamp: string;
  sunElevation: number;
  sunAzimuth: number;
  identifier: string;
  distributionFormat: string;
}

export interface ClassStats {
  className: LandClass;
  mean: number;
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
  stdDev: number;
  variance: number;
  areaHa: number;
  count: number;
}

export interface ZonalResult {
  salarName: string;
  indexUsed: IndexType;
  statUsed: StatType;
  timestamp: string;
  stats: ClassStats[];
  history: HistoricalDataPoint[];
  totalArea: number;
  mapUrl?: string; 
  geeCode: string;
  metadata: SceneMetadata;
  params: {
    year: string;
    season: string;
    cloudCover: number;
  };
}

export interface SalarData {
  nombre: string;
  ambiente: SalarAmbiente;
  lat: number;
  lng: number;
  subcuenca: string;
  comuna: string;
  region: string;
}