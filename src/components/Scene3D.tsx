import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

interface Scene3DProps {
  modelUrl?: string;
  selectedColor: string;
  selectedTexture?: string;
  selectedMaterial: string;
  enableAR?: boolean;
}

const materials = {
  cotton: { roughness: 0.8, metalness: 0.1 },
  denim: { roughness: 0.9, metalness: 0.0 },
  silk: { roughness: 0.2, metalness: 0.1 },
  leather: { roughness: 0.4, metalness: 0.2 }
};

function ModelViewer({ modelUrl, selectedColor, selectedTexture, selectedMaterial }: Omit<Scene3DProps, 'enableAR'>) {
  const meshRef = useRef<THREE.Mesh>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load model if URL is provided
  let gltf = null;
  try {
    if (modelUrl) {
      gltf = useLoader(GLTFLoader, modelUrl);
    }
  } catch (err) {
    console.error('Error loading model:', err);
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  React.useEffect(() => {
    if (gltf) {
      setLoading(false);
      // Apply material properties to all meshes
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material) {
            material.color.set(selectedColor);
            material.roughness = materials[selectedMaterial as keyof typeof materials].roughness;
            material.metalness = materials[selectedMaterial as keyof typeof materials].metalness;
            
            if (selectedTexture) {
              const textureLoader = new THREE.TextureLoader();
              const texture = textureLoader.load(selectedTexture);
              material.map = texture;
            } else {
              material.map = null;
            }
            material.needsUpdate = true;
          }
        }
      });
    }
  }, [gltf, selectedColor, selectedTexture, selectedMaterial]);

  if (!modelUrl) {
    return (
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 3, 0.5]} />
        <meshStandardMaterial 
          color={selectedColor}
          roughness={materials[selectedMaterial as keyof typeof materials].roughness}
          metalness={materials[selectedMaterial as keyof typeof materials].metalness}
        />
        <Html center>
          <div className="bg-white/90 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Upload a GLB model to begin</p>
          </div>
        </Html>
      </mesh>
    );
  }

  if (loading) {
    return (
      <Html center>
        <div className="bg-white/90 p-4 rounded-lg">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Loading model...</p>
        </div>
      </Html>
    );
  }

  if (error || !gltf) {
    return (
      <Html center>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-sm text-red-600">Error loading model</p>
        </div>
      </Html>
    );
  }

  return <primitive ref={meshRef} object={gltf.scene} scale={1.5} />;
}

export default function Scene3D({ modelUrl, selectedColor, selectedTexture, selectedMaterial, enableAR }: Scene3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        className="bg-gradient-to-br from-gray-50 to-gray-200"
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <ModelViewer 
            modelUrl={modelUrl}
            selectedColor={selectedColor}
            selectedTexture={selectedTexture}
            selectedMaterial={selectedMaterial}
          />
          <Environment preset="studio" />
          <ContactShadows opacity={0.4} scale={10} blur={1} far={10} resolution={256} color="#000000" />
        </Suspense>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}