import { Canvas } from '@react-three/fiber';
import { CanvasLoader, GuiProvider, BlockChain, PhysicsBoundary } from '@/components';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';

const Scene = () => {
  return (
    <GuiProvider>
      <Canvas
        camera={{ position: [4, 2, 10], fov: 75 }}
        shadows
        gl={{
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          shadowMapEnabled: true,
          shadowMapType: THREE.PCFSoftShadowMap,
        }}
      >
        <color attach="background" args={['#0b1220']} />
        <ambientLight intensity={1} color="#445566" />

        <Suspense fallback={<CanvasLoader />} name={'Loader'}>
          <Environment preset="studio"  />
          <Physics gravity={[0, 0, 0]}>
            <PhysicsBoundary size={20} />
            <BlockChain />
          </Physics>
        </Suspense>
      </Canvas>
    </GuiProvider>
  );
};

export default Scene;
