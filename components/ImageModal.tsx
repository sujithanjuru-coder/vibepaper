
import React, { useEffect } from 'react';
import { GeneratedImage } from '../types';
import { Icon } from './Icon';

interface ImageModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onDownload: (url: string) => void;
  onRemix: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onDownload, onRemix }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  if (!image) return null;

  const handleRemixClick = () => {
    onClose();
    onRemix();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
        aria-label="Close"
      >
        <Icon name="close" className="w-6 h-6" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <img
          src={image.url}
          alt="Selected wallpaper"
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        />
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900 bg-opacity-70 backdrop-blur-md p-3 rounded-full">
        <button
          onClick={() => onDownload(image.url)}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-full hover:bg-indigo-500 transition-colors bg-white/10"
        >
          <Icon name="download" className="w-5 h-5" />
          <span className="text-sm font-medium">Download</span>
        </button>
        <button
          onClick={handleRemixClick}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-colors bg-white/10"
        >
          <Icon name="remix" className="w-5 h-5" />
          <span className="text-sm font-medium">Remix</span>
        </button>
      </div>
    </div>
  );
};
