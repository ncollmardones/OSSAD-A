import React, { useState, useRef } from 'react';
import { CLASS_COLORS, INDEX_RAMPS, SALARES } from '../constants';

const Visualizer: React.FC<any> = ({ configA, configB, loading, currentSalarName }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSalar = SALARES.find(s => s.nombre === currentSalarName) || SALARES[0];

  const handleMove = (e: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  const Legend = ({ config, isA }: { config: any, isA: boolean }) => {
    const ramp = INDEX_RAMPS[config.indice] || INDEX_RAMPS['Default'];
    const accentColor = isA ? '#38BDF8' : '#25FF8B';
    
    return (
      <div 
        className={`absolute bottom-8 ${isA ? 'left-8' : 'right-8'} z-30 p-4 bg-black/90 backdrop-blur-3xl border rounded-[1.2rem] flex flex-col gap-3 min-w-[160px] shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all`}
        style={{ borderColor: `${accentColor}33` }}
      >
        <div className="flex items-center gap-2 mb-0.5">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}80` }}
          ></div>
          <span className="text-[8px] font-black text-white uppercase font-tech tracking-[0.1em]">MAPA {isA ? 'A' : 'B'}</span>
        </div>
        {config.indice === 'Clasificación' ? (
          <div className="space-y-1.5">
            {Object.entries(CLASS_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-sm border border-white/5 shadow-sm" style={{ backgroundColor: color }}></div>
                <span className="text-[7px] font-tech text-white/60 font-bold uppercase tracking-tight">{name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className={`h-2.5 w-full bg-gradient-to-r ${ramp} rounded-full border border-white/5 shadow-inner`}></div>
            <div className="flex justify-between text-[7px] font-tech text-white/30 font-black uppercase tracking-tighter">
              <span>Mín.</span>
              <span>{config.indice}</span>
              <span>Máx.</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} onMouseMove={handleMove} onTouchMove={handleMove} className="relative w-full h-full rounded-[4rem] overflow-hidden border border-white/10 bg-[#020617] cursor-col-resize group shadow-[0_0_100px_rgba(0,0,0,0.7)]">
      {loading && (
        <div className="absolute inset-0 z-50 bg-[#020617]/98 backdrop-blur-3xl flex flex-col items-center justify-center gap-10">
          <div className="relative">
            <div className="w-16 h-16 border-[3px] border-cyan-500/5 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-t-[3px] border-cyan-400 rounded-full animate-spin"></div>
          </div>
          <p className="font-tech text-cyan-400 text-[10px] tracking-[1em] uppercase animate-pulse font-black">Procesando Reflectancia</p>
        </div>
      )}
      
      {/* CAPA B (Fondo) */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0F172A] to-black">
        <div className="text-center">
          <p className="font-tech text-[10px] font-black uppercase tracking-[1.5em] mb-4 opacity-40" style={{ color: '#25FF8B' }}>MAPA B</p>
          <p className="font-tech text-[42px] text-white/5 uppercase tracking-[0.2em] font-black select-none">{configB.indice}</p>
        </div>
        <Legend config={configB} isA={false} />
      </div>

      {/* CAPA A (Slider) */}
      <div 
        className="absolute inset-0 z-10 overflow-hidden border-r-[1.5px] border-white/20 transition-[border] duration-100 shadow-[20px_0_50px_rgba(0,0,0,0.6)]" 
        style={{ width: `${sliderPos}%` }}
      >
        <div className="absolute inset-0 w-[calc(100vw-360px)] h-full bg-gradient-to-br from-[#1E293B] to-[#020617] flex items-center justify-center">
          <div className="text-center">
            <p className="font-tech text-[10px] text-sky-400 font-black uppercase tracking-[1.5em] mb-4 opacity-40">MAPA A</p>
            <p className="font-tech text-[42px] text-white/10 uppercase tracking-[0.2em] font-black select-none">{configA.indice}</p>
          </div>
          <Legend config={configA} isA={true} />
        </div>
      </div>
      
      {/* CONTROLADOR DEL SLIDER */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none" 
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%) translateY(-50%)' }}
      >
        <div className="w-12 h-12 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl transition-all scale-90 group-hover:scale-100">
          <div className="flex gap-2 text-white/60">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5V7zm8 0l5 5-5 5V7z"/></svg>
          </div>
        </div>
      </div>

      {/* COMPONENTES CARTOGRÁFICOS MINIMALISTAS */}
      {/* NORTE */}
      <div className="absolute top-10 right-10 z-40 flex flex-col items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2L15 11H9L12 2z" fill="currentColor" fillOpacity="0.3"/>
          <path d="M12 22v-11" opacity="0.5"/>
        </svg>
        <span className="text-[10px] font-tech font-black text-white/50 tracking-widest">N</span>
      </div>

      {/* ESCALA */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 opacity-30 group-hover:opacity-70 transition-opacity pointer-events-none">
        <div className="flex items-center h-[2px] w-24 bg-white/40 relative">
          <div className="absolute left-0 h-2 w-[1px] bg-white/40 top-1/2 -translate-y-1/2"></div>
          <div className="absolute right-0 h-2 w-[1px] bg-white/40 top-1/2 -translate-y-1/2"></div>
          <div className="absolute left-1/2 h-1.5 w-[1px] bg-white/20 top-1/2 -translate-y-1/2"></div>
        </div>
        <span className="text-[7px] font-tech text-white uppercase tracking-[0.4em] font-black">Ref: 5 km</span>
      </div>

      {/* OVERLAY DE INFORMACIÓN SUPERIOR */}
      <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="px-5 py-2.5 bg-black/90 backdrop-blur-2xl rounded-xl border border-sky-400/20 flex flex-col items-start shadow-xl">
            <span className="text-[7px] font-tech text-sky-400 uppercase font-black tracking-[0.2em]">MAPA A</span>
            <span className="text-[10px] font-tech text-white uppercase font-black tracking-widest">{configA.indice} • {configA.anio}</span>
          </div>
          <div 
            className="px-5 py-2.5 bg-black/90 backdrop-blur-2xl rounded-xl border flex flex-col items-start shadow-xl"
            style={{ borderColor: '#25FF8B33' }}
          >
            <span className="text-[7px] font-tech uppercase font-black tracking-[0.2em]" style={{ color: '#25FF8B' }}>MAPA B</span>
            <span className="text-[10px] font-tech text-white uppercase font-black tracking-widest">{configB.indice} • {configB.anio}</span>
          </div>
        </div>

        {/* INFO TERRITORIAL */}
        <div className="px-5 py-2.5 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 flex flex-col items-end shadow-xl text-right">
          <span className="text-[7px] font-tech text-white/30 uppercase font-black tracking-[0.2em]">Contexto Territorial</span>
          <span className="text-[10px] font-tech text-white uppercase font-black tracking-tight">{currentSalar.subcuenca}</span>
          <div className="flex gap-2 mt-1">
            <span className="text-[8px] font-tech text-cyan-500/80 uppercase font-bold">{currentSalar.comuna}</span>
            <span className="text-[8px] font-tech text-white/40 uppercase">|</span>
            <span className="text-[8px] font-tech text-white/40 uppercase">{currentSalar.region}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;