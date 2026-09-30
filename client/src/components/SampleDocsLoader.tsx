import React, { useState } from 'react';
import { DollarSign, Activity, FileText, Sparkles, Loader2 } from 'lucide-react';
import { apiLoadSample } from '../services/api.js';

interface SampleDocsLoaderProps {
  onSampleLoaded: () => void;
}

export const SampleDocsLoader: React.FC<SampleDocsLoaderProps> = ({ onSampleLoaded }) => {
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const samples = [
    {
      id: 'invoice' as const,
      title: 'Commercial Invoice',
      subtitle: 'Apex Nexus Consulting LLC',
      badge: 'Financial Audit',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      icon: DollarSign,
      highlights: 'Line items, tax verification, subtotal math anomaly audit'
    },
    {
      id: 'medical_claim' as const,
      title: 'Hospital UB-04 Claim',
      subtitle: 'St. Jude Metropolitan Health',
      badge: 'Healthcare & Clinical',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      icon: Activity,
      highlights: 'ICD-10 diagnosis, inpatient care, CPT procedure codes'
    },
    {
      id: 'contract' as const,
      title: 'Master Cloud SLA',
      subtitle: 'Vanguard Cyber Infrastructure',
      badge: 'Legal & Compliance',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
      icon: FileText,
      highlights: '99.99% uptime SLA, liability limits, auto-renewal clause'
    }
  ];

  const handleLoad = async (type: 'invoice' | 'medical_claim' | 'contract') => {
    try {
      setLoadingType(type);
      await apiLoadSample(type);
      onSampleLoaded();
    } catch (err) {
      console.error('Failed to load sample:', err);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Instant Demo Datasets</h3>
            <p className="text-xs text-slate-400">Evaluate the IDP engine instantly without uploading local files</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {samples.map(sample => {
          const Icon = sample.icon;
          const isLoading = loadingType === sample.id;

          return (
            <div
              key={sample.id}
              className="glass-card rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border bg-gradient-to-r ${sample.color}`}>
                    {sample.badge}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">{sample.title}</h4>
                <p className="text-xs text-slate-400">{sample.subtitle}</p>
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">{sample.highlights}</p>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleLoad(sample.id)}
                className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>Load for Testing</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
