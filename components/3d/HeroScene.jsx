import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, MeshDistortMaterial, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import RVC_CD from './RVC_CD';

function FloatingCrystal({ position, color, scale }) {
  const mesh = useRef();
  
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 1000, color = '#FFD700' }) {
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#FFD700" intensity={0.5} />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={1} color="#FFD700" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <ParticleField count={2000} color="#FFD700" />
      <ParticleField count={1000} color="#C0C0C0" />
      
      <group position={[0, 0.5, 0]}>
        <RVC_CD size={1.5} />
      </group>
      
      <FloatingCrystal position={[-3, 1, -1]} color="#C0C0C0" scale={0.5} />
      <FloatingCrystal position={[3, -1, -1]} color="#FFD700" scale={0.4} />
      <FloatingCrystal position={[0, 2, -2]} color="#C0C0C0" scale={0.6} />
      
      <Environment preset="night" />
      <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={10} blur={2} far={4} />
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}