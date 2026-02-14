
export type RoomSide = 'wall_north' | 'wall_south' | 'wall_east' | 'wall_west' | 'floor' | 'ceiling';

export type ItemType = 'door' | 'window' | 'stairs';

export type MotifType = 'none' | 'pvc_panels' | 'shiplap' | 'molding' | 'wood_planks' | 'tiles' | 'coffered' | 'perimeter_trim';

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

export interface RoomItem {
  id: string;
  type: ItemType;
  wall: RoomSide;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface SideState {
  color: string;
  roughness: number;
  metalness: number;
  motif: MotifType;
}

export interface RoomConfig {
  wall_north: SideState;
  wall_south: SideState;
  wall_east: SideState;
  wall_west: SideState;
  floor: SideState;
  ceiling: SideState;
}

export interface ColorPalette {
  name: string;
  colors: string[];
}
