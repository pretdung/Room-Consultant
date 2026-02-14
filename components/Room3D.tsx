
import React, { useState } from 'react';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { RoomConfig, RoomSide, RoomItem } from '../types';
import RoomItem3D from './RoomItem3D';

interface Room3DProps {
  config: RoomConfig;
  items: RoomItem[];
  selectedSide: RoomSide;
  selectedItemId: string | null;
  onSideClick: (side: RoomSide) => void;
  onItemSelect: (id: string) => void;
  onItemUpdate: (id: string, x: number, y: number) => void;
}

const Room3D: React.FC<Room3DProps> = ({ 
  config, 
  items, 
  selectedSide, 
  selectedItemId,
  onSideClick, 
  onItemSelect,
  onItemUpdate 
}) => {
  const [hoveredSide, setHoveredSide] = useState<RoomSide | null>(null);
  
  const ROOM_SIZE = 10;
  const WALL_HEIGHT = 6;

  const handlePointerOver = (e: any, side: RoomSide) => {
    e.stopPropagation();
    setHoveredSide(side);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHoveredSide(null);
    document.body.style.cursor = 'auto';
  };

  const getMaterialProps = (side: RoomSide) => {
    const isSelected = selectedSide === side;
    const isHovered = hoveredSide === side;
    
    return {
      color: config[side].color,
      roughness: config[side].roughness,
      metalness: config[side].metalness,
      side: THREE.FrontSide,
      emissive: isSelected ? '#ffffff' : (isHovered ? '#222222' : '#000000'),
      emissiveIntensity: isSelected ? 0.1 : (isHovered ? 0.05 : 0),
    };
  };

  const renderWallItems = (wallSide: RoomSide) => {
    return items
      .filter(item => item.wall === wallSide)
      .map(item => (
        <RoomItem3D 
          key={item.id} 
          item={item} 
          onUpdate={onItemUpdate}
          onSelect={onItemSelect}
          isSelected={selectedItemId === item.id}
          wallWidth={ROOM_SIZE}
          wallHeight={WALL_HEIGHT}
        />
      ));
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={60} />
      <OrbitControls 
        minPolarAngle={0.1} 
        maxPolarAngle={Math.PI / 1.8} 
        enableDamping={true}
        dampingFactor={0.05}
        target={[0, 2, 0]}
        makeDefault
      />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 0]} intensity={1.5} distance={15} decay={2} />
      <spotLight position={[5, 8, 5]} angle={0.4} penumbra={1} intensity={2} castShadow />

      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onSideClick('floor'); }}
        onPointerOver={(e) => handlePointerOver(e, 'floor')}
        onPointerOut={handlePointerOut}
        name="wall-floor"
      >
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial {...getMaterialProps('floor')} />
      </mesh>

      {/* Ceiling */}
      <mesh 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, WALL_HEIGHT, 0]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('ceiling'); }}
        onPointerOver={(e) => handlePointerOver(e, 'ceiling')}
        onPointerOut={handlePointerOut}
        name="wall-ceiling"
      >
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial {...getMaterialProps('ceiling')} />
      </mesh>

      {/* North Wall */}
      <mesh 
        position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('wall_north'); }}
        onPointerOver={(e) => handlePointerOver(e, 'wall_north')}
        onPointerOut={handlePointerOut}
        name="wall-wall_north"
      >
        <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
        <meshStandardMaterial {...getMaterialProps('wall_north')} />
        {renderWallItems('wall_north')}
      </mesh>

      {/* South Wall */}
      <mesh 
        rotation={[0, Math.PI, 0]} 
        position={[0, WALL_HEIGHT / 2, ROOM_SIZE / 2]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('wall_south'); }}
        onPointerOver={(e) => handlePointerOver(e, 'wall_south')}
        onPointerOut={handlePointerOut}
        name="wall-wall_south"
      >
        <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
        <meshStandardMaterial {...getMaterialProps('wall_south')} />
        {renderWallItems('wall_south')}
      </mesh>

      {/* East Wall */}
      <mesh 
        rotation={[0, -Math.PI / 2, 0]} 
        position={[ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('wall_east'); }}
        onPointerOver={(e) => handlePointerOver(e, 'wall_east')}
        onPointerOut={handlePointerOut}
        name="wall-wall_east"
      >
        <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
        <meshStandardMaterial {...getMaterialProps('wall_east')} />
        {renderWallItems('wall_east')}
      </mesh>

      {/* West Wall */}
      <mesh 
        rotation={[0, Math.PI / 2, 0]} 
        position={[-ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('wall_west'); }}
        onPointerOver={(e) => handlePointerOver(e, 'wall_west')}
        onPointerOut={handlePointerOut}
        name="wall-wall_west"
      >
        <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
        <meshStandardMaterial {...getMaterialProps('wall_west')} />
        {renderWallItems('wall_west')}
      </mesh>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={2.5} far={10} />
      <Environment preset="apartment" />
    </>
  );
};

export default Room3D;
