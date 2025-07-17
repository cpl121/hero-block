// import { RigidBody, BallJoint } from '@react-three/rapier'
// import { Box } from '@react-three/drei'

// const Chain = ({ count = 6 }) => {
//   const height = 0.3

//   return (
//     <>
//       {Array.from({ length: count }).map((_, i) => {
//         const y = 4 - i * height

//         return (
//           <RigidBody
//             key={i}
//             type={i === 0 ? 'fixed' : 'dynamic'}
//             position={[0, y, 0]}
//             colliders="cuboid"
//           >
//             <Box args={[0.1, height, 0.1]} castShadow receiveShadow>
//               <meshStandardMaterial color="#aaa" />
//             </Box>

//             {/* Join con el anterior */}
//             {i > 0 && (
//               <BallJoint
//                 bodyA={i - 1}
//                 bodyB={i}
//                 anchorA={[0, -height / 2, 0]}
//                 anchorB={[0, height / 2, 0]}
//               />
//             )}
//           </RigidBody>
//         )
//       })}
//     </>
//   )
// }

// export default Chain