
export type RoomSide = 'wall_north' | 'wall_south' | 'wall_east' | 'wall_west' | 'floor' | 'ceiling';

export type ItemType = 'door' | 'window';

export interface RoomItem {
  id: string;
  type: ItemType;
  wall: RoomSide;
  x: number; // Local x coordinate on the wall plane
  y: number; // Local y coordinate on the wall plane
  width: number;
  height: number;
  color: string;
}

export interface SideState {
  color: string;
  roughness: number;
  metalness: number;
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
