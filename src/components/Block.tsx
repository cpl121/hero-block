'use client';

import { forwardRef, useRef, useState, useCallback, useEffect } from 'react';
import { RoundedBox } from '@react-three/drei';
import { RapierRigidBody, RigidBody, RigidBodyProps } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

type BlockProps = RigidBodyProps & {
  position: [number, number, number];
  visualRef?: React.Ref<THREE.Object3D>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export interface BlockHandle {
  rigidBody: RapierRigidBody | null;
  setKinematic: (kinematic: boolean) => void;
  applyForce: (force: THREE.Vector3, point?: THREE.Vector3) => void;
}

const Block = forwardRef<RapierRigidBody, BlockProps>(({ 
  position, 
  visualRef, 
  onDragStart,
  onDragEnd,
  ...props 
}, ref) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<THREE.Vector3>(new THREE.Vector3());
  const { camera, raycaster, pointer, gl } = useThree();
  
  const dragPlaneRef = useRef<THREE.Mesh>(null);
  
  const prevPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentPosition = useRef<THREE.Vector3>(new THREE.Vector3());

  const setupDragPlane = useCallback((intersectionPoint: THREE.Vector3) => {
    if (!dragPlaneRef.current) return;
    
    const plane = dragPlaneRef.current;
    plane.position.copy(intersectionPoint);
    plane.lookAt(camera.position);
  }, [camera]);

  const handlePointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    
    if (!rigidBodyRef.current) return;
  
    rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
    
    const currentPos = rigidBodyRef.current.translation();
    if (currentPos) {
      prevPosition.current.set(currentPos.x, currentPos.y, currentPos.z);
      currentPosition.current.set(currentPos.x, currentPos.y, currentPos.z);
    }

    const objectPosition = new THREE.Vector3();
    if (rigidBodyRef.current.translation()) {
      objectPosition.copy(rigidBodyRef.current.translation() as THREE.Vector3);
    }
    
    const intersectionPoint = event.point;
    setDragOffset(objectPosition.clone().sub(intersectionPoint));
    
    setupDragPlane(intersectionPoint);
    onDragStart?.();
  }, [gl.domElement.style, setupDragPlane, onDragStart]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging || !rigidBodyRef.current) return;

    setIsDragging(false);
    gl.domElement.style.cursor = 'auto';
    onDragEnd?.();
  }, [isDragging, gl.domElement.style, onDragEnd]);

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) {
        handlePointerUp();
      }
    };

    const handleGlobalPointerMove = (event: PointerEvent) => {
      if (isDragging) {
      
        const rect = gl.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    if (isDragging) {
      document.addEventListener('pointerup', handleGlobalPointerUp);
      document.addEventListener('pointermove', handleGlobalPointerMove);
    }

    return () => {
      document.removeEventListener('pointerup', handleGlobalPointerUp);
      document.removeEventListener('pointermove', handleGlobalPointerMove);
    };
  }, [isDragging, handlePointerUp, gl.domElement, pointer]);

  useFrame(() => {
    if (!isDragging || !rigidBodyRef.current || !dragPlaneRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(dragPlaneRef.current);

    if (intersects.length > 0) {
      const targetPosition = intersects[0].point.add(dragOffset);
      const currentPos = rigidBodyRef.current.translation();
      
      if (currentPos) {
        const diff = new THREE.Vector3(
          targetPosition.x - currentPos.x,
          targetPosition.y - currentPos.y,
          targetPosition.z - currentPos.z
        );
        
        const forceMagnitude = 80;
        const dampening = 0.3;
        
        const force = diff.multiplyScalar(forceMagnitude);
        
        const currentVel = rigidBodyRef.current.linvel();
        if (currentVel) {
          const dampingForce = new THREE.Vector3(
            -currentVel.x * dampening,
            -currentVel.y * dampening,
            -currentVel.z * dampening
          );
          force.add(dampingForce);
        }
        
        rigidBodyRef.current.applyImpulse(
          { x: force.x * 0.016, y: force.y * 0.016, z: force.z * 0.016 },
          true
        );
      }
    }
  });

  const combinedRef = useCallback((node: RapierRigidBody) => {
    rigidBodyRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  return (
    <>
      <mesh ref={dragPlaneRef} visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <RigidBody 
        ref={combinedRef} 
        {...props} 
        position={position} 
        colliders="cuboid"
        type="dynamic"
      >
        <group ref={visualRef}>
          <RoundedBox 
            args={[2, 2, 2]} 
            radius={0.2}
            onPointerDown={handlePointerDown}
            onPointerEnter={() => {
              if (!isDragging) {
                gl.domElement.style.cursor = 'grab';
              }
            }}
            onPointerLeave={() => {
              if (!isDragging) {
                gl.domElement.style.cursor = 'auto';
              }
            }}
          >
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
              color={isDragging ? "lightblue" : "aquamarine"}
            />
          </RoundedBox>
        </group>
      </RigidBody>
    </>
  );
});

Block.displayName = 'Block';

export default Block;