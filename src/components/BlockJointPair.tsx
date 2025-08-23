import { useRef } from 'react';
import { useSphericalJoint, RapierRigidBody } from '@react-three/rapier';
import Block from './Block';
import * as THREE from 'three';
import Chain from './Chain';

type Props = {
  index: number;
  spacing: number;
  isFirst: boolean;
};

const BlockJointPair = ({ index, spacing, isFirst }: Props) => {
  const refA = useRef<RapierRigidBody>(null!);
  const refB = useRef<RapierRigidBody>(null!);

  const visA = useRef<THREE.Object3D>(null!);
  const visB = useRef<THREE.Object3D>(null!);

  useSphericalJoint(refA, refB, [
    [1.5, 0, 0],
    [-1.5, 0, 0],
  ]);

  const xA = index * spacing;
  const xB = (index + 1) * spacing;

  return (
    <>
      <Block
        ref={refA}
        visualRef={visA}
        type={isFirst ? 'fixed' : 'dynamic'}
        position={[xA, 0, 0]}
      />
      <Block ref={refB} visualRef={visB} type="dynamic" position={[xB, 0, 0]} />
      <Chain startRef={visA} endRef={visB} color="white" radius={0.2} />
    </>
  );
};

export default BlockJointPair;
