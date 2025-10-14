import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html } from '@react-three/drei';
import ringModel from '../assets/surtv.glb';

function RingModel() {
  const meshRef = useRef();

  // Rotate the ring
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Load the GLTF model
  const { scene } = useGLTF(ringModel);

  return <primitive object={scene} ref={meshRef} scale={1} />;
}

export default function Ring3D() {
  return (
    <div className="w-full h-96">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[0, 0, 10]} intensity={1} />
        <Suspense fallback={<Html><div className="flex items-center justify-center h-full text-white">Chargement du modèle 3D...</div></Html>}>
          <RingModel />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
