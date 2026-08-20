import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';

function Trophy() {
  const trophyRef = useRef();

  useFrame((state) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group ref={trophyRef}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.3, 1, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>

      <mesh position={[0.6, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.05, 16, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[-0.6, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.05, 16, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>

      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 32]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function TeamTrophy3D() {
  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <Trophy />
      <Stars />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}