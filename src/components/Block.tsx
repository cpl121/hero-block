'use client';

import { forwardRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { RapierRigidBody, RigidBody, RigidBodyProps } from '@react-three/rapier';
import * as THREE from 'three'

type BlockProps = RigidBodyProps & {
  position: [number, number, number];
  visualRef: React.Ref<THREE.Object3D>
};

const Block = forwardRef<RapierRigidBody, BlockProps>(({ position, visualRef, ...props }, ref) => {
  return (
    <RigidBody ref={ref} {...props} position={position} colliders="cuboid">
      <group ref={visualRef}>
        <RoundedBox args={[2, 2, 2]} radius={0.2}>
          <meshPhysicalMaterial
            transmission={0.25}
            transparent
            roughness={0.5}
            thickness={0.5}
            envMapIntensity={0.2}
            ior={1.5}
            reflectivity={0.6}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            color="aquamarine"
          />
        </RoundedBox>
      </group>
    </RigidBody>
  );
});

Block.displayName = 'Block';

export default Block;
