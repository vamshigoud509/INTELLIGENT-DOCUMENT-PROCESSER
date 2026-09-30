import React from 'react';
import { 
  ProcessingStatus, 
  DocumentDomain, 
  DocumentCategory, 
  AnomalySeverity 
} from '../types/index.js';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  DollarSign, 
  Activity, 
  FileText, 
  ShieldAlert,
  Info,
  GraduationCap
} from 'lucide-react';

export const StatusBadge: React.FC<{ status: ProcessingStatus }> = ({ status }) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Completed
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Clock className="w-3 h-3 animate-spin" />
          Processing
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
  }
};

export const DomainBadge: React.FC<{ domain: DocumentDomain }> = ({ domain }) => {
  switch (domain) {
    case 'STUDENT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-500/40">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          Student & Academic
        </span>
      );
    case 'FINANCIAL':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          Financial & Invoicing
        </span>
      );
    case 'HEALTHCARE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Healthcare & Clinical
        </span>
      );
    case 'LEGAL':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-500/30">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          Legal & Contracts
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          General Document
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: DocumentCategory }> = ({ category }) => {
  const formatted = category.replace(/_/g, ' ');
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
      {formatted}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: AnomalySeverity }> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          Critical Risk
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          High Severity
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
          <AlertTriangle className="w-3 h-3 text-yellow-400" />
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
          <Info className="w-3 h-3 text-blue-400" />
          Low
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-300 border border-slate-500/30">
          <Info className="w-3 h-3 text-slate-400" />
          Info
        </span>
      );
  }
};
