import React, { useState, useMemo } from 'react';
import { SALARES, INDICES } from '../constants';
import { SalarAmbiente, IndexType, SceneConfig, Estacion, ComplementaryConfig } from '../types';

interface SidebarProps {
  onApply: (configA: SceneConfig, configB: SceneConfig, comp: ComplementaryConfig, global: any) => void;
  loading: boolean;
  configA: SceneConfig;
  configB: SceneConfig;
  comp: ComplementaryConfig;
  setConfigA: (c: SceneConfig) => void;
  setConfigB: (c: SceneConfig) => void;
  setComp: (c: ComplementaryConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onApply, loading, configA, configB, comp, setConfigA, setConfigB, setComp }) => {
  const [ambiente, setAmbiente] = useState<SalarAmbiente>('Andino');
  const [salar, setSalar] = useState('Maricunga');

  const filteredSalares = useMemo(() => SALARES.filter(s => s.ambiente === ambiente), [ambiente]);

  const ControlGroup = ({ label, title, config, setConfig, accentHex }: any) => (
    <div className="bg-[#0F172A]/60 rounded-[1.2rem] p-4 border border-white/5 relative overflow-hidden flex flex-col gap-3 shadow-lg">
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accentHex }}></div>
      <div className="flex items-center gap-2.5">
        <span 
          className="w-5 h-5 rounded-md flex items-center justify-center text-black font-black text-[9px]"
          style={{ backgroundColor: accentHex }}
        >
          {label}
        </span>
        <span className="text-[10px] font-black text-white/90 uppercase tracking-widest font-tech">{title}</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[8px] text-white/60 uppercase font-tech tracking-wider ml-0.5">Índice Espectral</label>
          <select 
            value={config.indice} 
            onChange={(e) => setConfig({...config, indice: e.target.value as IndexType})} 
            className="w-full bg-[#1E293B]/50 text-white text-[10px] font-bold p-2.5 rounded-lg border border-white/5 font-tech outline-none appearance-none hover:bg-[#2D3E56]/50 transition-colors"
          >
            {INDICES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[8px] text-white/60 uppercase font-tech tracking-wider ml-0.5">Año</label>
            <select value={config.anio} onChange={(e) => setConfig({...config, anio: e.target.value})} className="w-full bg-[#1E293B]/50 text-white text-[10px] p-2.5 rounded-lg border border-white/5 font-tech outline-none">
              {['2025', '2024', '2023', '2022', '2021', '2020'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] text-white/60 uppercase font-tech tracking-wider ml-0.5">Fase</label>
            <select value={config.estacion} onChange={(e) => setConfig({...config, estacion: e.target.value as Estacion})} className="w-full bg-[#1E293B]/50 text-white text-[10px] p-2.5 rounded-lg border border-white/5 font-tech outline-none">
              {['Verano', 'Otoño', 'Invierno', 'Primavera'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-0.5">
            <label className="text-[8px] text-white/60 uppercase font-tech tracking-wider">Nubosidad</label>
            <span className="text-[10px] font-tech font-bold" style={{ color: accentHex }}>{config.cloudCover}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={config.cloudCover}
            onChange={(e) => setConfig({...config, cloudCover: parseInt(e.target.value)})}
            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500"
            style={{ accentColor: accentHex }}
          />
        </div>
      </div>
    </div>
  );

  const ComplementaryBox = () => (
    <div className="bg-[#0F172A]/80 rounded-[1.2rem] p-4 flex flex-col gap-4 shadow-xl border border-white/5 relative group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-60"></div>
          </div>
          <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] font-tech">Capas de Contexto</h3>
        </div>
        <span className="text-[7px] font-tech text-cyan-400 font-bold uppercase tracking-widest">Activo</span>
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="space-y-2">
          <label className="text-[7.5px] text-cyan-400/80 font-black uppercase font-tech tracking-widest block pl-1">Geomorfología:</label>
          <div className="grid grid-cols-1 gap-1.5 pl-1">
            {[
              { id: 'dem', label: 'Altitud (DEM 30m)' },
              { id: 'slope', label: 'Mapa de Pendiente' },
              { id: 'aspect', label: 'Aspect / Orientación' }
            ].map(item => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={(comp as any)[item.id]} 
                    onChange={(e) => setComp({...comp, [item.id]: e.target.checked})}
                    className="w-3.5 h-3.5 rounded border-white/10 bg-black/40 text-cyan-500 focus:ring-cyan-500 appearance-none border checked:bg-cyan-500 checked:border-cyan-400 transition-all cursor-pointer" 
                  />
                  {(comp as any)[item.id] && <svg className="absolute w-2.5 h-2.5 text-black left-0.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-[9.5px] font-tech font-bold uppercase tracking-tight transition-colors ${ (comp as any)[item.id] ? 'text-cyan-400' : 'text-white/50 group-hover:text-white'}`}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[7.5px] text-cyan-400/80 font-black uppercase font-tech tracking-widest block pl-1">Inventarios:</label>
          <div className="grid grid-cols-1 gap-1.5 pl-1">
            {[
              { id: 'hydrology', label: 'DGA Hidrología' },
              { id: 'geology', label: 'Sernageomin Geol.' },
              { id: 'snaspe', label: 'Catastro SNASPE' }
            ].map(item => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={(comp as any)[item.id]} 
                    onChange={(e) => setComp({...comp, [item.id]: e.target.checked})}
                    className="w-3.5 h-3.5 rounded border-white/10 bg-black/40 text-cyan-500 focus:ring-cyan-500 appearance-none border checked:bg-cyan-500 checked:border-cyan-400 transition-all cursor-pointer" 
                  />
                  {(comp as any)[item.id] && <svg className="absolute w-2.5 h-2.5 text-black left-0.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-[9.5px] font-tech font-bold uppercase tracking-tight transition-colors ${ (comp as any)[item.id] ? 'text-cyan-400' : 'text-white/50 group-hover:text-white'}`}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="w-[340px] bg-[#020617] h-screen overflow-y-auto p-5 flex flex-col gap-5 border-r border-white/5 custom-scrollbar relative z-50 shadow-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)] overflow-hidden relative group">
            <svg className="w-8 h-8 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" fill="currentColor" fillOpacity="0.2" />
              <path d="M4 10h5.5v4H4zM14.5 10H20v4h-5.5z" strokeDasharray="1 1" opacity="0.6" />
              <path d="M12 9.5V7m0 0l-1.5 1.5M12 7l1.5 1.5" />
              <ellipse cx="12" cy="12" rx="10" ry="4" strokeDasharray="2 3" opacity="0.3" transform="rotate(-15 12 12)" />
              <circle cx="12" cy="12" r="0.5" fill="white" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent"></div>
          </div>
          <h1 className="flex flex-col">
            <span className="text-lg font-black text-white leading-none tracking-tighter uppercase">Salares Chile</span>
            <span className="text-[8px] font-bold text-cyan-500 tracking-[0.4em] mt-1.5 uppercase font-tech italic">Monitoreo Satelital</span>
          </h1>
        </div>
      </div>

      <div className="bg-white/[0.02] p-4 rounded-[1.5rem] border border-white/5 space-y-3.5 shadow-inner">
        <div className="flex p-1 bg-black/40 rounded-lg">
          {(['Costero', 'PreAndino', 'Andino'] as SalarAmbiente[]).map(amb => (
            <button 
              key={amb} 
              onClick={() => setAmbiente(amb)} 
              className={`flex-1 py-1.5 rounded-md text-[8px] font-black uppercase font-tech transition-all ${ambiente === amb ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-white/40 hover:text-white/60'}`}
            >
              {amb}
            </button>
          ))}
        </div>
        <div className="space-y-1">
           <label className="text-[8px] text-white/60 uppercase font-tech tracking-wider ml-0.5">Territorio Objetivo</label>
           <select value={salar} onChange={(e) => setSalar(e.target.value)} className="w-full bg-black/50 text-white font-black text-[13px] p-3 rounded-xl border border-white/5 font-tech outline-none hover:border-cyan-500/30 transition-colors">
            {filteredSalares.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ControlGroup label="A" title="Visualizador A" config={configA} setConfig={setConfigA} accentHex="#0ea5e9" />
        <ControlGroup label="B" title="Visualizador B" config={configB} setConfig={setConfigB} accentHex="#10b981" />
        <ComplementaryBox />
      </div>

      <button 
        onClick={() => onApply(configA, configB, comp, { salar, ambiente })} 
        disabled={loading} 
        className={`w-full py-4 rounded-xl font-black text-[10px] tracking-[0.3em] font-tech transition-all shadow-xl flex items-center justify-center gap-3 ${loading ? 'bg-slate-800 text-white/10 cursor-not-allowed' : 'bg-cyan-500 text-black hover:bg-white active:scale-[0.98]'}`}
      >
        {loading ? 'CALCULANDO...' : 'PROCESAR ESCENA'}
      </button>

      <div className="mt-auto p-3 bg-white/[0.01] border border-white/5 rounded-xl">
        <p className="text-[8px] text-white/40 font-tech leading-relaxed uppercase tracking-tighter">
          Engine: Landsat L2 OLI-2<br/>Res: 30m • GEE Cloud Processing
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;