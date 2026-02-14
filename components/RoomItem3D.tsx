
import React, { useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { RoomItem } from '../types';

interface RoomItem3DProps {
  item: RoomItem;
  onUpdate: (id: string, x: number, y: number) => void;
  wallWidth: number;
  wallHeight: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const RoomItem3D: React.FC<RoomItem3DProps> = ({ item, onUpdate, wallWidth, wallHeight, isSelected, onSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(true);
    onSelect(item.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();

    if (e.intersections.length > 0) {
      const intersect = e.intersections.find(i => i.object.name === `wall-${item.wall}`);
      if (intersect) {
        const localPoint = intersect.point.clone();
        intersect.object.worldToLocal(localPoint);
        
        const halfW = item.width / 2;
        const halfH = item.height / 2;
        
        // Always clamp horizontal position
        const newX = Math.max(-wallWidth/2 + halfW, Math.min(wallWidth/2 - halfW, localPoint.x));
        
        let newY = localPoint.y;
        if (item.type === 'door' || item.type === 'stairs') {
          // Snap bottom to floor (-wallHeight/2)
          newY = -wallHeight / 2 + halfH;
        } else {
          // Clamp window within wall vertical bounds
          newY = Math.max(-wallHeight/2 + halfH, Math.min(wallHeight/2 - halfH, localPoint.y));
        }
        
        onUpdate(item.id, newX, newY);
      }
    }
  };

  const steps = useMemo(() => {
    if (item.type !== 'stairs') return [];
    const stepHeight = 0.2; // 20cm steps
    const numSteps = Math.ceil(item.height / stepHeight);
    const calculatedStepHeight = item.height / numSteps;
    const stepDepth = item.width / numSteps;
    
    return Array.from({ length: numSteps }).map((_, i) => ({
      width: stepDepth * (i + 1),
      height: calculatedStepHeight,
      y: -item.height / 2 + (i + 0.5) * calculatedStepHeight,
      x: -item.width / 2 + (stepDepth * (i + 1)) / 2
    }));
  }, [item.type, item.width, item.height]);

  return (
    <group position={[item.x, item.y, 0.02]}>
      {item.type === 'stairs' ? (
        <group onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove}>
          {/* Main profile mesh for interaction area */}
          <mesh visible={false}>
            <planeGeometry args={[item.width, item.height]} />
          </mesh>
          {/* Render individual steps */}
          {steps.map((step, idx) => (
            <mesh key={idx} position={[step.x, step.y, 0.05]}>
              <boxGeometry args={[step.width, step.height, 0.15]} />
              <meshStandardMaterial 
                color={item.color} 
                metalness={0.4} 
                roughness={0.3}
                emissive={isSelected ? '#3b82f6' : '#000000'}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>
          ))}
          {/* Handrail simulation */}
          <mesh position={[0, 0, 0.15]}>
             <boxGeometry args={[item.width, 0.04, 0.04]} />
             <meshStandardMaterial color="#000" />
          </mesh>
        </group>
      ) : (
        <>
          <mesh
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
          >
            <planeGeometry args={[item.width, item.height]} />
            <meshStandardMaterial 
              color={item.color} 
              metalness={item.type === 'window' ? 0.6 : 0.2} 
              roughness={item.type === 'window' ? 0.1 : 0.8}
              emissive={isSelected ? '#3b82f6' : '#000000'}
              emissiveIntensity={isSelected ? 0.3 : 0}
              transparent={item.type === 'window'}
              opacity={item.type === 'window' ? 0.7 : 1}
            />
          </mesh>
          
          {/* Structural Frame */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[item.width + 0.15, item.height + 0.15]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Decorative Door Handle or Window Grille */}
          {item.type === 'door' ? (
            <mesh position={[item.width * 0.35, -0.2, 0.05]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.1} />
            </mesh>
          ) : (
            <group>
              <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[item.width, 0.04]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[0.04, item.height]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            </group>
          )}
        </>
      )}
    </group>
  );
};

export default RoomItem3D;
