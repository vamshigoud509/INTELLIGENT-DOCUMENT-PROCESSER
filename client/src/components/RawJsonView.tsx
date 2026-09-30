import React, { useState } from 'react';
import { Copy, Check, Download, FileSpreadsheet } from 'lucide-react';
import { DocumentDetailResponse } from '../types/index.js';
import { apiGetExportUrl } from '../services/api.js';

interface RawJsonViewProps {
  data: DocumentDetailResponse;
}

export const RawJsonView: React.FC<RawJsonViewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Export Toolbar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Universal Export:</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={apiGetExportUrl(data.document.id, 'json')}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            Download JSON
          </a>
          <a
            href={apiGetExportUrl(data.document.id, 'csv')}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Download CSV
          </a>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy JSON
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-auto max-h-[500px]">
        <pre className="text-xs font-mono text-cyan-300 leading-relaxed">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
