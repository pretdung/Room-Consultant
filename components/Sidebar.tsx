
import React from 'react';
import { RoomConfig, RoomSide, SideState, RoomItem } from '../types';
import { SIDE_LABELS, ARCHITECTURAL_CATALOG } from '../constants';

interface SidebarProps {
  selectedSide: RoomSide;
  setSelectedSide: (side: RoomSide) => void;
  config: RoomConfig;
  items: RoomItem[];
  updateSideConfig: (side: RoomSide, updates: Partial<SideState>) => void;
  onAddItem: (type: 'door' | 'window', presetId: string) => void;
  onRemoveItem: (id: string) => void;
  onApplyAIStyle: () => void;
  isGenerating: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedSide, 
  setSelectedSide, 
  config, 
  items,
  updateSideConfig,
  onAddItem,
  onRemoveItem,
  onApplyAIStyle,
  isGenerating
}) => {
  const currentSideConfig = config[selectedSide];
  const isWall = selectedSide.startsWith('wall_');

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          ArchiViz Pro
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-bold">Studio Suite</p>
      </div>

      <div className="p-6 flex-1 space-y-8">
        {/* Selection Area */}
        <section>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Space Navigator</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(SIDE_LABELS) as RoomSide[]).map((side) => (
              <button
                key={side}
                onClick={() => setSelectedSide(side)}
                className={`px-3 py-2.5 text-[11px] rounded-xl transition-all border font-medium ${
                  selectedSide === side 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40 translate-y-[-1px]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {SIDE_LABELS[side]}
              </button>
            ))}
          </div>
        </section>

        {/* Architecture Catalog */}
        {isWall && (
          <section className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                <span className="w-1 h-3 bg-blue-500 rounded-full"></span>
                Door Library (Floor-Snapped)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ARCHITECTURAL_CATALOG.door.map(preset => (
                  <button 
                    key={preset.id}
                    onClick={() => onAddItem('door', preset.id)}
                    className="flex flex-col items-center gap-2 p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-all group"
                  >
                    <div className="w-6 h-10 border border-slate-500 rounded-sm group-hover:border-blue-400 transition-colors bg-slate-900/50"></div>
                    <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-100 transition-colors uppercase truncate w-full text-center">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                <span className="w-1 h-3 bg-cyan-500 rounded-full"></span>
                Window Library
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ARCHITECTURAL_CATALOG.window.map(preset => (
                  <button 
                    key={preset.id}
                    onClick={() => onAddItem('window', preset.id)}
                    className="flex flex-col items-center gap-2 p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-all group"
                  >
                    <div className="w-10 h-7 border border-slate-500 rounded-sm flex items-center justify-center group-hover:border-cyan-400 transition-colors bg-cyan-900/20">
                       <div className="w-full h-[1px] bg-slate-500/50"></div>
                       <div className="h-full w-[1px] bg-slate-500/50 absolute"></div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-100 transition-colors uppercase truncate w-full text-center">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Material Control */}
        <section className="space-y-4">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Surface Material</label>
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-medium">Primary Color</span>
                <span className="text-[10px] font-mono text-slate-600 tracking-tighter">{currentSideConfig.color}</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative w-10 h-10 shrink-0">
                  <input 
                    type="color" 
                    value={currentSideConfig.color}
                    onChange={(e) => updateSideConfig(selectedSide, { color: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-full rounded-lg shadow-inner border border-white/5" style={{ backgroundColor: currentSideConfig.color }}></div>
                </div>
                <input 
                  type="text"
                  value={currentSideConfig.color}
                  onChange={(e) => updateSideConfig(selectedSide, { color: e.target.value })}
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-medium">Roughness</span>
                <span className="text-[10px] font-bold text-slate-600">{(currentSideConfig.roughness * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={currentSideConfig.roughness} onChange={(e) => updateSideConfig(selectedSide, { roughness: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 appearance-none cursor-pointer" />
            </div>
          </div>
        </section>

        {/* Active Item Stack */}
        {isWall && items.filter(i => i.wall === selectedSide).length > 0 && (
          <section className="space-y-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wall Inventory</label>
            <div className="space-y-2">
              {items.filter(i => i.wall === selectedSide).map(item => (
                <div key={item.id} className="group flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.type === 'door' ? 'bg-amber-500' : 'bg-cyan-500'}`}></div>
                    <span className="text-[11px] uppercase tracking-wide font-bold text-slate-400">{item.type}</span>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <button onClick={onApplyAIStyle} disabled={isGenerating} className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isGenerating ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-xl shadow-indigo-900/20 active:scale-[0.98]'}`}>
          {isGenerating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          {isGenerating ? 'Analyzing Style...' : 'Generate AI Scheme'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
