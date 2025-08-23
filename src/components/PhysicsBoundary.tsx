import { RigidBody } from '@react-three/rapier';

const PhysicsBoundary = ({ size }: { size: number }) => {
  const half = size / 2;

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid" position={[0, -half, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial opacity={0} transparent side={2} />
          {/* <meshStandardMaterial color="gray" opacity={0.5} transparent side={2} /> */}
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[0, half, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial opacity={0} transparent side={2} />
          {/* <meshStandardMaterial color="gray" opacity={0.5} transparent side={2} /> */}
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[-half, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial opacity={0} transparent side={2} />
          {/* <meshStandardMaterial color="blue" opacity={0.3} transparent side={2} /> */}
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[half, 0, 0]}>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial opacity={0} transparent side={2} />
          {/* <meshStandardMaterial color="blue" opacity={0.3} transparent side={2} /> */}
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[0, 0, -half]}>
        <mesh rotation={[0, 0, 0]}>
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial opacity={0} transparent side={2} />
          {/* <meshStandardMaterial color="orange" opacity={0.3} transparent side={2} /> */}
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[0, 0, half]}>
        <mesh rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial opacity={0} transparent side={2} />
          {/* <meshStandardMaterial color="orange" opacity={0.3} transparent side={2} /> */}
        </mesh>
      </RigidBody>
    </>
  );
};

export default PhysicsBoundary;
