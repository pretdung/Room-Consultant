
import { RoomConfig, ColorPalette } from './types';

export const INITIAL_ROOM_CONFIG: RoomConfig = {
  wall_north: { color: '#f8fafc', roughness: 0.8, metalness: 0.1 },
  wall_south: { color: '#f8fafc', roughness: 0.8, metalness: 0.1 },
  wall_east: { color: '#f1f5f9', roughness: 0.8, metalness: 0.1 },
  wall_west: { color: '#f1f5f9', roughness: 0.8, metalness: 0.1 },
  floor: { color: '#334155', roughness: 0.6, metalness: 0.2 },
  ceiling: { color: '#ffffff', roughness: 0.9, metalness: 0.0 },
};

export const ARCHITECTURAL_CATALOG = {
  door: [
    { id: 'std_door', label: 'Standard Door', width: 1.8, height: 4.2, color: '#4a3728' },
    { id: 'tall_door', label: 'Grand Portal', width: 2.2, height: 5.2, color: '#2d2d2d' },
    { id: 'wide_door', label: 'Double Doors', width: 3.5, height: 4.2, color: '#5c4033' },
    { id: 'sliding_door', label: 'Glass Slider', width: 4.0, height: 4.0, color: '#a5f3fc' },
  ],
  window: [
    { id: 'sq_win', label: 'Square Window', width: 2.5, height: 2.5, color: '#e0f2fe' },
    { id: 'ribbon_win', label: 'Ribbon Window', width: 8.0, height: 1.2, color: '#bae6fd' },
    { id: 'picture_win', label: 'Picture Window', width: 4.5, height: 4.5, color: '#f0f9ff' },
    { id: 'porthole', label: 'Tall Narrow', width: 1.0, height: 4.5, color: '#e0f2fe' },
  ]
};

export const PRESET_PALETTES: ColorPalette[] = [
  {
    name: 'Modern Minimalist',
    colors: ['#ffffff', '#f1f5f9', '#94a3b8', '#1e293b', '#0f172a']
  },
  {
    name: 'Nordic Forest',
    colors: ['#2d4a53', '#7a9d96', '#f2f2f2', '#bfbfbf', '#4a5759']
  },
  {
    name: 'Sunset Terracotta',
    colors: ['#e2725b', '#f9dcc4', '#f8ad9d', '#ffb5a7', '#fcd5ce']
  },
  {
    name: 'Industrial Loft',
    colors: ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429']
  }
];

export const SIDE_LABELS: Record<string, string> = {
  wall_north: 'North Wall',
  wall_south: 'South Wall',
  wall_east: 'East Wall',
  wall_west: 'West Wall',
  floor: 'Floor',
  ceiling: 'Ceiling'
};
