'use client';
import vert from '@/shaders/basic.vert';
import frag from '@/shaders/basic.frag';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { Center, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Title = () => {
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialParameters = useMemo(() => {
    return {
      color: '#009987',
    };
  }, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime;

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsedTime;
    }
  });

  return (
    <Center top>
      <Text3D font={'./fonts/helvetiker_regular.typeface.json'} ref={meshRef} scale={2}>
        NextBlock
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
            uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
          }}
        />
      </Text3D>
    </Center>
  );
};

export default Title;
