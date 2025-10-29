
import React, { useState, useCallback } from 'react';
import { generateWallpapers } from './services/geminiService';
import { ImageCard } from './components/ImageCard';
import { ImageModal } from './components/ImageModal';
import { Loader } from './components/Loader';
import { Icon } from './components/Icon';
import type { GeneratedImage, AspectRatio } from './types';
import { aspectRatios } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('cosmic horror, otherworldly landscape, unsettling beauty');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const imageUrls = await generateWallpapers(prompt, aspectRatio);
      const generatedImages = imageUrls.map(url => ({
        id: crypto.randomUUID(),
        url,
      }));
      setImages(generatedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, isLoading]);

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibepaper-${prompt.substring(0, 20).replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemix = () => {
    // Remix re-uses the current prompt
    handleGenerate();
  };

  const handleSelectImage = (image: GeneratedImage) => {
    setSelectedImage(image);
  };
  
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <header className="text-center p-4 md:p-6 border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">VibePaper</h1>
        <p className="text-gray-400 mt-1">AI wallpapers based on your vibe</p>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-6 w-full max-w-4xl">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ImageCard key={i} isLoading={true} onSelect={() => {}} />)
          ) : images.length > 0 ? (
            images.map(image => <ImageCard key={image.id} image={image} isLoading={false} onSelect={handleSelectImage} />)
          ) : (
            <div className="col-span-2 md:col-span-4 h-96 flex flex-col items-center justify-center text-center bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
              <Icon name="sparkles" className="w-16 h-16 text-indigo-400" />
              <p className="mt-4 text-lg text-gray-300">Describe your vibe below</p>
              <p className="text-sm text-gray-500">and let the magic happen.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 bg-gray-900/80 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., rainy cyberpunk lo-fi, synthwave sunset..."
              className="w-full flex-grow bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none"
              rows={2}
            />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={aspectRatio} 
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg p-3 h-full focus:ring-2 focus:ring-indigo-500 focus:outline-none transition appearance-none text-center sm:text-left"
              >
                {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
              </select>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold p-3 rounded-lg transition-all flex items-center justify-center gap-2 h-full"
              >
                {isLoading ? <Loader /> : <Icon name="sparkles" className="w-5 h-5"/>}
                <span>{isLoading ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      <ImageModal
        image={selectedImage}
        onClose={handleCloseModal}
        onDownload={handleDownload}
        onRemix={handleRemix}
      />
    </div>
  );
};

export default App;
