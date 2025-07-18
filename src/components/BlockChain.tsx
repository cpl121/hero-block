'use client';

import { useRef } from 'react'
import Block from './Block'
import { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import Chain from './Chain';
import BlockJoint from './BlockJoint';

// function randomPosition(): [number, number, number] {
//   return [
//     (Math.random() - 0.5) * 10,  // X entre -5 y 5
//     Math.random() * 10 + 5,      // Y entre 5 y 15
//     (Math.random() - 0.5) * 10   // Z entre -5 y 5
//   ];
// }

// function randomPositionAround(origin: [number, number, number], radius = 5): [number, number, number] {
//   return [
//     origin[0] + (Math.random() - 0.5) * radius,
//     origin[1] + (Math.random() - 0.5) * radius,
//     origin[2] + (Math.random() - 0.5) * radius,
//   ]
// }


const BlockChain = () => {
  const count = 12
  const spread = 4

  const rigidRefs = useRef<RapierRigidBody[]>([])
  const visualRefs = useRef<THREE.Object3D[]>([])

  const positions: [number, number, number][] = []

  for (let i = 0; i < count; i++) {
    if (i === 0) {
      positions.push([0, 0, 0])
    } else {
      const prev = positions[i - 1]
      const offset: [number, number, number] = [
        prev[0] + (Math.random() - 0.5) * spread,
        prev[1] + (Math.random() - 0.5) * spread,
        prev[2] + (Math.random() - 0.5) * spread,
      ]
      positions.push(offset)
    }
  }

  return (
    <>
      {/* Bloques */}
      {positions.map((pos, i) => (
        <Block
          key={i}
          ref={(ref) => {
            if (ref) rigidRefs.current[i] = ref
          }}
          visualRef={(ref: THREE.Object3D | null) => {
            if (ref) visualRefs.current[i] = ref
          }}
          position={pos}
          type={i === 0 ? 'fixed' : 'dynamic'}
        />
      ))}

      {/* Joints físicos */}
      {positions.slice(1).map((_, i) => (
        <BlockJoint
          key={`joint-${i}`}
          a={{ current: rigidRefs.current[i] }}
          b={{ current: rigidRefs.current[i + 1] }}
        />
      ))}

      {/* Cuerdas visuales */}
      {positions.slice(1).map((_, i) => (
        <Chain
          key={`rope-${i}`}
          startRef={{ current: visualRefs.current[i] }}
          endRef={{ current: visualRefs.current[i + 1] }}
          color="white"
          radius={0.1}
        />
      ))}
    </>
  )
}

export default BlockChain