'use client';
import { useEffect, useRef } from 'react';
import vert from '@/shaders/basic.vert';
import frag from '@/shaders/basic.frag';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { useGui } from '@/hooks';

const CustomShader = () => {
  const gui = useGui();
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);

  const alphaMap = useLoader(THREE.TextureLoader, '/assets/alpha.jpg');

  useEffect(() => {
    if (!gui || !shaderRef.current) return;

    gui.add(shaderRef.current, 'transparent');

    return () => gui.destroy();
  }, [gui]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10, 100, 100]} />
      <shaderMaterial
        ref={shaderRef}
        transparent
        depthWrite={false}
        fragmentShader={frag}
        vertexShader={vert}
        uniforms={{
          alphaMap: { value: alphaMap },
        }}
      />
    </mesh>
  );
};

export default CustomShader;
