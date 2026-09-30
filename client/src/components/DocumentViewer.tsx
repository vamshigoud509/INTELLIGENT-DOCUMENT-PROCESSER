import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ExternalLink, 
  Download, 
  FileText, 
  Maximize2 
} from 'lucide-react';
import { IngestedDocument } from '../types/index.js';

interface DocumentViewerProps {
  document: IngestedDocument;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const isPdf = document.mime_type.includes('pdf') || document.filename.endsWith('.pdf');
  const isImage = document.mime_type.includes('image') || /\.(png|jpe?g|webp|tiff)$/i.test(document.filename);

  const fileUrl = document.file_url.startsWith('http') 
    ? document.file_url 
    : document.file_url; // Vite proxies /uploads -> http://localhost:5000/uploads

  const handleZoomIn = () => setZoom(z => Math.min(z + 20, 200));
  const handleZoomOut = () => setZoom(z => Math.max(z - 20, 60));
  const handleRotate = () => setRotation(r => (r + 90) % 360);

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Viewer Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200 truncate" title={document.original_name}>
            {document.original_name}
          </span>
          <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-800">
            {document.mime_type.split('/')[1] || 'PDF'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRotate}
            title="Rotate 90deg"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          
          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open original document in new tab"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={fileUrl}
            download={document.original_name}
            title="Download document file"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Viewer Body */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/40 relative">
        {isPdf ? (
          <div 
            className="w-full h-full min-h-[500px] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
          >
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0`}
              title={document.original_name}
              className="w-full h-full min-h-[550px] rounded-lg shadow-2xl border border-slate-800 bg-white"
            />
          </div>
        ) : isImage ? (
          <div 
            className="max-w-full max-h-full transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
          >
            <img
              src={fileUrl}
              alt={document.original_name}
              className="max-h-[600px] object-contain rounded-lg shadow-2xl border border-slate-800"
            />
          </div>
        ) : (
          <div className="text-center p-8 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 text-slate-600" />
            <p className="text-sm">Preview not supported for this file format.</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-400 hover:underline"
            >
              Open directly <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

    </div>
  );
};
