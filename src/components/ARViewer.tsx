import React from 'react';
import { Canvas, XR } from '@react-three/xr';
import { OrbitControls, Environment } from '@react-three/drei';
import Scene3D from './Scene3D';

interface ARViewerProps {
  modelUrl?: string;
  selectedColor: string;
  selectedTexture?: string;
  selectedMaterial: string;
  onClose: () => void;
}

export default function ARViewer({
  modelUrl,
  selectedColor,
  selectedTexture,
  selectedMaterial,
  onClose
}: ARViewerProps) {
  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white text-black rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          Exit AR
        </button>
      </div>
      
      <XR>
        <Canvas>
          <Scene3D
            modelUrl={modelUrl}
            selectedColor={selectedColor}
            selectedTexture={selectedTexture}
            selectedMaterial={selectedMaterial}
          />
        </Canvas>
      </XR>
    </div>
  );
}