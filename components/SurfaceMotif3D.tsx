
import React from 'react';
import * as THREE from 'three';
import { MotifType } from '../types';

interface SurfaceMotif3DProps {
  motif: MotifType;
  width: number;
  height: number;
  color: string;
}

const SurfaceMotif3D: React.FC<SurfaceMotif3DProps> = ({ motif, width, height, color }) => {
  if (motif === 'none') return null;

  const motifColor = new THREE.Color(color).multiplyScalar(0.9); // Slightly darker for detail

  // Wall Motifs
  if (motif === 'pvc_panels') {
    const slats = 20;
    const slatWidth = width / slats;
    return (
      <group position={[0, 0, 0.01]}>
        {Array.from({ length: slats }).map((_, i) => (
          <mesh key={i} position={[-width / 2 + (i + 0.5) * slatWidth, 0, 0.01]}>
            <boxGeometry args={[slatWidth * 0.8, height, 0.05]} />
            <meshStandardMaterial color={motifColor} roughness={0.7} />
          </mesh>
        ))}
      </group>
    );
  }

  if (motif === 'shiplap') {
    const planks = 12;
    const plankHeight = height / planks;
    return (
      <group position={[0, 0, 0.01]}>
        {Array.from({ length: planks }).map((_, i) => (
          <mesh key={i} position={[0, -height / 2 + (i + 0.5) * plankHeight, 0.01]}>
            <boxGeometry args={[width, plankHeight * 0.95, 0.05]} />
            <meshStandardMaterial color={motifColor} roughness={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  if (motif === 'molding') {
    return (
      <group position={[0, 0, 0.02]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[width * 0.8, 0.05, 0.05]} />
          <meshStandardMaterial color={motifColor} />
        </mesh>
        <mesh position={[0, height * 0.4, 0]}>
          <boxGeometry args={[width * 0.8, 0.05, 0.05]} />
          <meshStandardMaterial color={motifColor} />
        </mesh>
        <mesh position={[width * 0.4, 0, 0]}>
          <boxGeometry args={[0.05, height * 0.8, 0.05]} />
          <meshStandardMaterial color={motifColor} />
        </mesh>
        <mesh position={[-width * 0.4, 0, 0]}>
          <boxGeometry args={[0.05, height * 0.8, 0.05]} />
          <meshStandardMaterial color={motifColor} />
        </mesh>
      </group>
    );
  }

  // Floor Motifs
  if (motif === 'wood_planks') {
    const plankCount = 15;
    const plankW = width / plankCount;
    return (
      <group position={[0, 0, 0.01]}>
        {Array.from({ length: plankCount }).map((_, i) => (
          <mesh key={i} position={[-width/2 + (i+0.5)*plankW, 0, 0]}>
            <boxGeometry args={[plankW * 0.98, height, 0.02]} />
            <meshStandardMaterial color={motifColor} roughness={0.6} metalness={0.1} />
          </mesh>
        ))}
      </group>
    );
  }

  if (motif === 'tiles') {
    const gridSize = 10;
    const tileS = width / gridSize;
    return (
      <group position={[0, 0, 0.01]}>
        {Array.from({ length: gridSize }).map((_, row) => 
          Array.from({ length: gridSize }).map((_, col) => (
            <mesh key={`${row}-${col}`} position={[-width/2 + (col+0.5)*tileS, -height/2 + (row+0.5)*tileS, 0]}>
              <boxGeometry args={[tileS * 0.96, tileS * 0.96, 0.02]} />
              <meshStandardMaterial color={motifColor} roughness={0.3} metalness={0.2} />
            </mesh>
          ))
        )}
      </group>
    );
  }

  // Ceiling Motifs
  if (motif === 'coffered') {
    const grid = 4;
    const step = width / grid;
    return (
      <group position={[0, 0, -0.1]}>
        {Array.from({ length: grid + 1 }).map((_, i) => (
          <React.Fragment key={i}>
            <mesh position={[-width/2 + i*step, 0, 0.05]}>
              <boxGeometry args={[0.2, height, 0.15]} />
              <meshStandardMaterial color={motifColor} />
            </mesh>
            <mesh position={[0, -height/2 + i*step, 0.05]}>
              <boxGeometry args={[width, 0.2, 0.15]} />
              <meshStandardMaterial color={motifColor} />
            </mesh>
          </React.Fragment>
        ))}
      </group>
    );
  }

  if (motif === 'perimeter_trim') {
    return (
      <group position={[0, 0, 0.05]}>
        <mesh position={[0, height/2 - 0.2, 0]}>
          <boxGeometry args={[width, 0.4, 0.1]} />
          <meshStandardMaterial color={motifColor} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, -height/2 + 0.2, 0]}>
          <boxGeometry args={[width, 0.4, 0.1]} />
          <meshStandardMaterial color={motifColor} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[width/2 - 0.2, 0, 0]}>
          <boxGeometry args={[0.4, height, 0.1]} />
          <meshStandardMaterial color={motifColor} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[-width/2 + 0.2, 0, 0]}>
          <boxGeometry args={[0.4, height, 0.1]} />
          <meshStandardMaterial color={motifColor} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>
    );
  }

  return null;
};

export default SurfaceMotif3D;
