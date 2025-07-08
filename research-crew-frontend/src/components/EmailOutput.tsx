import React, { useState } from 'react';

interface EmailOutputProps {
    email: string;
}

const EmailOutput: React.FC<EmailOutputProps> = ({ email }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Success Badge */}
            <div className="flex items-center justify-center">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Email Generated Successfully
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Your Professional Email</h3>
                    <button
                        onClick={copyToClipboard}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            copied 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </>
                        )}
                    </button>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-white border-b border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span className="text-sm text-gray-500 ml-2 font-medium">Email Content</span>
                        </div>
                    </div>
                    <div className="p-6 bg-white">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans">
                            {email}
                        </pre>
                    </div>
                </div>
            </div>

            <div className="flex space-x-3">
                <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                >
                    Copy to Clipboard
                </button>
                <button 
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                    Generate Another
                </button>
            </div>
        </div>
    );
};

export default EmailOutput;