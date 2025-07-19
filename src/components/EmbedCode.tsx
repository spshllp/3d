import React, { useState } from 'react';
import { Copy, Code, Settings } from 'lucide-react';

interface EmbedCodeProps {
  modelUrl?: string;
  selectedColor: string;
  selectedMaterial: string;
}

export default function EmbedCode({ modelUrl, selectedColor, selectedMaterial }: EmbedCodeProps) {
  const [embedSize, setEmbedSize] = useState({ width: 800, height: 600 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateEmbedCode = () => {
    const config = {
      modelUrl: modelUrl || '',
      defaultColor: selectedColor,
      defaultMaterial: selectedMaterial,
      width: embedSize.width,
      height: embedSize.height
    };

    return `<!-- 3D Apparel Customizer Embed -->
<iframe
  src="${window.location.origin}/embed?config=${encodeURIComponent(JSON.stringify(config))}"
  width="${embedSize.width}"
  height="${embedSize.height}"
  frameborder="0"
  allowfullscreen
  style="border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);"
></iframe>`;
  };

  const generateReactComponent = () => {
    return `import React from 'react';
import { ApparelCustomizer } from '@your-domain/apparel-customizer';

function MyCustomizer() {
  return (
    <ApparelCustomizer
      modelUrl="${modelUrl || ''}"
      defaultColor="${selectedColor}"
      defaultMaterial="${selectedMaterial}"
      width={${embedSize.width}}
      height={${embedSize.height}}
      onDesignChange={(design) => console.log('Design updated:', design)}
      onExport={(imageData) => console.log('Design exported:', imageData)}
    />
  );
}

export default MyCustomizer;`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Code className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Embed Code</h3>
      </div>

      {/* Size Configuration */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Embed Size</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Width</label>
            <input
              type="number"
              value={embedSize.width}
              onChange={(e) => setEmbedSize(prev => ({ ...prev, width: Number(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Height</label>
            <input
              type="number"
              value={embedSize.height}
              onChange={(e) => setEmbedSize(prev => ({ ...prev, height: Number(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Preset Sizes */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Preset Sizes</h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Small', width: 400, height: 300 },
            { name: 'Medium', width: 800, height: 600 },
            { name: 'Large', width: 1200, height: 900 }
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => setEmbedSize({ width: preset.width, height: preset.height })}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              {preset.name}<br />
              <span className="text-gray-500">{preset.width}×{preset.height}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center space-x-2 mb-4 text-blue-600 hover:text-blue-700"
      >
        <Settings size={16} />
        <span>Advanced Options</span>
      </button>

      {showAdvanced && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Enable AR mode</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Show export buttons</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Allow model upload</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Tabs */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700">HTML Embed Code</h4>
            <button
              onClick={() => copyToClipboard(generateEmbedCode())}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Copy size={14} />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
            {generateEmbedCode()}
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700">React Component</h4>
            <button
              onClick={() => copyToClipboard(generateReactComponent())}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Copy size={14} />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
            {generateReactComponent()}
          </pre>
        </div>
      </div>
    </div>
  );
}