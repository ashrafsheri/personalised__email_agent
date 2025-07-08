'use client';
import React, { useState } from 'react';
import CompanyForm from '../components/CompanyForm';
import EmailOutput from '../components/EmailOutput';
import Loading from '../components/Loading';
import { generateEmail, ApiError } from '../lib/api';

export default function Home() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastRequest, setLastRequest] = useState<{company: string, role?: string}>({company: ''});

    const handleEmailGeneration = async (companyName: string, targetRole?: string) => {
        setLoading(true);
        setEmail('');
        setError('');
        setLastRequest({company: companyName, role: targetRole});

        try {
            const result = await generateEmail(companyName, targetRole);
            setEmail(result.email_content);
        } catch (error) {
            console.error('Error generating email:', error);
            if (error instanceof ApiError) {
                setError(`Failed to generate email: ${error.message}`);
            } else {
                setError('Failed to generate email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Enhanced Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <div className="text-center">
                            <h1 className="text-xl font-bold text-gray-900">Paismo Email Generator</h1>
                            <p className="text-sm text-blue-600 font-medium">AI-Powered Internal Tool</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-12">
                <div className="w-full max-w-2xl">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Generate Targeted Emails
                        </h2>
                        <p className="text-lg text-gray-600 max-w-lg mx-auto">
                            Enter a company name and optionally specify a role to find and address specific people.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                        <div className="p-8 md:p-10">
                            <CompanyForm onSubmit={handleEmailGeneration} loading={loading} />
                            
                            {loading && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <Loading targetRole={lastRequest.role} />
                                </div>
                            )}
                            
                            {error && (
                                <div className="mt-8 p-4 bg-red-50/80 border border-red-200/60 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {email && !loading && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <EmailOutput email={email} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Features Info - Only show when no email
                    {!email && !loading && (
                        <div className="mt-12 text-center">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/40">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Find Specific People</h3>
                                    <p className="text-sm text-gray-600">Target specific roles like CEO, CTO, or HR Director</p>
                                </div>
                                
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/40">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Research</h3>
                                    <p className="text-sm text-gray-600">Advanced research with personalized content</p>
                                </div>
                                
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/40">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Professional Output</h3>
                                    <p className="text-sm text-gray-600">Ready-to-send, personalized emails</p>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
            </main>
        </div>
    );
}