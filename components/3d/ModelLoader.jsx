import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useState } from 'react';

function Model({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const modelRef = useRef();
  const { scene } = useGLTF(url);
  
  const model = scene.clone();
  
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={modelRef} scale={scale} position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
}

export default function ModelLoader({ 
  modelUrl, 
  scale = 1, 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = true,
  enableZoom = false,
  enablePan = false,
  environment = "city",
  backgroundColor = "transparent"
}) {
  const [error, setError] = useState(null);

  return (
    <Canvas 
      camera={{ position: [0, 1, 5], fov: 50 }}
      style={{ background: backgroundColor }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#FFD700" />
      
      <Environment preset={environment} />
      
      {modelUrl && (
        <Model 
          url={modelUrl} 
          scale={scale} 
          position={position} 
          rotation={rotation} 
        />
      )}
      
      <ContactShadows 
        position={[0, -1, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
        color="#000000" 
      />
      
      <OrbitControls 
        enableZoom={enableZoom}
        enablePan={enablePan}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        minDistance={2}
        maxDistance={10}
      />
    </Canvas>
  );
}

useGLTF.preload('/models/your-model.glb');