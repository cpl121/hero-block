'use client';
import { useEffect, useMemo, useRef } from 'react';
import vert from '@/shaders/basic.vert';
import frag from '@/shaders/basic.frag';
import * as THREE from 'three';
import { useGui } from '@/hooks';
import { useFrame } from '@react-three/fiber';

const Holographic = () => {
  const gui = useGui();
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const materialParameters = useMemo(() => {
      return {
        color: '#009987'
      }
  }, [])

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(5, 0);
    s.lineTo(5, 5);
    s.lineTo(0, 5);
    s.lineTo(0, 0);
    return s;
  }, []);

  const extrudeSettings = {
    steps: 4,
    depth: 15,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 3,
    bevelOffset: 1,
    bevelSegments: 2,
  };


  useEffect(() => {
    if (!gui || !shaderRef.current) return;

    gui.add(shaderRef.current, 'transparent');
    gui
    .addColor(materialParameters, 'color')
    .onChange(() =>
    {
      shaderRef.current?.uniforms.uColor.value.set(materialParameters.color)
    })

    return () => gui.destroy();
  }, [gui, materialParameters]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime
    
    if (meshRef.current) {
      meshRef.current.rotation.x = - elapsedTime * 0.1
      meshRef.current.rotation.y = elapsedTime * 0.2
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsedTime
    }
  })

  return (
    <mesh receiveShadow ref={meshRef} scale={0.3}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
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
          uColor: new THREE.Uniform(new THREE.Color(materialParameters.color))
      }}
      />
    </mesh>
  );
};

export default Holographic;
