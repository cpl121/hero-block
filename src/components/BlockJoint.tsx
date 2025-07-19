import { useSphericalJoint, RapierRigidBody } from '@react-three/rapier'
import { RefObject } from 'react'

type BlockJointProps = {
  a: RefObject<RapierRigidBody>
  b: RefObject<RapierRigidBody>
}

const BlockJoint = ({ a, b }: BlockJointProps) => {
    useSphericalJoint(a, b, [
        [1.5, 0, 0],
        [-1.5, 0, 0],
      ])
  return null
}

export default BlockJoint