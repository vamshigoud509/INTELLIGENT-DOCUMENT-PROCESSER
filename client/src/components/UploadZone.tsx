import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DocumentDomain, IngestedDocument } from '../types/index.js';
import { apiUploadDocument } from '../services/api.js';

interface UploadZoneProps {
  onUploadSuccess: (newDoc: IngestedDocument) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DocumentDomain | 'AUTO'>('AUTO');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB maximum limit.');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setUploading(true);
    setProgress(20);

    const timer = setInterval(() => {
      setProgress(p => (p < 85 ? p + 15 : p));
    }, 200);

    try {
      const domainParam = selectedDomain === 'AUTO' ? undefined : selectedDomain;
      const doc = await apiUploadDocument(file, domainParam);
      clearInterval(timer);
      setProgress(100);
      setSuccessMsg(`"${file.name}" uploaded successfully. Automated Gemini IDP extraction started!`);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        onUploadSuccess(doc);
      }, 700);
    } catch (err: any) {
      clearInterval(timer);
      setUploading(false);
      setProgress(0);
      setError(err.message || 'File upload failed.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-brand-400" />
            Ingest & Audit Documents
          </h2>
          <p className="text-xs text-slate-400">
            Upload student worksheets, academic practice sets, commercial invoices, hospital claims, or legal contracts for zero-shot entity extraction & audit checks.
          </p>
        </div>

        {/* Domain Target Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          {(['AUTO', 'STUDENT', 'FINANCIAL', 'HEALTHCARE', 'LEGAL'] as const).map(dom => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedDomain === dom
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {dom === 'AUTO' ? 'Auto-Detect' : dom === 'STUDENT' ? 'Student & Academic' : dom.charAt(0) + dom.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop Surface */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-brand-500 bg-brand-500/10 scale-[1.005]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            {uploading ? (
              <Loader2 className="w-7 h-7 text-brand-400 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7 text-brand-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">
              {uploading ? 'Processing document...' : 'Click to upload or drag & drop files here'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, PNG, JPG, TIFF (up to 25MB)
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mt-5 max-w-xs mx-auto">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-cyan-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Analyzing layout & extracting JSON schema... {progress}%
            </p>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

    </div>
  );
};
