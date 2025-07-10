/* src/components/CompanyForm.tsx */
import React, { useState } from "react";

interface CompanyFormProps {
  onSubmit: (companyName: string, targetRole?: string) => void;
  loading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, loading = false }) => {
  const [companyName, setCompanyName] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const commonRoles = [
    "CEO", "CTO", "Head of Engineering", "VP Engineering",
    "Head of People", "HR Director",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || loading) return;
    onSubmit(companyName.trim(), targetRole.trim() || undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto rounded-2xl backdrop-blur-sm bg-white/70 border border-slate-200 shadow-lg px-8 py-10 space-y-8"
    >
      {/* Title */}
      <header className="text-center space-y-1">
        <h2 className="text-2xl font-semibold text-slate-800">Email Generator</h2>
        <p className="text-sm text-slate-500">
          Enter company details to generate a personalised email
        </p>
      </header>

      {/* Inputs */}
      <div className="space-y-6">
        {/* Company */}
        <div className="space-y-2">
          <label htmlFor="company" className="block text-sm font-medium text-slate-700">
            Company Name<span className="text-red-600 ml-0.5">*</span>
          </label>
          <input
            id="company"
            type="text"
            required
            disabled={loading}
            placeholder="e.g., Microsoft"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400
                       focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Target role */}
        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-slate-700">
            Target Role <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            id="role"
            type="text"
            disabled={loading}
            placeholder="e.g., CTO"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400
                       focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Quick-pick chips */}
        {targetRole === "" && !loading && (
          <div className="flex flex-wrap gap-2">
            {commonRoles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTargetRole(r)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700
                           hover:bg-blue-50 hover:text-blue-700 transition"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!companyName.trim() || loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600
                   py-3 font-medium text-white shadow hover:bg-blue-700 transition
                   disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            </svg>
            Generating…
          </>
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Generate Email
          </>
        )}
      </button>
    </form>
  );
};

export default CompanyForm;
