import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageViewer } from './components/GeneratedImageViewer';
import { generateUgcImages } from './services/geminiService';
import type { UploadedImage } from './types';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [personImage, setPersonImage] = useState<UploadedImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setGeneratedImages(null);
    setError(null);
  };
  
  const handlePersonImageUpload = (image: UploadedImage) => {
    setPersonImage(image);
    setGeneratedImages(null);
    setError(null);
  };

  const handleGenerateClick = async () => {
    if (!uploadedImage) {
      setError("Please upload a food image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const results = await generateUgcImages(
        { base64: uploadedImage.base64, type: uploadedImage.type },
        personImage ? { base64: personImage.base64, type: personImage.type } : null
      );
      const successfulImages = results.filter((img): img is string => img !== null);

      if (successfulImages.length > 0) {
        setGeneratedImages(successfulImages.map(img => `data:image/jpeg;base64,${img}`));
        if (successfulImages.length < results.length) {
          console.warn("Some images could not be generated.");
        }
      } else {
        throw new Error("The API did not return any images. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Uploaders Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <span className="bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0">1</span>
                      Food Photo
                  </h2>
                  <p className="text-gray-500 mt-1 pl-11 text-sm">The star of the show. A clear, well-lit photo works best.</p>
              </div>
              <ImageUploader onImageUpload={handleImageUpload} placeholderTitle="Upload food photo" />
            </div>
            <div>
               <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <span className="border-2 border-gray-800 text-gray-800 rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0">2</span>
                      Person Photo
                      <span className="text-sm font-normal text-gray-500">(Optional)</span>
                  </h2>
                  <p className="text-gray-500 mt-1 pl-11 text-sm">Feature a specific person in your shots.</p>
              </div>
              <ImageUploader onImageUpload={handlePersonImageUpload} placeholderTitle="Upload person photo" />
            </div>
          </div>
          
          {/* Button Section */}
          <div className="mt-10 text-center">
              <button
                onClick={handleGenerateClick}
                disabled={!uploadedImage || isLoading}
                className="w-full max-w-sm bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-orange-500/40 hover:shadow-2xl hover:shadow-pink-500/60 transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center justify-center text-xl focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-75 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  '✨ Generate UGC Shots'
                )}
              </button>
          </div>
        </div>
        
        {/* Results Section */}
        {(generatedImages || isLoading || error) && (
            <div className="mt-16 w-full max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Your AI-Generated Content</h2>
                    <p className="text-gray-500 mt-1">Hover over an image to download your new content.</p>
                </div>
                <GeneratedImageViewer
                isLoading={isLoading}
                generatedImages={generatedImages}
                error={error}
                />
            </div>
        )}
      </main>
      <footer className="text-center py-8 mt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm">Powered by the Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;