
import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Room3D from './components/Room3D';
import Sidebar from './components/Sidebar';
import { RoomConfig, RoomSide, SideState, RoomItem } from './types';
import { INITIAL_ROOM_CONFIG, SIDE_LABELS, ARCHITECTURAL_CATALOG } from './constants';
import { generateAIInteriorSuggestion } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<RoomConfig>(INITIAL_ROOM_CONFIG);
  const [items, setItems] = useState<RoomItem[]>([]);
  const [selectedSide, setSelectedSide] = useState<RoomSide>('wall_north');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'error'} | null>(null);

  const updateSideConfig = useCallback((side: RoomSide, updates: Partial<SideState>) => {
    setConfig(prev => ({
      ...prev,
      [side]: { ...prev[side], ...updates }
    }));
  }, []);

  const handleAddItem = useCallback((type: 'door' | 'window', presetId: string) => {
    if (!selectedSide.startsWith('wall_')) return;
    
    // Find matching preset in catalog
    const catalogGroup = type === 'door' ? ARCHITECTURAL_CATALOG.door : ARCHITECTURAL_CATALOG.window;
    const preset = catalogGroup.find(p => p.id === presetId);
    if (!preset) return;

    const wallHeight = 6;
    const newItem: RoomItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      wall: selectedSide,
      x: 0,
      y: type === 'door' ? -wallHeight / 2 + preset.height / 2 : 0, 
      width: preset.width,
      height: preset.height,
      color: preset.color,
    };
    
    setItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  }, [selectedSide]);

  const handleRemoveItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  }, [selectedItemId]);

  const handleItemUpdate = useCallback((id: string, x: number, y: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, x, y } : item));
  }, []);

  const handleApplyAIStyle = async () => {
    setIsGenerating(true);
    setNotification({ message: "Gemini is designing your space...", type: 'info' });
    try {
      const suggestion = await generateAIInteriorSuggestion();
      setConfig(prev => ({ ...prev, ...suggestion }));
      setNotification({ message: "New style applied successfully!", type: 'info' });
    } catch (error) {
      setNotification({ message: "Failed to generate AI suggestion.", type: 'error' });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans selection:bg-blue-500/30">
      <main className="flex-1 relative group" onClick={() => setSelectedItemId(null)}>
        {/* Selection Badge Overlay */}
        <div className="absolute top-8 left-8 z-10 pointer-events-none group-hover:translate-x-1 transition-transform duration-500">
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-[2rem] flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-white/20">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
             </div>
             <div className="ml-4 mr-2">
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Active Layer</p>
                <h2 className="text-white text-base font-bold tracking-tight">{SIDE_LABELS[selectedSide]}</h2>
             </div>
          </div>
        </div>

        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Synchronizing 3D Assets</p>
            </div>
          </div>
        }>
          <Canvas shadows dpr={[1, 2]} className="cursor-grab active:cursor-grabbing">
            <Room3D 
              config={config} 
              items={items}
              selectedSide={selectedSide} 
              selectedItemId={selectedItemId}
              onSideClick={setSelectedSide} 
              onItemSelect={setSelectedItemId}
              onItemUpdate={handleItemUpdate}
            />
          </Canvas>
        </Suspense>

        <div className="absolute bottom-8 left-8 pointer-events-none">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-2xl flex gap-8 items-center shadow-2xl">
            <div className="flex items-center gap-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Interior Mode Active</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700 font-mono">DRAG</kbd>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Move Elements</span>
            </div>
          </div>
        </div>

        {notification && (
          <div className={`absolute top-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full border shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500 animate-in fade-in slide-in-from-top-4 backdrop-blur-2xl z-50 ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-100' : 'bg-blue-600/90 border-blue-400 text-white'}`}>
            <span className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
              {notification.type === 'info' && <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {notification.message}
            </span>
          </div>
        )}
      </main>

      <Sidebar 
        selectedSide={selectedSide}
        setSelectedSide={setSelectedSide}
        config={config}
        items={items}
        updateSideConfig={updateSideConfig}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onApplyAIStyle={handleApplyAIStyle}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default App;
