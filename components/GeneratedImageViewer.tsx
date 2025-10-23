import React from 'react';
import { Loader } from './Loader';

interface GeneratedImageViewerProps {
  isLoading: boolean;
  generatedImages: string[] | null;
  error: string | null;
}

const Placeholder: React.FC = () => (
  <div className="bg-white rounded-lg flex flex-col justify-center items-center h-full text-gray-500 text-center p-6">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <h3 className="font-bold text-lg text-gray-700">Your generated images will appear here</h3>
    <p className="text-sm">Upload a food photo and click generate to start.</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg relative h-full flex flex-col justify-center items-center text-center" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <strong className="font-bold block mb-1">Oh no! Something went wrong.</strong>
        <span className="block sm:inline text-sm">{message}</span>
    </div>
);


export const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ isLoading, generatedImages, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (generatedImages) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {generatedImages.map((imageSrc, index) => (
            <div key={index} className="relative group bg-gray-200 rounded-lg overflow-hidden shadow-md aspect-square">
              <img 
                src={imageSrc} 
                alt={`AI generated content ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                <a
                  href={imageSrc}
                  download={`ugc-food-shot-${index + 1}.jpeg`}
                  aria-label={`Download image ${index + 1}`}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90 bg-white text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 hover:bg-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return <Placeholder />;
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm flex justify-center items-center min-h-[20rem] h-full p-4">
      {renderContent()}
    </div>
  );
};