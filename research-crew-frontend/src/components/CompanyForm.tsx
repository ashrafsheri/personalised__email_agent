import React, { useState } from 'react';

interface CompanyFormProps {
    onSubmit: (companyName: string, targetRole?: string) => void;
    loading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, loading = false }) => {
    const [companyName, setCompanyName] = useState('');
    const [targetRole, setTargetRole] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim() && !loading) {
            onSubmit(companyName.trim(), targetRole.trim() || undefined);
        }
    };

    const commonRoles = [
        'CEO',
        'CTO', 
        'Head of Engineering',
        'VP of Engineering',
        'Head of People',
        'HR Director',
        'Head of Marketing',
        'VP of Sales',
        'Head of Business Development',
        'Founder',
        'Co-Founder'
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-800">
                    Company Name *
                </label>
                <div className="relative group">
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed group-hover:border-gray-400"
                        placeholder="Enter company name (e.g., Microsoft, Tesla, OpenAI...)"
                        required
                        disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label htmlFor="targetRole" className="block text-sm font-semibold text-gray-800">
                    Target Role (Optional)
                </label>
                <div className="relative group">
                    <input
                        type="text"
                        id="targetRole"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full px-4 py-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed group-hover:border-gray-400"
                        placeholder="e.g., Head of People, HR Director, CTO..."
                        disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
                <p className="text-xs text-gray-500 pl-1">
                    Specify a role to find and address a specific person (optional)
                </p>
            </div>

            {/* Quick role suggestions */}
            {!loading && targetRole === '' && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 pl-1">Popular roles:</p>
                    <div className="flex flex-wrap gap-2">
                        {commonRoles.slice(0, 6).map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setTargetRole(role)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors"
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <button 
                type="submit" 
                disabled={!companyName.trim() || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {targetRole ? `Finding ${targetRole} and generating email...` : 'Generating Email...'}
                    </span>
                ) : (
                    <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {targetRole ? `Generate Email for ${targetRole}` : 'Generate Professional Email'}
                    </span>
                )}
            </button>
        </form>
    );
};

export default CompanyForm;