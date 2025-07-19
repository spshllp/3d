import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Upload, Palette, Shirt, Download, Share2, Smartphone } from 'lucide-react';

interface CustomizationPanelProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedTexture: string | undefined;
  setSelectedTexture: (texture: string | undefined) => void;
  selectedMaterial: string;
  setSelectedMaterial: (material: string) => void;
  onExport: () => void;
  onShare: () => void;
  onARMode: () => void;
  modelUrl?: string;
  setModelUrl: (url: string) => void;
}

const materialPresets = [
  { id: 'cotton', name: 'Cotton', description: 'Soft, breathable fabric' },
  { id: 'denim', name: 'Denim', description: 'Durable, classic material' },
  { id: 'silk', name: 'Silk', description: 'Luxurious, smooth texture' },
  { id: 'leather', name: 'Leather', description: 'Premium, glossy finish' }
];

const colorPresets = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471'
];

export default function CustomizationPanel({
  selectedColor,
  setSelectedColor,
  selectedTexture,
  setSelectedTexture,
  selectedMaterial,
  setSelectedMaterial,
  onExport,
  onShare,
  onARMode,
  modelUrl,
  setModelUrl
}: CustomizationPanelProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  const handleTextureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedTexture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    }
  };

  const tabs = [
    { id: 'model', name: 'Model', icon: Shirt },
    { id: 'colors', name: 'Colors', icon: Palette },
    { id: 'textures', name: 'Textures', icon: Upload }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Customize Your Garment</h2>
        <p className="text-gray-600">Design your perfect piece with our advanced tools</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              <span className="font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Model Upload Tab */}
      {activeTab === 'model' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Upload 3D Model</h3>
            <div
              onClick={() => modelInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Click to upload GLB file</p>
              <p className="text-sm text-gray-500">Supports GLB format up to 50MB</p>
            </div>
            <input
              ref={modelInputRef}
              type="file"
              accept=".glb,.gltf"
              onChange={handleModelUpload}
              className="hidden"
            />
            {modelUrl && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">✓ Model uploaded successfully</p>
              </div>
            )}
          </div>

          {/* Material Presets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Material Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {materialPresets.map((material) => (
                <button
                  key={material.id}
                  onClick={() => setSelectedMaterial(material.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedMaterial === material.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-800">{material.name}</div>
                  <div className="text-sm text-gray-600">{material.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Color Selection</h3>
            
            {/* Color Presets */}
            <div className="grid grid-cols-6 gap-3 mb-4">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Custom Color Picker Toggle */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 transition-colors"
            >
              Custom Color Picker
            </button>

            {/* Color Picker */}
            {showColorPicker && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
                <div className="mt-3 flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-300"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Textures Tab */}
      {activeTab === 'textures' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Texture & Patterns</h3>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Upload Logo or Pattern</p>
              <p className="text-sm text-gray-500">PNG, JPG, SVG up to 10MB</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleTextureUpload}
              className="hidden"
            />

            {selectedTexture && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedTexture}
                  alt="Selected texture"
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <button
                  onClick={() => setSelectedTexture(undefined)}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Remove Texture
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <button
          onClick={onARMode}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Smartphone size={20} />
          <span>Try in AR</span>
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onExport}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
          
          <button
            onClick={onShare}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}