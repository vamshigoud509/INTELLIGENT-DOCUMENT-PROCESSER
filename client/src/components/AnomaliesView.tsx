import React, { useState } from 'react';
import { DocumentAnomaly } from '../types/index.js';
import { SeverityBadge } from './StatusBadge.js';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  Clock, 
  FileWarning, 
  CheckCheck,
  HelpCircle
} from 'lucide-react';

interface AnomaliesViewProps {
  anomalies: DocumentAnomaly[];
}

export const AnomaliesView: React.FC<AnomaliesViewProps> = ({ anomalies: initialAnomalies }) => {
  const [anomalies, setAnomalies] = useState<DocumentAnomaly[]>(initialAnomalies);

  const toggleResolved = (id: string) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolved: !a.resolved } : a));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ARITHMETIC_ERROR':
        return <Calculator className="w-4 h-4 text-rose-400" />;
      case 'DATE_MISMATCH':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'MISSING_REQUIRED_FIELD':
        return <FileWarning className="w-4 h-4 text-yellow-400" />;
      case 'COMPLIANCE_RISK':
        return <ShieldAlert className="w-4 h-4 text-indigo-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-400" />;
    }
  };

  const activeCount = anomalies.filter(a => !a.resolved).length;
  const criticalCount = anomalies.filter(a => a.severity === 'CRITICAL' && !a.resolved).length;
  const highCount = anomalies.filter(a => a.severity === 'HIGH' && !a.resolved).length;

  return (
    <div className="space-y-5">
      
      {/* Audit Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        activeCount === 0
          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
          : criticalCount > 0
          ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center">
            {activeCount === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {activeCount === 0
                ? 'All Audits Passed & Resolved'
                : `${activeCount} Automated Audit ${activeCount === 1 ? 'Finding' : 'Findings'} Flagged`}
            </h4>
            <p className="text-xs text-slate-400">
              {criticalCount > 0 && `${criticalCount} Critical, `}
              {highCount > 0 && `${highCount} High, `}
              {anomalies.length - activeCount} Resolved
            </p>
          </div>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        {anomalies.map((anomaly) => (
          <div
            key={anomaly.id}
            className={`p-4 rounded-xl border transition-all ${
              anomaly.resolved
                ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 shrink-0 mt-0.5">
                  {getCategoryIcon(anomaly.category)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <SeverityBadge severity={anomaly.severity} />
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {anomaly.category.replace(/_/g, ' ')}
                    </span>
                    {anomaly.resolved && (
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-white">{anomaly.title}</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{anomaly.description}</p>

                  {anomaly.suggested_action && (
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span><strong>Recommended Action:</strong> {anomaly.suggested_action}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => toggleResolved(anomaly.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  anomaly.resolved
                    ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                    : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-600/30'
                }`}
              >
                {anomaly.resolved ? 'Reopen' : 'Mark Resolved'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
