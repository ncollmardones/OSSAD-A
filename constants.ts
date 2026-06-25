import { SalarData, IndexType, LandClass } from './types';

export const SALARES: SalarData[] = [
  { 
    nombre: 'Maricunga', 
    ambiente: 'Andino', 
    lat: -26.91, 
    lng: -69.08,
    subcuenca: 'Salar de Maricunga',
    comuna: 'Copiapó',
    region: 'Atacama'
  },
  { 
    nombre: 'Pedernales', 
    ambiente: 'Andino', 
    lat: -26.25, 
    lng: -69.15,
    subcuenca: 'Salar de Pedernales',
    comuna: 'Diego de Almagro',
    region: 'Atacama'
  },
  { 
    nombre: 'Atacama', 
    ambiente: 'PreAndino', 
    lat: -23.5, 
    lng: -68.25,
    subcuenca: 'Cuenca Salar de Atacama',
    comuna: 'San Pedro de Atacama',
    region: 'Antofagasta'
  },
  { 
    nombre: 'Punta Negra', 
    ambiente: 'PreAndino', 
    lat: -24.47, 
    lng: -68.9,
    subcuenca: 'Salar Punta Negra',
    comuna: 'Antofagasta',
    region: 'Antofagasta'
  },
  { 
    nombre: 'Huasco', 
    ambiente: 'Andino', 
    lat: -20.28, 
    lng: -68.88,
    subcuenca: 'Salar del Huasco',
    comuna: 'Pica',
    region: 'Tarapacá'
  },
  { 
    nombre: 'Surire', 
    ambiente: 'Andino', 
    lat: -18.85, 
    lng: -69.1,
    subcuenca: 'Salar de Surire',
    comuna: 'Putre',
    region: 'Arica y Parinacota'
  },
];

export const INDICES: IndexType[] = ['NDVI', 'NDWI', 'NDSI', 'Albedo', 'BSI', 'Clasificación'];

export const CLASS_COLORS: Record<LandClass, string> = {
  'Costra': '#FFFFFF',
  'Tierra': '#D2B48C',
  'Agua': '#3b82f6',
  'Vegas': '#22c55e'
};

export const INDEX_RAMPS: Record<string, string> = {
  'NDVI': 'from-red-900 via-yellow-200 to-green-600',
  'NDWI': 'from-gray-300 via-blue-400 to-blue-900',
  'NDSI': 'from-brown-900 via-gray-200 to-cyan-100',
  'Albedo': 'from-black via-gray-400 to-white',
  'BSI': 'from-blue-200 via-yellow-100 to-red-900',
  'Default': 'from-black via-gray-500 to-white'
};