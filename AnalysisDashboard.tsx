import React, { useRef, useState } from 'react';
import { ZonalResult, ClassStats, HistoricalDataPoint } from '../types';
import { CLASS_COLORS, SALARES } from '../constants';

interface Props {
  data: ZonalResult | null;
  interpretation: string | null;
  loading: boolean;
}

const AnalysisDashboard: React.FC<Props> = ({ data, interpretation, loading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('resumen');

  const sections = [
    { id: 'resumen', label: 'Estadísticas' },
    { id: 'tendencia', label: 'Evolución' },
    { id: 'ia', label: 'Análisis IA' },
    { id: 'iso', label: 'Metadata ISO' }
  ];

  const currentSalar = data ? (SALARES.find(s => s.nombre === data.salarName) || SALARES[0]) : null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el && scrollRef.current) {
      const offset = el.offsetLeft;
      scrollRef.current.scrollTo({ left: offset, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    if (sections[index]) setActiveSection(sections[index].id);
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-8 animate-pulse">
      <div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
      <p className="text-cyan-500 font-tech text-[10px] tracking-[0.5em] uppercase font-black">EXTRAYENDO MÉTODOS ZONALES...</p>
    </div>
  );

  if (!data) return (
    <div className="py-20 border border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/[0.01]">
      <p className="text-white/40 font-tech text-[11px] uppercase tracking-[0.4em] font-black italic">Comando de análisis pendiente</p>
    </div>
  );

if (!Array.isArray(data.stats)) {
  return (
    <div className="py-10 text-red-400">
      Error: stats no está llegando desde el backend.
    </div>
  );
}

if (!Array.isArray(data.history)) {
  return (
    <div className="py-10 text-red-400">
      Error: history no está llegando desde el backend.
    </div>
  );
}



  const BoxPlotComponent = ({ stat }: { stat: ClassStats }) => {
    const minScale = -1.0;
    const maxScale = 1.0;
    const range = maxScale - minScale;
    const toPercent = (val: number) => ((val - minScale) / range) * 100;

    return (
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4">
            <span className="text-[8px] font-tech text-white/60 uppercase font-black tracking-widest">Min: {stat.min.toFixed(3)}</span>
            <span className="text-[8px] font-tech text-white/60 uppercase font-black tracking-widest">Max: {stat.max.toFixed(3)}</span>
          </div>
          <span className="text-[14px] font-black text-cyan-400 font-tech">{(stat.median).toFixed(3)}</span>
        </div>
        <div className="relative h-1 w-full flex items-center">
          <div className="absolute h-[0.5px] w-full bg-white/10"></div>
          <div className="absolute h-2 w-[1px] bg-white/40" style={{ left: `${toPercent(stat.min)}%` }}></div>
          <div className="absolute h-2 w-[1px] bg-white/40" style={{ left: `${toPercent(stat.max)}%` }}></div>
          <div className="absolute h-2 border border-white/10 rounded-sm" 
               style={{ 
                 left: `${toPercent(stat.q1)}%`, 
                 width: `${Math.max(3, toPercent(stat.q3) - toPercent(stat.q1))}%`,
                 backgroundColor: `${CLASS_COLORS[stat.className]}30`
               }}></div>
          <div className="absolute h-4 w-1 bg-white shadow-[0_0_8px_white] z-10 rounded-full" style={{ left: `${toPercent(stat.median)}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Navegador Superior Compacto */}
      <div className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl py-4 border-b border-white/5">
        <div className="flex items-center justify-between px-6">
          <div className="flex gap-8">
            {sections.map(s => (
              <button 
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] font-tech transition-all relative pb-1.5 ${activeSection === s.id ? 'text-cyan-400' : 'text-white/50 hover:text-white'}`}
              >
                {s.label}
                {activeSection === s.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-500 shadow-[0_0_8px_#06b6d4] rounded-full"></div>}
              </button>
            ))}
          </div>
          <div className="text-[8px] font-tech text-white/40 uppercase tracking-[0.3em] font-black">ANALYTICS ENGINE V3.5</div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory custom-scrollbar scroll-smooth pb-8"
      >
        {/* ESTADÍSTICAS */}
        <section id="section-resumen" className="min-w-full snap-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.stats.map(stat => (
            <div key={stat.className} className="bg-[#0F172A]/50 p-6 rounded-[1.8rem] border border-white/5 hover:border-cyan-500/10 transition-all flex flex-col gap-4 shadow-lg h-fit group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: CLASS_COLORS[stat.className] }}></div>
                  <span className="text-[11px] font-black text-white/70 uppercase tracking-widest font-tech">{stat.className}</span>
                </div>
                <span className="text-[9px] font-tech text-white/50 font-bold">{stat.areaHa.toLocaleString()} ha</span>
              </div>
              
              <div className="py-0.5">
                <div className="text-3xl font-black text-white font-tech tracking-tighter leading-none group-hover:text-cyan-400 transition-colors">
                  {stat.median.toFixed(3)}
                </div>
                <div className="text-[8.5px] text-white/60 font-bold uppercase font-tech tracking-[0.1em] mt-2.5">Reflectancia Mediana</div>
              </div>

              <div>
                <BoxPlotComponent stat={stat} />
                <div className="flex justify-between items-center text-[10px] font-tech text-white/50 pt-3.5 mt-3.5 border-t border-white/5">
                  <span className="uppercase font-bold tracking-[0.1em]">Ocupación Suelo</span>
                  <span className="text-white font-black text-[11px]">{((stat.areaHa / data.totalArea) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* EVOLUCIÓN */}
        <section id="section-tendencia" className="min-w-full snap-start">
          <div className="relative h-[340px] w-full bg-[#0F172A]/40 rounded-[2.2rem] p-8 border border-white/5 flex gap-6 shadow-lg">
            <div className="flex flex-col items-end pr-4 border-r border-white/5 h-[220px] text-[9px] font-black font-tech text-white/50">
              {[1.0, 0.5, 0, -0.5, -1.0].map(val => (
                <div key={val} className="flex-1 flex items-center">
                  <span>{val.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 bg-cyan-500/50 rounded-full"></div>
                <h4 className="text-[10px] text-white/70 font-black uppercase font-tech tracking-[0.2em]">Serie Multitemporal Landsat (1985-2025)</h4>
              </div>
              <div className="relative flex-1 flex items-end justify-between gap-1 border-b border-white/5 pb-3">
                {data.history.map((p, i) => {
                  const height = ((p.value + 1) / 2) * 100;
                  return (
                    <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                      <div 
                        className={`w-full max-w-[4px] rounded-t-[1px] transition-all duration-300 ${p.anomaly > 0 ? 'bg-cyan-500/60' : 'bg-slate-700/60'} group-hover:bg-cyan-400`}
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between pt-3.5 text-[8.5px] font-tech text-white/40 uppercase tracking-[0.3em] font-black">
                <span>1985</span>
                <span>ESCENA: {data.params.year}</span>
              </div>
            </div>
          </div>
        </section>

        {/* IA */}
        <section id="section-ia" className="min-w-full snap-start">
          <div className="bg-gradient-to-br from-[#0F172A]/60 to-[#020617]/60 p-10 rounded-[2.5rem] border border-cyan-500/5 relative h-full flex flex-col justify-center min-h-[280px] shadow-2xl overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/[0.02] blur-[100px] rounded-full"></div>
            <div className="max-w-4xl border-l border-cyan-500/30 pl-8 relative z-10">
              <h3 className="text-cyan-400/80 text-[10px] font-black uppercase tracking-[0.8em] mb-5 font-tech">Diagnóstico Neural Gemini</h3>
              <p 
                className="text-[14px] font-medium text-white/90 leading-relaxed text-justify tracking-tight italic" 
                style={{ fontFamily: 'Tahoma, sans-serif' }}
              >
                {interpretation || "Extrayendo inteligencia territorial mediante redes neuronales..."}
              </p>
            </div>
          </div>
        </section>

        {/* ISO METADATA */}
        <section id="section-iso" className="min-w-full snap-start">
          <div className="bg-[#0F172A]/40 p-8 rounded-[2.2rem] border border-white/5 shadow-xl h-full flex flex-col overflow-hidden">
            <h4 className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] font-tech mb-6 text-center border-b border-white/5 pb-4 italic">Metadatos Estructurados ISO 19115-1</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-2">
              <div className="space-y-5">
                <div className="space-y-2">
                  <h5 className="text-[8px] text-cyan-500/60 uppercase font-black tracking-widest">Identificación</h5>
                  {[
                    { l: 'Dataset', v: `Reflectancia ${data.indexUsed}` },
                    { l: 'Identificador', v: data.metadata.identifier },
                    { l: 'Resumen', v: data.metadata.abstract }
                  ].map(i => (
                    <div key={i.l} className="flex flex-col gap-0.5 py-1.5 border-b border-white/[0.02]">
                      <span className="text-[7px] text-white/40 uppercase font-bold tracking-wider">{i.l}</span>
                      <span className="text-[11px] text-white/80 font-medium leading-tight">{i.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <h5 className="text-[8px] text-cyan-500/60 uppercase font-black tracking-widest">Linaje</h5>
                  {[
                    { l: 'Plataforma', v: data.metadata.platform },
                    { l: 'Procesamiento', v: data.metadata.processingLevel },
                    { l: 'Calidad Nubosa', v: `${data.metadata.cloudCover}%` }
                  ].map(i => (
                    <div key={i.l} className="flex flex-col gap-0.5 py-1.5 border-b border-white/[0.02]">
                      <span className="text-[7px] text-white/40 uppercase font-bold tracking-wider">{i.l}</span>
                      <span className="text-[11px] text-white/80 font-medium leading-tight">{i.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalysisDashboard;