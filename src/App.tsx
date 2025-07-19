import React, { useState, useRef } from 'react';
import Scene3D from './components/Scene3D';
import CustomizationPanel from './components/CustomizationPanel';
import ARViewer from './components/ARViewer';
import ExportModal from './components/ExportModal';
import EmbedCode from './components/EmbedCode';
import { Shirt, Code, Palette } from 'lucide-react';

function App() {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [selectedTexture, setSelectedTexture] = useState<string | undefined>();
  const [selectedMaterial, setSelectedMaterial] = useState('cotton');
  const [modelUrl, setModelUrl] = useState<string>('');
  const [showAR, setShowAR] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeView, setActiveView] = useState<'customizer' | 'embed'>('customizer');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleShare = () => {
    const shareData = {
      title: '3D Apparel Customizer',
      text: 'Check out my custom garment design!',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleARMode = () => {
    setShowAR(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shirt className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">3D Apparel Customizer</h1>
                <p className="text-sm text-gray-600">Design your perfect garment</p>
              </div>
            </div>
            
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveView('customizer')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'customizer'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Palette size={16} />
                <span>Customizer</span>
              </button>
              <button
                onClick={() => setActiveView('embed')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'embed'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Code size={16} />
                <span>Embed</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'customizer' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
            {/* 3D Viewer */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div ref={canvasRef} className="w-full h-full">
                <Scene3D
                  modelUrl={modelUrl}
                  selectedColor={selectedColor}
                  selectedTexture={selectedTexture}
                  selectedMaterial={selectedMaterial}
                />
              </div>
            </div>

            {/* Customization Panel */}
            <div className="lg:col-span-1">
              <CustomizationPanel
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedTexture={selectedTexture}
                setSelectedTexture={setSelectedTexture}
                selectedMaterial={selectedMaterial}
                setSelectedMaterial={setSelectedMaterial}
                modelUrl={modelUrl}
                setModelUrl={setModelUrl}
                onExport={handleExport}
                onShare={handleShare}
                onARMode={handleARMode}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <EmbedCode
              modelUrl={modelUrl}
              selectedColor={selectedColor}
              selectedMaterial={selectedMaterial}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {showAR && (
        <ARViewer
          modelUrl={modelUrl}
          selectedColor={selectedColor}
          selectedTexture={selectedTexture}
          selectedMaterial={selectedMaterial}
          onClose={() => setShowAR(false)}
        />
      )}

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        canvasRef={canvasRef}
      />

      {/* Instructions Overlay */}
      {!modelUrl && (
        <div className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-semibold mb-2">Getting Started</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Upload your GLB model in the Model tab</li>
            <li>Customize colors and materials</li>
            <li>Add textures or logos</li>
            <li>Export or share your design</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;