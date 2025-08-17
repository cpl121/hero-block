'use client';

import { useEffect, useRef, useState } from 'react'
import Block from './Block'
import { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import Chain from './Chain';
import BlockJoint from './BlockJoint';

const BlockChain = () => {
  const count = 12
  const spacing = 4

  const rigidRefs = useRef<RapierRigidBody[]>([])
  const visualRefs = useRef<THREE.Object3D[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const [ready, setReady] = useState(false)

  useEffect(() => {
    const allRigid = rigidRefs.current.length === count && rigidRefs.current.every(r => r)
    const allVisual = visualRefs.current.length === count && visualRefs.current.every(r => r)

    if (allRigid && allVisual) {
      setReady(true)
    }
  }, [rigidRefs.current.length, visualRefs.current.length])

  const positions = Array.from({ length: count }, (_, i) => [i * spacing, 0, 0] as [number, number, number])

  const makeChainLighter = (draggedIndex: number, lighter: boolean) => {
    if (!ready || draggedIndex < 0 || draggedIndex >= count) return;

    const affectedRange = 4; 
    
    for (let i = 0; i < count; i++) {
      const body = rigidRefs.current[i];
      if (!body) continue;
      
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
    }
  };

  const propagateChainForces = (draggedIndex: number) => {
    if (!ready || draggedIndex < 0 || draggedIndex >= count) return;

    const draggedBody = rigidRefs.current[draggedIndex];
    if (!draggedBody) return;

    const draggedVel = rigidRefs.current[draggedIndex]?.linvel();
    const draggedPos = rigidRefs.current[draggedIndex]?.translation();
    if (!draggedVel || !draggedPos) return;
    
    const maxPropagationDistance = 5; 
    const baseForceMagnitude = 35; 

    for (let distance = 1; distance <= maxPropagationDistance; distance++) {
      const forceMultiplier = Math.pow(0.7, distance); 

      [draggedIndex - distance, draggedIndex + distance].forEach(targetIndex => {
        if (targetIndex >= 0 && targetIndex < count) {
          const targetBody = rigidRefs.current[targetIndex];
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
      {positions.map((pos, i) => (
        <Block
          key={i}
          ref={(ref) => { if (ref) rigidRefs.current[i] = ref }}
          visualRef={(ref) => { if (ref) visualRefs.current[i] = ref }}
          position={pos}
          type={'dynamic'}
          onDragStart={() => handleDragStart(i)}
          onDragEnd={handleDragEnd}
        />
      ))}

      {ready && positions.slice(1).map((_, i) => (
        <BlockJoint
          key={`joint-${i}`}
          a={{ current: rigidRefs.current[i] }}
          b={{ current: rigidRefs.current[i + 1] }}
        />
      ))}

      {ready && positions.slice(1).map((_, i) => (
        <Chain
          key={`rope-${i}`}
          startRef={{ current: visualRefs.current[i] }}
          endRef={{ current: visualRefs.current[i + 1] }}
          radius={0.1}
          color="white"
        />
      ))}
    </>
  )
}

export default BlockChain