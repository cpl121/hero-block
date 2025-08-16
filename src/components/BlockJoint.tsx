import { useSphericalJoint, RapierRigidBody } from '@react-three/rapier'
import { RefObject } from 'react'

type BlockJointProps = {
  a: RefObject<RapierRigidBody>
  b: RefObject<RapierRigidBody>
  distance?: number
  stiffness?: number
  damping?: number
}

const BlockJoint = ({ 
  a, 
  b, 
  distance = 1.5,
}: BlockJointProps) => {
  useSphericalJoint(a, b, [
    [distance, 0, 0],
    [-distance, 0, 0],
  ]);

  return null
}

export default BlockJoint