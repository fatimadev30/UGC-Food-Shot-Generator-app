import React, { useState, useCallback } from 'react';
import type { UploadedImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  placeholderTitle?: string;
  placeholderSubtitle?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, placeholderTitle, placeholderSubtitle }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64 = result.split(',')[1];
        if (base64) {
          onImageUpload({
            preview: result,
            base64: base64,
            type: file.type,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <label
        htmlFor={`file-upload-${placeholderTitle}`}
        className="relative block cursor-pointer bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors duration-300 aspect-square flex flex-col justify-center items-center text-center p-4 group"
      >
        {preview ? (
          <>
            <img src={preview} alt="Uploaded preview" className="max-h-full max-w-full object-contain rounded-lg shadow-md" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex justify-center items-center rounded-xl">
               <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-bold bg-gray-900 bg-opacity-70 px-4 py-2 rounded-lg flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                 Change Image
               </div>
            </div>
          </>
        ) : (
          <div className="space-y-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="block font-semibold">{placeholderTitle ?? 'Click to upload an image'}</span>
            <span className="block text-sm">{placeholderSubtitle ?? 'PNG, JPG, or WEBP'}</span>
          </div>
        )}
        <input id={`file-upload-${placeholderTitle}`} name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp"/>
      </label>
    </div>
  );
};