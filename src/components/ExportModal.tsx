import React, { useState } from 'react';
import { X, Download, Link, Mail, Facebook, Twitter } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export default function ExportModal({ isOpen, onClose, canvasRef }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const exportAsImage = async (resolution: string) => {
    if (!canvasRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        width: resolution === 'hd' ? 1920 : resolution === '4k' ? 3840 : 1280,
        height: resolution === 'hd' ? 1080 : resolution === '4k' ? 2160 : 720,
        scale: resolution === '4k' ? 2 : 1,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `custom-garment-${resolution}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateShareUrl = () => {
    const currentUrl = window.location.href;
    const params = new URLSearchParams({
      design: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    const shareUrl = `${currentUrl}?${params.toString()}`;
    setShareUrl(shareUrl);
    navigator.clipboard.writeText(shareUrl);
  };

  const shareToSocial = (platform: string) => {
    const text = 'Check out my custom garment design!';
    const url = shareUrl || window.location.href;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Export & Share</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Export Options */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Export as Image</h4>
          <div className="space-y-2">
            {[
              { label: 'Standard (1280x720)', value: 'standard' },
              { label: 'HD (1920x1080)', value: 'hd' },
              { label: '4K (3840x2160)', value: '4k' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => exportAsImage(option.value)}
                disabled={isExporting}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <span>{option.label}</span>
                <Download size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Share Options */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Share Design</h4>
          
          {/* Generate Share Link */}
          <button
            onClick={generateShareUrl}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3"
          >
            <Link size={16} />
            <span>Generate Share Link</span>
          </button>

          {shareUrl && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Share URL (copied to clipboard):</p>
              <p className="text-xs text-gray-500 break-all">{shareUrl}</p>
            </div>
          )}

          {/* Social Share */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => shareToSocial('facebook')}
              className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Facebook size={16} className="text-blue-600" />
            </button>
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Twitter size={16} className="text-blue-400" />
            </button>
            <button
              onClick={() => shareToSocial('email')}
              className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {isExporting && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm text-blue-700">Exporting image...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}