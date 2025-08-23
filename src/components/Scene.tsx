/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas } from '@react-three/fiber';
import { CanvasLoader, GuiProvider, PhysicsBoundary } from '@/components';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useState } from 'react';
import { Physics } from '@react-three/rapier';
import BlockChain from './BlockChain'; 

function BlockChainWithTriggers() {
  const [addTrigger, setAddTrigger] = useState(0);
  const [removeTrigger, setRemoveTrigger] = useState(0);
  const [blockCount, setBlockCount] = useState(5);

  (window as any).addBlockTrigger = () => {
    setAddTrigger(prev => prev + 1);
  };

  (window as any).removeBlockTrigger = () => {
    if (blockCount > 1) {
      setRemoveTrigger(prev => prev + 1);
    }
  };

  (window as any).getBlockCount = () => blockCount;

  return (
    <BlockChain 
      addTrigger={addTrigger}
      removeTrigger={removeTrigger}
      onBlockCountChange={setBlockCount}
    />
  );
}

const Scene = () => {
  const [blockCount, setBlockCount] = useState(5);

  const handleAddBlock = () => {
    if ((window as any).addBlockTrigger) {
      (window as any).addBlockTrigger();
      setTimeout(() => {
        if ((window as any).getBlockCount) {
          setBlockCount((window as any).getBlockCount());
        }
      }, 100);
    }
  };

  const handleRemoveBlock = () => {
    if (blockCount > 1 && (window as any).removeBlockTrigger) {
      (window as any).removeBlockTrigger();
      setTimeout(() => {
        if ((window as any).getBlockCount) {
          setBlockCount((window as any).getBlockCount());
        }
      }, 100);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
      }}>
        <button
          onClick={handleAddBlock}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
        >
          ➕ Añadir Bloque
        </button>
        
        <button
          onClick={handleRemoveBlock}
          disabled={blockCount <= 1}
          style={{
            padding: '12px 24px',
            backgroundColor: blockCount <= 1 ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: blockCount <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: blockCount <= 1 ? 'none' : '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            opacity: blockCount <= 1 ? 0.6 : 1,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => {
            if (blockCount > 1) {
              e.currentTarget.style.backgroundColor = '#da190b';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (blockCount > 1) {
              e.currentTarget.style.backgroundColor = '#f44336';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }
          }}
        >
          ➖ Quitar Bloque
        </button>
        
        <div style={{
          padding: '10px 16px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '14px',
          textAlign: 'center',
          marginTop: '10px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '500',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          🔗 Bloques: {blockCount}
        </div>

        <div style={{
          padding: '10px 16px',
          backgroundColor: 'rgba(0,100,200,0.8)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '5px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '200px'
        }}>
          💡 Arrastra cualquier bloque para mover la cadena
        </div>
      </div>

      <GuiProvider>
        <Canvas
          camera={{ position: [4, 2, 15], fov: 75 }}
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

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={false}
          />

          <Suspense fallback={<CanvasLoader />} name={'Loader'}>
            <Environment preset="studio" />
            <Physics gravity={[0, 0, 0]}>
              <PhysicsBoundary size={20} />
              <BlockChainWithTriggers />
            </Physics>
          </Suspense>
        </Canvas>
      </GuiProvider>
    </div>
  );
};

export default Scene;