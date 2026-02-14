
import React, { useState } from 'react';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { RoomConfig, RoomSide, RoomItem, RoomDimensions } from '../types';
import RoomItem3D from './RoomItem3D';
import SurfaceMotif3D from './SurfaceMotif3D';

interface Room3DProps {
  dimensions: RoomDimensions;
  config: RoomConfig;
  items: RoomItem[];
  selectedSide: RoomSide;
  selectedItemId: string | null;
  onSideClick: (side: RoomSide) => void;
  onItemSelect: (id: string) => void;
  onItemUpdate: (id: string, x: number, y: number) => void;
}

const Room3D: React.FC<Room3DProps> = ({ 
  dimensions,
  config, 
  items, 
  selectedSide, 
  selectedItemId,
  onSideClick, 
  onItemSelect,
  onItemUpdate 
}) => {
  const [hoveredSide, setHoveredSide] = useState<RoomSide | null>(null);
  
  const { width, length, height } = dimensions;

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
      emissiveIntensity: isSelected ? 0.05 : (isHovered ? 0.02 : 0),
    };
  };

  const renderWallItems = (wallSide: RoomSide) => {
    let wallW = width;
    if (wallSide === 'wall_east' || wallSide === 'wall_west') {
      wallW = length;
    }

    return items
      .filter(item => item.wall === wallSide)
      .map(item => (
        <RoomItem3D 
          key={item.id} 
          item={item} 
          onUpdate={onItemUpdate}
          onSelect={onItemSelect}
          isSelected={selectedItemId === item.id}
          wallWidth={wallW}
          wallHeight={height}
        />
      ));
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[width * 1.5, height * 1.5, length * 1.5]} fov={50} />
      <OrbitControls 
        minPolarAngle={0.1} 
        maxPolarAngle={Math.PI / 1.8} 
        enableDamping={true}
        dampingFactor={0.05}
        target={[0, height / 2, 0]}
        makeDefault
      />
      
      <ambientLight intensity={0.6} />
      <pointLight position={[0, height * 0.8, 0]} intensity={1.5} distance={width * 3} decay={2} />
      <spotLight position={[width, height * 1.5, length]} angle={0.4} penumbra={1} intensity={2.5} castShadow />

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
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial {...getMaterialProps('floor')} />
        <SurfaceMotif3D motif={config.floor.motif} width={width} height={length} color={config.floor.color} />
      </mesh>

      {/* Ceiling */}
      <mesh 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, height, 0]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('ceiling'); }}
        onPointerOver={(e) => handlePointerOver(e, 'ceiling')}
        onPointerOut={handlePointerOut}
        name="wall-ceiling"
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial {...getMaterialProps('ceiling')} />
        <SurfaceMotif3D motif={config.ceiling.motif} width={width} height={length} color={config.ceiling.color} />
      </mesh>

      {/* North Wall */}
      <mesh 
        position={[0, height / 2, -length / 2]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('wall_north'); }}
        onPointerOver={(e) => handlePointerOver(e, 'wall_north')}
        onPointerOut={handlePointerOut}
        name="wall-wall_north"
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial {...getMaterialProps('wall_north')} />
        <SurfaceMotif3D motif={config.wall_north.motif} width={width} height={height} color={config.wall_north.color} />
        {renderWallItems('wall_north')}
      </mesh>

      {/* South Wall */}
      <mesh 
        rotation={[0, Math.PI, 0]} 
        position={[0, height / 2, length / 2]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('wall_south'); }}
        onPointerOver={(e) => handlePointerOver(e, 'wall_south')}
        onPointerOut={handlePointerOut}
        name="wall-wall_south"
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial {...getMaterialProps('wall_south')} />
        <SurfaceMotif3D motif={config.wall_south.motif} width={width} height={height} color={config.wall_south.color} />
        {renderWallItems('wall_south')}
      </mesh>

      {/* East Wall */}
      <mesh 
        rotation={[0, -Math.PI / 2, 0]} 
        position={[width / 2, height / 2, 0]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('wall_east'); }}
        onPointerOver={(e) => handlePointerOver(e, 'wall_east')}
        onPointerOut={handlePointerOut}
        name="wall-wall_east"
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial {...getMaterialProps('wall_east')} />
        <SurfaceMotif3D motif={config.wall_east.motif} width={length} height={height} color={config.wall_east.color} />
        {renderWallItems('wall_east')}
      </mesh>

      {/* West Wall */}
      <mesh 
        rotation={[0, Math.PI / 2, 0]} 
        position={[-width / 2, height / 2, 0]} 
        onClick={(e) => { e.stopPropagation(); onSideClick('wall_west'); }}
        onPointerOver={(e) => handlePointerOver(e, 'wall_west')}
        onPointerOut={handlePointerOut}
        name="wall-wall_west"
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial {...getMaterialProps('wall_west')} />
        <SurfaceMotif3D motif={config.wall_west.motif} width={length} height={height} color={config.wall_west.color} />
        {renderWallItems('wall_west')}
      </mesh>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={Math.max(width, length) * 2} blur={2.5} far={height} />
      <Environment preset="apartment" />
    </>
  );
};

export default Room3D;
