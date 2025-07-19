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

  const [ready, setReady] = useState(false)

  useEffect(() => {
    const allRigid = rigidRefs.current.length === count && rigidRefs.current.every(r => r)
    const allVisual = visualRefs.current.length === count && visualRefs.current.every(r => r)

    if (allRigid && allVisual) {
      setReady(true)
    }
  }, [rigidRefs.current.length, visualRefs.current.length]) // Dependencias seguras

  const positions = Array.from({ length: count }, (_, i) => [i * spacing, 0, 0] as [number, number, number])

  return (
    <>
      {positions.map((pos, i) => (
        <Block
          key={i}
          ref={(ref) => { if (ref) rigidRefs.current[i] = ref }}
          visualRef={(ref) => { if (ref) visualRefs.current[i] = ref }}
          position={pos}
          type={'dynamic'}
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