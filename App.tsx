import EarthEngineMap from "./components/EarthEngineMap";
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Visualizer from './components/Visualizer';
import AnalysisDashboard from './components/AnalysisDashboard';
import { ZonalResult, SceneConfig, ComplementaryConfig } from './types';
import { calculateZonalStats } from './services/zonalStatsService';
import { interpretResults } from './services/geminiService';

const App: React.FC = () => {
  const [result, setResult] = useState<ZonalResult | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [configA, setConfigA] = useState<SceneConfig>({ indice: 'NDWI', anio: '2024', estacion: 'Verano', cloudCover: 20 });
  const [configB, setConfigB] = useState<SceneConfig>({ indice: 'Clasificación', anio: '2024', estacion: 'Verano', cloudCover: 20 });
  const [comp, setComp] = useState<ComplementaryConfig>({
    dem: false,
    slope: false,
    aspect: false,
    hydrology: false,
    geology: false,
    snaspe: false
  });
  const [global, setGlobal] = useState({ salar: 'Maricunga', ambiente: 'Andino' });

 const handleApply = useCallback(
  async (
    cA: SceneConfig,
    cB: SceneConfig,
    cp: ComplementaryConfig,
    g: { salar: string; ambiente: string }
  ) => {
    setLoading(true);
    setGlobal(g);

    try {
      const stats = await calculateZonalStats(
        g.salar,
        cA.indice,
        cB.indice,
        parseInt(cA.anio),
        cA.estacion,
        cA.stat || "median",
        cA.cloudCover
      );

      setResult(stats);

     
      setInterpretation("Interpretación desactivada temporalmente (Gemini backend después).");


    } catch (e) {
      console.error("Error en procesamiento:", e);

    } finally {
      setLoading(false);
    }
  },
  []
);


  return (
    <div className="flex h-screen w-screen bg-[#020617] overflow-hidden text-white font-sans">
      <Sidebar 
        onApply={handleApply} 
        loading={loading} 
        configA={configA} 
        configB={configB} 
        comp={comp}
        setConfigA={setConfigA} 
        setConfigB={setConfigB} 
        setComp={setComp}
      />
     

      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 px-12 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-2xl z-20 shrink-0 shadow-lg">
          <div className="flex items-center gap-8">
            <div className="text-[12px] font-black text-white/50 uppercase font-tech tracking-[0.4em]">Territorio: {global.salar}</div>
            <div className="h-6 w-[2px] bg-white/10 rounded-full"></div>
            <div className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] font-black text-cyan-400 font-tech uppercase tracking-[0.3em] animate-pulse flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              SISTEMA OPERATIVO ACTIVO
            </div>
          </div>
          <div className="text-[11px] font-black text-white/40 uppercase font-tech tracking-[0.3em] flex items-center gap-2">
            <span className="opacity-50">VERSIÓN</span> 
            <span className="text-white/70">GEE CORE V3.5</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-10 space-y-20">
          <div className="h-[520px] relative z-10">
            <Visualizer configA={configA} configB={configB} loading={loading} currentSalarName={global.salar} />
          
          </div>
{result?.mapUrl && (
  <div className="h-[520px] relative z-10">
    <EarthEngineMap mapUrl={result.mapUrl} />
  </div>
)}


          <div className="max-w-[1500px] mx-auto">
            <AnalysisDashboard data={result} interpretation={interpretation} loading={loading} />
          </div>
          <div className="h-32"></div>
        </div>

        {/* Ambient Effects */}
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-cyan-500/[0.04] to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-cyan-500/[0.03] to-transparent pointer-events-none"></div>
      </main>
    </div>
  );
};


export default App;