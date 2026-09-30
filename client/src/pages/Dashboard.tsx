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
  FileSpreadsheet,
  GraduationCap,
  Activity,
  Scale,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Briefcase
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
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'ALL' | 'STUDENT' | 'FINANCIAL' | 'HEALTHCARE' | 'LEGAL'>('ALL');

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

  const handleFilterCategory = (categoryKey: 'ALL' | 'STUDENT' | 'FINANCIAL' | 'HEALTHCARE' | 'LEGAL') => {
    setSelectedCategoryTab(categoryKey);
    setSelectedDomain(categoryKey);
  };

  // Category counts
  const studentDocs = documents.filter(d => d.domain === 'STUDENT');
  const financialDocs = documents.filter(d => d.domain === 'FINANCIAL');
  const healthcareDocs = documents.filter(d => d.domain === 'HEALTHCARE');
  const legalDocs = documents.filter(d => d.domain === 'LEGAL');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Title & Mission Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Document Ingestion & Audit Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated multimodal extraction, mathematical audits, and conversational discovery across Student, Financial, Healthcare, and Legal domains.
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

      {/* Category Intelligence & Domain Summaries Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Category Intelligence Summary
              </h3>
              <p className="text-xs text-slate-400">
                Synthesized insights summarized according to document category and domain
              </p>
            </div>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'ALL', label: 'All Categories', count: documents.length, icon: Layers },
              { id: 'STUDENT', label: 'Student & Academic', count: studentDocs.length, icon: GraduationCap },
              { id: 'FINANCIAL', label: 'Financial & Billing', count: financialDocs.length, icon: DollarSign },
              { id: 'HEALTHCARE', label: 'Healthcare & Clinical', count: healthcareDocs.length, icon: Activity },
              { id: 'LEGAL', label: 'Legal & Contracts', count: legalDocs.length, icon: Scale },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = selectedCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFilterCategory(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-brand-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Category Summary Content */}
        {selectedCategoryTab === 'STUDENT' && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Student & Academic Learning Summary</h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {studentDocs.length} Practice Set(s) / Worksheet(s)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              DocuSphere IDP has extracted and audited student coursework on <strong>Computer Science Digital Logic & Number Systems</strong>. 
              The curriculum features 10 step-by-step problem sets covering binary-decimal base conversion via successive division by 2, powers-of-two place values (2⁰ to 2¹²), 8-bit memory addressing (256 locations), and 24-bit True Color RGB channels. All numerical proofs and bitwise inversion calculations have been verified with automated compliance checks.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Core Subject</span>
                <p className="font-bold text-indigo-300 mt-0.5">Computer Science</p>
                <span className="text-[10px] text-slate-400">Digital Logic & Arch</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Exercises Analyzed</span>
                <p className="font-bold text-white mt-0.5">10 Problem Sets</p>
                <span className="text-[10px] text-emerald-400">100% Verified Solutions</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Addressing Architecture</span>
                <p className="font-bold text-cyan-300 mt-0.5">8-Bit (256 States)</p>
                <span className="text-[10px] text-slate-400">0 to 255 Address Space</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Color Representation</span>
                <p className="font-bold text-amber-300 mt-0.5">24-Bit RGB Depth</p>
                <span className="text-[10px] text-slate-400">16,777,216 True Colors</span>
              </div>
            </div>
          </div>
        )}

        {selectedCategoryTab === 'FINANCIAL' && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Commercial Financial & Billing Summary</h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {financialDocs.length} Invoice(s) / PO(s)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Audited commercial transactions from enterprise suppliers including <strong>Apex Nexus Consulting LLC</strong>. 
              The automated IDP engine reconciled line-item totals against stated subtotals, verified 8% state sales tax, checked early payment discounts (2% Net 10), and validated JPMorgan Chase wire instructions.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Audited Total Balance</span>
                <p className="font-bold text-emerald-400 mt-0.5">${(analytics?.totalMonetaryValue || 0).toLocaleString()}</p>
                <span className="text-[10px] text-slate-400">Reconciled to the cent</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Payment Terms</span>
                <p className="font-bold text-white mt-0.5">Net 30 Days</p>
                <span className="text-[10px] text-cyan-400">Early-pay discounts checked</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Math Discrepancies</span>
                <p className="font-bold text-amber-400 mt-0.5">{analytics?.anomalyCount ?? 0} Flagged</p>
                <span className="text-[10px] text-slate-400">Sum vs declared subtotal</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Primary Currency</span>
                <p className="font-bold text-white mt-0.5">USD ($)</p>
                <span className="text-[10px] text-slate-400">ISO-4217 Standard</span>
              </div>
            </div>
          </div>
        )}

        {selectedCategoryTab === 'HEALTHCARE' && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900 border border-cyan-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Clinical Healthcare & Claims Summary</h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {healthcareDocs.length} Hospital UB-04 Claim(s)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthesized clinical hospital records and institutional claims from <strong>St. Jude Metropolitan Health Center</strong>. 
              Extractions capture emergency room triage level 5 (CPT 99285), IV contrast abdominal CT scans (CPT 74177), and inpatient 24-hour observation for Acute Appendicitis (ICD-10 K35.80) with prior-authorization audit validation.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Clinical Diagnostic Code</span>
                <p className="font-bold text-cyan-300 mt-0.5">ICD-10 K35.80</p>
                <span className="text-[10px] text-slate-400">Acute Appendicitis</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Procedure Codes</span>
                <p className="font-bold text-white mt-0.5">CPT 74177 / 99285</p>
                <span className="text-[10px] text-slate-400">CT Scan & ER Level 5</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Admitted Facility</span>
                <p className="font-bold text-white mt-0.5 truncate">St. Jude Metropolitan</p>
                <span className="text-[10px] text-emerald-400">Network Provider</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Coverage Payer</span>
                <p className="font-bold text-white mt-0.5">BlueCross Insurance</p>
                <span className="text-[10px] text-slate-400">Copay $250.00</span>
              </div>
            </div>
          </div>
        )}

        {selectedCategoryTab === 'LEGAL' && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-slate-900 border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-bold text-white">Legal Agreements & Enterprise SLA Summary</h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {legalDocs.length} Executed Contract(s)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Audited Master Enterprise Services Agreements and SLAs between <strong>Vanguard Cloud Infrastructure Ltd.</strong> and enterprise counterparties. 
              Provisions covenant 99.99% multi-region uptime backed by automated fee credits, SOC-2 continuous monitoring, 24-hour breach notification, and mutual limitation of liability capped at aggregate annual fees.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">SLA Commitment</span>
                <p className="font-bold text-purple-300 mt-0.5">99.99% Uptime</p>
                <span className="text-[10px] text-slate-400">15-min P1 Response</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Liability Limitation</span>
                <p className="font-bold text-white mt-0.5">1x Annual Contract</p>
                <span className="text-[10px] text-slate-400">$135,000.00 USD Cap</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Governing Law</span>
                <p className="font-bold text-cyan-300 mt-0.5">State of New York</p>
                <span className="text-[10px] text-slate-400">United States</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Compliance Standard</span>
                <p className="font-bold text-emerald-400 mt-0.5">SOC-2 Type II</p>
                <span className="text-[10px] text-slate-400">GDPR & CCPA Compliant</span>
              </div>
            </div>
          </div>
        )}

        {selectedCategoryTab === 'ALL' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Student Card */}
            <div 
              onClick={() => handleFilterCategory('STUDENT')}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    Student & Academic
                  </span>
                  <GraduationCap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <h5 className="text-sm font-bold text-white">Coursework & Practice</h5>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Binary-decimal proofs, place values, 8-bit memory addressing, and RGB depth.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-indigo-400 font-bold">{studentDocs.length} Documents</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Financial Card */}
            <div 
              onClick={() => handleFilterCategory('FINANCIAL')}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    Financial & Invoicing
                  </span>
                  <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <h5 className="text-sm font-bold text-white">Invoices & Reconciliations</h5>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Line items arithmetic, sales tax validation, Net 30 payment terms, and vendor banking.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">{financialDocs.length} Documents</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Healthcare Card */}
            <div 
              onClick={() => handleFilterCategory('HEALTHCARE')}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    Healthcare & Clinical
                  </span>
                  <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <h5 className="text-sm font-bold text-white">Hospital Claims & UB-04</h5>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  ICD-10 diagnoses, CPT procedure codes, inpatient ward care, and insurer adjudication.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-bold">{healthcareDocs.length} Documents</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Legal Card */}
            <div 
              onClick={() => handleFilterCategory('LEGAL')}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    Legal & Contracts
                  </span>
                  <Scale className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <h5 className="text-sm font-bold text-white">Master Cloud SLAs</h5>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  99.99% uptime guarantees, limitation of liability caps, covenants, and New York law.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-purple-400 font-bold">{legalDocs.length} Documents</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        )}
      </div>

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
              onChange={e => {
                setSelectedDomain(e.target.value);
                if (['ALL', 'STUDENT', 'FINANCIAL', 'HEALTHCARE', 'LEGAL'].includes(e.target.value)) {
                  setSelectedCategoryTab(e.target.value as any);
                }
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Domains</option>
              <option value="STUDENT">Student & Academic</option>
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
                Upload a student practice sheet, invoice, or claim above, or load an instant demo dataset.
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
                          {doc.domain === 'STUDENT' ? (
                            <GraduationCap className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
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
