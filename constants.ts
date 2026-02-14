
import { RoomConfig, ColorPalette, MotifType, RoomDimensions } from './types';

export const DEFAULT_DIMENSIONS: RoomDimensions = {
  width: 6,
  length: 4,
  height: 3.5,
};

export const INITIAL_ROOM_CONFIG: RoomConfig = {
  wall_north: { color: '#f8fafc', roughness: 0.8, metalness: 0.1, motif: 'none' },
  wall_south: { color: '#f8fafc', roughness: 0.8, metalness: 0.1, motif: 'none' },
  wall_east: { color: '#f1f5f9', roughness: 0.8, metalness: 0.1, motif: 'none' },
  wall_west: { color: '#f1f5f9', roughness: 0.8, metalness: 0.1, motif: 'none' },
  floor: { color: '#334155', roughness: 0.6, metalness: 0.2, motif: 'none' },
  ceiling: { color: '#ffffff', roughness: 0.9, metalness: 0.0, motif: 'none' },
};

export interface MotifPreset {
  id: MotifType;
  label: string;
  description: string;
}

export const MOTIF_CATALOG: Record<'wall' | 'floor' | 'ceiling', MotifPreset[]> = {
  wall: [
    { id: 'none', label: 'Flat Finish', description: 'Simple painted surface' },
    { id: 'pvc_panels', label: 'PVC Fluted', description: 'Vertical wooden or plastic slats' },
    { id: 'shiplap', label: 'Shiplap', description: 'Horizontal wooden planks' },
    { id: 'molding', label: 'Classic Molding', description: 'Picture frame wall panels' },
  ],
  floor: [
    { id: 'none', label: 'Seamless', description: 'Poured concrete or resin' },
    { id: 'wood_planks', label: 'Oak Planks', description: 'Natural hardwood flooring' },
    { id: 'tiles', label: 'Large Tiles', description: 'Modern 60x60 ceramic grid' },
  ],
  ceiling: [
    { id: 'none', label: 'Standard', description: 'Smooth plaster ceiling' },
    { id: 'coffered', label: 'Coffered Grid', description: 'Classic recessed beam design' },
    { id: 'perimeter_trim', label: 'LED Perimeter', description: 'Modern recessed light trim' },
  ]
};

export const ARCHITECTURAL_CATALOG = {
  door: [
    { id: 'std_door', label: 'Standard Door', width: 0.9, height: 2.1, color: '#4a3728' },
    { id: 'tall_door', label: 'Grand Portal', width: 1.2, height: 2.6, color: '#2d2d2d' },
    { id: 'wide_door', label: 'Double Doors', width: 1.8, height: 2.1, color: '#5c4033' },
    { id: 'sliding_door', label: 'Glass Slider', width: 2.0, height: 2.0, color: '#a5f3fc' },
  ],
  window: [
    { id: 'sq_win', label: 'Square Window', width: 1.2, height: 1.2, color: '#e0f2fe' },
    { id: 'ribbon_win', label: 'Ribbon Window', width: 4.0, height: 0.6, color: '#bae6fd' },
    { id: 'picture_win', label: 'Picture Window', width: 2.0, height: 2.0, color: '#f0f9ff' },
    { id: 'porthole', label: 'Tall Narrow', width: 0.5, height: 2.0, color: '#e0f2fe' },
  ],
  stairs: [
    { id: 'straight_stairs', label: 'Straight Run', width: 1.2, color: '#5c4033' },
    { id: 'wide_stairs', label: 'Wide Steps', width: 2.5, color: '#334155' },
    { id: 'floating_stairs', label: 'Floating Slat', width: 1.5, color: '#1e293b' },
  ]
};

export const PRESET_PALETTES: ColorPalette[] = [
  { name: 'Modern Minimalist', colors: ['#ffffff', '#f1f5f9', '#94a3b8', '#1e293b', '#0f172a'] },
  { name: 'Nordic Forest', colors: ['#2d4a53', '#7a9d96', '#f2f2f2', '#bfbfbf', '#4a5759'] },
  { name: 'Sunset Terracotta', colors: ['#e2725b', '#f9dcc4', '#f8ad9d', '#ffb5a7', '#fcd5ce'] },
  { name: 'Industrial Loft', colors: ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'] }
];

export const SIDE_LABELS: Record<string, string> = {
  wall_north: 'North Wall',
  wall_south: 'South Wall',
  wall_east: 'East Wall',
  wall_west: 'West Wall',
  floor: 'Floor',
  ceiling: 'Ceiling'
};
