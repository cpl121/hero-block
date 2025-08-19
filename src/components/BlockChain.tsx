'use client';

import { useEffect, useRef, useState } from 'react'
import Block from './Block'
import { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import Chain from './Chain';
import BlockJoint from './BlockJoint';

interface BlockData {
  id: string;
  position: [number, number, number];
}

const BlockChain = () => {
  const spacing = 4
  const [blocks, setBlocks] = useState<BlockData[]>(() => {
    // Inicializar con 5 bloques por defecto
    return Array.from({ length: 5 }, (_, i) => ({
      id: `block-${i}`,
      position: [i * spacing, 0, 0] as [number, number, number]
    }));
  });

  const rigidRefs = useRef<{ [key: string]: RapierRigidBody }>({})
  const visualRefs = useRef<{ [key: string]: THREE.Object3D }>({})
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const [ready, setReady] = useState(false)

  // Verificar si todos los refs están listos
  useEffect(() => {
    const allRigidReady = blocks.every(block => rigidRefs.current[block.id])
    const allVisualReady = blocks.every(block => visualRefs.current[block.id])

    if (allRigidReady && allVisualReady && blocks.length > 0) {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [blocks.length, Object.keys(rigidRefs.current).length, Object.keys(visualRefs.current).length])

  // Función para añadir un bloque
  const addBlock = () => {
    const newIndex = blocks.length;
    const newBlock: BlockData = {
      id: `block-${Date.now()}`, // ID único
      position: [newIndex * spacing, 0, 0]
    };
    
    setBlocks(prev => [...prev, newBlock]);
  };

  // Función para quitar el último bloque
  const removeBlock = () => {
    if (blocks.length <= 1) return; // Mantener al menos un bloque
    
    const lastBlock = blocks[blocks.length - 1];
    
    // Limpiar refs del bloque eliminado
    delete rigidRefs.current[lastBlock.id];
    delete visualRefs.current[lastBlock.id];
    
    setBlocks(prev => prev.slice(0, -1));
    
    // Si el bloque arrastrado era el eliminado, resetear
    if (draggedIndex === blocks.length - 1) {
      setDraggedIndex(null);
    }
  };

  // Función para hacer la cadena más ligera durante el drag
  const makeChainLighter = (draggedIndex: number, lighter: boolean) => {
    if (!ready || draggedIndex < 0 || draggedIndex >= blocks.length) return;

    const affectedRange = 4;
    
    blocks.forEach((block, i) => {
      const body = rigidRefs.current[block.id];
      if (!body) return;
      
      const distance = Math.abs(i - draggedIndex);
      if (distance <= affectedRange) {
        const effect = Math.max(0.1, 1 - (distance / affectedRange) * 0.8);
        
        if (lighter) {
          body.setAdditionalMass(-effect * 0.7, true);
          body.setLinearDamping(0.1);
          body.setAngularDamping(0.1);
        } else {
          body.setAdditionalMass(0, true);
          body.setLinearDamping(0.5);
          body.setAngularDamping(0.5);
        }
      }
    });
  };

  // Función para propagar fuerzas a través de la cadena cuando se arrastra un bloque
  const propagateChainForces = (draggedIndex: number) => {
    if (!ready || draggedIndex < 0 || draggedIndex >= blocks.length) return;

    const draggedBlock = blocks[draggedIndex];
    const draggedBody = rigidRefs.current[draggedBlock.id];
    if (!draggedBody) return;

    const draggedVel = draggedBody.linvel();
    const draggedPos = draggedBody.translation();
    if (!draggedVel || !draggedPos) return;

    const maxPropagationDistance = 5;
    const baseForceMagnitude = 35;

    for (let distance = 1; distance <= maxPropagationDistance; distance++) {
      const forceMultiplier = Math.pow(0.7, distance);

      [draggedIndex - distance, draggedIndex + distance].forEach(targetIndex => {
        if (targetIndex >= 0 && targetIndex < blocks.length) {
          const targetBlock = blocks[targetIndex];
          const targetBody = rigidRefs.current[targetBlock.id];
          if (!targetBody) return;

          const targetPos = targetBody.translation();
          if (!targetPos) return;

          const velocityFactor = Math.min(1, Math.sqrt(
            draggedVel.x * draggedVel.x + 
            draggedVel.y * draggedVel.y + 
            draggedVel.z * draggedVel.z
          ) / 5);

          const force = {
            x: draggedVel.x * baseForceMagnitude * forceMultiplier * velocityFactor * 0.016,
            y: draggedVel.y * baseForceMagnitude * forceMultiplier * velocityFactor * 0.016,
            z: draggedVel.z * baseForceMagnitude * forceMultiplier * velocityFactor * 0.016,
          };
          
          targetBody.applyImpulse(force, true);
          
          const directionToTarget = {
            x: draggedPos.x - targetPos.x,
            y: draggedPos.y - targetPos.y,
            z: draggedPos.z - targetPos.z,
          };
          
          const directionMagnitude = Math.sqrt(
            directionToTarget.x * directionToTarget.x +
            directionToTarget.y * directionToTarget.y +
            directionToTarget.z * directionToTarget.z
          );
          
          if (directionMagnitude > 0) {
            const normalizedDirection = {
              x: directionToTarget.x / directionMagnitude,
              y: directionToTarget.y / directionMagnitude,
              z: directionToTarget.z / directionMagnitude,
            };
            
            const alignmentForce = baseForceMagnitude * 0.3 * forceMultiplier * 0.016;
            targetBody.applyImpulse({
              x: normalizedDirection.x * alignmentForce,
              y: normalizedDirection.y * alignmentForce,
              z: normalizedDirection.z * alignmentForce,
            }, true);
          }
        }
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    makeChainLighter(index, true);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      makeChainLighter(draggedIndex, false);
    }
    setDraggedIndex(null);
  };

  // Usar useEffect para propagar fuerzas cuando hay un bloque siendo arrastrado
  useEffect(() => {
    if (draggedIndex !== null) {
      const interval = setInterval(() => {
        propagateChainForces(draggedIndex);
      }, 16);

      return () => clearInterval(interval);
    }
  }, [draggedIndex, ready]);

  return (
    <>
      {/* Botones de control */}
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
          onClick={addBlock}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ➕ Añadir Bloque
        </button>
        
        <button
          onClick={removeBlock}
          disabled={blocks.length <= 1}
          style={{
            padding: '10px 20px',
            backgroundColor: blocks.length <= 1 ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: blocks.length <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: blocks.length <= 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            opacity: blocks.length <= 1 ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (blocks.length > 1) {
              e.currentTarget.style.backgroundColor = '#da190b';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (blocks.length > 1) {
              e.currentTarget.style.backgroundColor = '#f44336';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          ➖ Quitar Bloque
        </button>
        
        <div style={{
          padding: '8px 12px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          borderRadius: '5px',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '5px'
        }}>
          Bloques: {blocks.length}
        </div>
      </div>

      {/* Renderizar bloques */}
      {blocks.map((block, i) => (
        <Block
          key={block.id}
          ref={(ref) => { 
            if (ref) {
              rigidRefs.current[block.id] = ref;
            } else {
              delete rigidRefs.current[block.id];
            }
          }}
          visualRef={(ref) => { 
            if (ref) {
              visualRefs.current[block.id] = ref;
            } else {
              delete visualRefs.current[block.id];
            }
          }}
          position={block.position}
          type={'dynamic'}
          onDragStart={() => handleDragStart(i)}
          onDragEnd={handleDragEnd}
        />
      ))}

      {/* Renderizar joints entre bloques consecutivos */}
      {ready && blocks.slice(0, -1).map((block, i) => {
        const nextBlock = blocks[i + 1];
        return (
          <BlockJoint
            key={`joint-${block.id}-${nextBlock.id}`}
            a={{ current: rigidRefs.current[block.id] }}
            b={{ current: rigidRefs.current[nextBlock.id] }}
          />
        );
      })}

      {/* Renderizar cadenas entre bloques consecutivos */}
      {ready && blocks.slice(0, -1).map((block, i) => {
        const nextBlock = blocks[i + 1];
        return (
          <Chain
            key={`chain-${block.id}-${nextBlock.id}`}
            startRef={{ current: visualRefs.current[block.id] }}
            endRef={{ current: visualRefs.current[nextBlock.id] }}
            radius={0.1}
            color="white"
          />
        );
      })}
    </>
  )
}

export default BlockChain