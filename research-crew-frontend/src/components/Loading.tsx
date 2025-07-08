import React from 'react';

interface LoadingProps {
    targetRole?: string;
}

const Loading: React.FC<LoadingProps> = ({ targetRole }) => {
    return (
        <div className="text-center py-8">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {targetRole ? `Finding ${targetRole}` : 'Crafting Your Email'}
            </h3>
            <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                {targetRole 
                    ? `Searching for the ${targetRole} and crafting a personalized email...`
                    : 'Our AI is researching the company and writing a personalized message for you.'
                }
            </p>
            
            <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    );
};

export default Loading;