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

  const propagateChainForces = (draggedIndex: number) => {
    if (!ready || draggedIndex < 0 || draggedIndex >= count) return;

    const draggedBody = rigidRefs.current[draggedIndex];
    if (!draggedBody) return;

    const draggedVel = draggedBody.linvel();
    if (!draggedVel) return;

    const maxPropagationDistance = 3;
    const baseForceMagnitude = 20;

    for (let distance = 1; distance <= maxPropagationDistance; distance++) {
      const forceMultiplier = Math.pow(0.6, distance);

      const leftIndex = draggedIndex - distance;
      if (leftIndex >= 0) {
        const leftBody = rigidRefs.current[leftIndex];
        if (leftBody) {
          const force = {
            x: draggedVel.x * baseForceMagnitude * forceMultiplier * 0.016,
            y: draggedVel.y * baseForceMagnitude * forceMultiplier * 0.016,
            z: draggedVel.z * baseForceMagnitude * forceMultiplier * 0.016,
          };
          leftBody.applyImpulse(force, true);
        }
      }

      const rightIndex = draggedIndex + distance;
      if (rightIndex < count) {
        const rightBody = rigidRefs.current[rightIndex];
        if (rightBody) {
          const force = {
            x: draggedVel.x * baseForceMagnitude * forceMultiplier * 0.016,
            y: draggedVel.y * baseForceMagnitude * forceMultiplier * 0.016,
            z: draggedVel.z * baseForceMagnitude * forceMultiplier * 0.016,
          };
          rightBody.applyImpulse(force, true);
        }
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  useEffect(() => {
    if (draggedIndex !== null) {
      const interval = setInterval(() => {
        propagateChainForces(draggedIndex);
      }, 16); // ~60fps

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