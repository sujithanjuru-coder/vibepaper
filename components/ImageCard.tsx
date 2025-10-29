
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image?: GeneratedImage;
  isLoading: boolean;
  onSelect: (image: GeneratedImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, isLoading, onSelect }) => {
  if (isLoading) {
    return (
      <div className="aspect-[9/16] bg-gray-800 rounded-xl flex items-center justify-center animate-pulse">
        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
      </div>
    );
  }

  if (!image) return null;

  return (
    <div 
      className="aspect-[9/16] bg-gray-800 rounded-xl overflow-hidden cursor-pointer group relative"
      onClick={() => onSelect(image)}
    >
      <img src={image.url} alt="Generated wallpaper" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
    </div>
  );
};
