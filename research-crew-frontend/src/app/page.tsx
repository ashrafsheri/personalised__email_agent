// filepath: /Users/shahreyarashraf/Coding/email_agent/research-crew-frontend/src/app/page.tsx
"use client";

import React, { useState } from "react";
import CompanyForm from "../components/CompanyForm";
import EmailOutput from "../components/EmailOutput";
import { generateEmail, ApiError } from "../lib/api";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRequest, setLastRequest] = useState<{
    company: string;
    role?: string;
  }>({ company: "" });

  const handleEmailGeneration = async (
    companyName: string,
    targetRole?: string
  ) => {
    setLoading(true);
    setEmail("");
    setError("");
    setLastRequest({ company: companyName, role: targetRole });

    try {
      const result = await generateEmail(companyName, targetRole);
      setEmail(result.email_content);
    } catch (error) {
      console.error("Error generating email:", error);
      if (error instanceof ApiError) {
        setError(`Failed to generate email: ${error.message}`);
      } else {
        setError("Failed to generate email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="py-6 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 6L12 13L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Email Generator</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-16 px-4">

        <div className="mx-auto w-full max-w-6xl px-4">
          {/* Form Section */}
          <CompanyForm onSubmit={handleEmailGeneration} loading={loading} />
          <div className="h-16" />
          {/* Error Message */}
          {error && (
            <div className="max-w-lg mx-auto mb-8">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-500"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h3 className="text-base font-medium text-red-800">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {lastRequest.role
                      ? `Finding ${lastRequest.role} at ${lastRequest.company}`
                      : `Researching ${lastRequest.company}`}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Crafting your personalized email...
                  </p>
                  <div className="w-full max-w-xs mt-6 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    This usually takes 15-30 seconds
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Email Output */}
          {email && !loading && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 py-4 px-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Your Generated Email
                  </h3>
                </div>
                <div className="p-6">
                  <EmailOutput email={email} />
                </div>
                <div className="border-t border-gray-100 bg-gray-50 py-3 px-6 flex justify-center gap-4">
                  <button
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    onClick={() => {
                      setEmail("");
                      setLastRequest({ company: "" });
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Generate another
                  </button>
                  <button
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-lg flex items-center"
                    onClick={() => {
                      navigator.clipboard.writeText(email);
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </div>
          )}

          
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white/70 backdrop-blur border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Paismo Email Generator
          </p>
        </div>
      </footer>
    </div>
  );
}
