import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  DollarSign, 
  ShieldAlert, 
  Layers, 
  Percent, 
  Download,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { IngestedDocument, AnalyticsSummary } from '../types/index.js';
import { 
  apiGetDocuments, 
  apiGetAnalytics, 
  apiDeleteDocument, 
  apiReprocessDocument,
  apiGetExportUrl 
} from '../services/api.js';
import { StatusBadge, DomainBadge, CategoryBadge } from '../components/StatusBadge.js';
import { UploadZone } from '../components/UploadZone.js';
import { SampleDocsLoader } from '../components/SampleDocsLoader.js';

export const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<IngestedDocument[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docs, stats] = await Promise.all([
        apiGetDocuments({ search, domain: selectedDomain, status: selectedStatus }),
        apiGetAnalytics()
      ]);
      setDocuments(docs);
      setAnalytics(stats);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDomain, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await apiDeleteDocument(id);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleReprocess = async (id: string) => {
    try {
      await apiReprocessDocument(id);
      fetchData();
    } catch (err) {
      console.error('Reprocess failed:', err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Title & Mission Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Document Ingestion & Audit Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated multimodal extraction, mathematical audits, and conversational discovery for enterprise documents.
          </p>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Ingested</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {analytics?.totalDocuments ?? documents.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Multi-domain records</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Audited Value</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            ${(analytics?.totalMonetaryValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">Reconciled balance</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Audit Anomalies</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {analytics?.anomalyCount ?? 0}
          </p>
          <span className="text-[11px] text-amber-400 font-medium">Flags & math errors</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Extraction Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {analytics?.accuracyRate ?? 98.6}%
          </p>
          <span className="text-[11px] text-cyan-400 font-medium">Gemini multimodal avg</span>
        </div>

      </div>

      {/* Drag & Drop Upload Zone */}
      <UploadZone onUploadSuccess={() => fetchData()} />

      {/* Pre-built Sample Document Loader */}
      <SampleDocsLoader onSampleLoaded={() => fetchData()} />

      {/* Ingested Documents List Section */}
      <div className="glass-panel rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-400" />
              Processed Documents Ledger ({documents.length})
            </h3>
            <p className="text-xs text-slate-400">Review extraction confidence, audit flags, or launch side-by-side inspection studio</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="w-48 sm:w-60 bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </form>

            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Domains</option>
              <option value="FINANCIAL">Financial & Invoicing</option>
              <option value="HEALTHCARE">Healthcare & Claims</option>
              <option value="LEGAL">Legal & Contracts</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
            </select>

            {/* Refresh */}
            <button
              onClick={fetchData}
              title="Refresh List"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          {documents.length === 0 ? (
            <div className="text-center py-16 px-4">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">No documents found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Upload a document above or click one of the instant demo datasets to evaluate the IDP pipeline.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-3 text-center">Confidence</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Document Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shrink-0 text-brand-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="font-semibold text-slate-100 hover:text-brand-300 transition-colors truncate block"
                            title={doc.original_name}
                          >
                            {doc.original_name}
                          </Link>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(doc.file_size / 1024).toFixed(1)} KB • {doc.mime_type.split('/')[1]?.toUpperCase() || 'PDF'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="py-3 px-4">
                      <DomainBadge domain={doc.domain} />
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <CategoryBadge category={doc.category} />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={doc.status} />
                    </td>

                    {/* Confidence Score */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono font-semibold text-slate-200">
                        {doc.confidence_score ? `${doc.confidence_score}%` : 'N/A'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(doc.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/documents/${doc.id}`}
                          title="Open Side-by-Side Studio"
                          className="p-1.5 rounded-lg bg-brand-600/20 text-brand-300 hover:bg-brand-600 hover:text-white border border-brand-500/30 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <a
                          href={apiGetExportUrl(doc.id, 'csv')}
                          download
                          title="Export CSV"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleReprocess(doc.id)}
                          title="Reprocess Document"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(doc.id, doc.original_name)}
                          title="Delete Document"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
};
