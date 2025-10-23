import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl shadow-lg">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">UGC</span> Food Shots
            </h1>
            <p className="text-md text-gray-500 max-w-2xl">
              Turn a simple photo of your dish into three unique, high-quality UGC-style ads in just one click.
            </p>
        </div>
      </div>
    </header>
  );
};
