import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  ShieldAlert, 
  MessageSquare, 
  Code2, 
  RefreshCw, 
  Trash2, 
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { DocumentDetailResponse } from '../types/index.js';
import { 
  apiGetDocumentById, 
  apiReprocessDocument, 
  apiDeleteDocument,
  apiGetExportUrl 
} from '../services/api.js';
import { StatusBadge, DomainBadge, CategoryBadge } from '../components/StatusBadge.js';
import { DocumentViewer } from '../components/DocumentViewer.js';
import { ExtractionsView } from '../components/ExtractionsView.js';
import { AnomaliesView } from '../components/AnomaliesView.js';
import { DocumentChat } from '../components/DocumentChat.js';
import { RawJsonView } from '../components/RawJsonView.js';

type TabType = 'entities' | 'anomalies' | 'chat' | 'json';

export const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<DocumentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reprocessing, setReprocessing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('entities');

  const fetchDocument = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await apiGetDocumentById(id);
      setData(res);
    } catch (err) {
      console.error('Failed to load document details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const handleReprocess = async () => {
    if (!id) return;
    try {
      setReprocessing(true);
      await apiReprocessDocument(id);
      await fetchDocument();
    } catch (err) {
      console.error('Reprocess failed:', err);
    } finally {
      setReprocessing(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !data) return;
    if (!window.confirm(`Are you sure you want to delete "${data.document.original_name}"?`)) return;
    try {
      await apiDeleteDocument(id);
      navigate('/');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading document intelligence studio...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Document Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">The requested document could not be retrieved.</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { document, extraction, anomalies, chatHistory } = data;
  const unresolvedAnomalies = anomalies.filter(a => !a.resolved);

  return (
    <div className="space-y-5 pb-16">
      
      {/* Studio Navigation & Breadcrumb Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold text-white truncate max-w-md">
                {document.original_name}
              </h1>
              <StatusBadge status={document.status} />
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <DomainBadge domain={document.domain} />
              <CategoryBadge category={document.category} />
              <span className="font-mono text-[11px] text-slate-500">
                Confidence: <strong className="text-slate-300">{document.confidence_score}%</strong>
              </span>
              {document.processing_time_ms > 0 && (
                <span className="font-mono text-[11px] text-slate-500">
                  Latency: <strong className="text-slate-300">{document.processing_time_ms}ms</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          <a
            href={apiGetExportUrl(document.id, 'csv')}
            download
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </a>

          <a
            href={apiGetExportUrl(document.id, 'json')}
            download
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-brand-400 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span>JSON</span>
          </a>

          <button
            onClick={handleReprocess}
            disabled={reprocessing}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${reprocessing ? 'animate-spin' : ''}`} />
            <span>Reprocess</span>
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Verification Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[720px]">
        
        {/* Left Column: Interactive Document Viewer (5 cols on lg) */}
        <div className="lg:col-span-6 h-[650px] lg:h-auto min-h-[550px] flex flex-col">
          <DocumentViewer document={document} />
        </div>

        {/* Right Column: Multi-tab Inspector Studio (6 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col glass-panel rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          
          {/* Tab Selection Header */}
          <div className="flex items-center gap-1 p-2 bg-slate-950/90 border-b border-slate-800/80 overflow-x-auto">
            
            <button
              onClick={() => setActiveTab('entities')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'entities'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Structured Data</span>
              {extraction?.line_items && extraction.line_items.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-300 text-[10px] font-mono">
                  {extraction.line_items.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('anomalies')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'anomalies'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Audit & Anomalies</span>
              {unresolvedAnomalies.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono font-black animate-pulse">
                  {unresolvedAnomalies.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Document AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'json'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw JSON & Export</span>
            </button>

          </div>

          {/* Tab Content Body */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[750px]">
            {activeTab === 'entities' && extraction && (
              <ExtractionsView document={document} extraction={extraction} />
            )}

            {activeTab === 'anomalies' && (
              <AnomaliesView anomalies={anomalies} />
            )}

            {activeTab === 'chat' && (
              <DocumentChat
                documentId={document.id}
                initialChatHistory={chatHistory}
                domain={document.domain}
              />
            )}

            {activeTab === 'json' && (
              <RawJsonView data={data} />
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
