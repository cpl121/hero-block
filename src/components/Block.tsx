'use client';
// import { useEffect, useMemo, useRef } from 'react';
import vert from '@/shaders/basic.vert';
import frag from '@/shaders/basic.frag';
import * as THREE from 'three';
import { useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Block = () => {
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime
    
    // if (meshRef.current) {
    //   meshRef.current.rotation.x = - elapsedTime * 0.1
    //   meshRef.current.rotation.y = elapsedTime * 0.2
    // }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} receiveShadow>
      <RoundedBox args={[3, 3, 0.25]} radius={0.1}>
        <shaderMaterial
          ref={shaderRef}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fragmentShader={frag}
          vertexShader={vert}
          uniforms={{
            uTime: new THREE.Uniform(0),
            uColor: new THREE.Uniform(new THREE.Color('#009987'))
        }}
        />
      </RoundedBox>
    </mesh>
  );
};

export default Block