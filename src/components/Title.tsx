'use client';
// import { useEffect, useMemo, useRef } from 'react';
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
      color: '#009987'
    }
}, [])


// useEffect(() => {
//   if (!gui || !shaderRef.current) return;

//   gui.add(shaderRef.current, 'transparent');
//   gui
//   .addColor(materialParameters, 'color')
//   .onChange(() =>
//   {
//     shaderRef.current?.uniforms.uColor.value.set(materialParameters.color)
//   })

//   return () => gui.destroy();
// }, [gui, materialParameters]);

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
    <Center top left>
      <Text3D
        font={"./fonts/helvetiker_regular.typeface.json"}
        ref={meshRef}
      >
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
            uColor: new THREE.Uniform(new THREE.Color(materialParameters.color))
        }}
        />
      </Text3D>
    </Center>
  );
};

export default Title