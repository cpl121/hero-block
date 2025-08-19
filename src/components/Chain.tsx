'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

type ChainProps = {
  startRef: React.RefObject<THREE.Object3D>;
  endRef: React.RefObject<THREE.Object3D>;
  segments?: number;
  radius?: number;
  color?: string;
};

const Chain = ({ startRef, endRef, segments = 12, radius = 0.05, color = 'gray' }: ChainProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (!startRef.current || !endRef.current || !meshRef.current) return;

    const start = startRef.current.getWorldPosition(new THREE.Vector3());
    const end = endRef.current.getWorldPosition(new THREE.Vector3());
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    const geometry = new THREE.TubeGeometry(curve, segments, radius, 8, false);

    meshRef.current.geometry.dispose();
    meshRef.current.geometry = geometry;
  });

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Chain;
