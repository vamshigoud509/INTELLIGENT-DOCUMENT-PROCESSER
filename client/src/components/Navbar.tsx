import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { 
  FileText, 
  LayoutDashboard, 
  BarChart3, 
  UploadCloud, 
  Sparkles, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck,
  Code
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showApiModal, setShowApiModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow-indigo transition-transform group-hover:scale-105">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                      DocuSphere
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      IDP AI
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Enterprise Multimodal Processing</p>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1 ml-4">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'bg-slate-800/80 text-brand-300 border border-slate-700/60' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/analytics"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/analytics') 
                      ? 'bg-slate-800/80 text-brand-300 border border-slate-700/60' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Link>

                <button
                  onClick={() => setShowApiModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  <Code className="w-4 h-4 text-cyan-400" />
                  API Contract
                </button>
              </nav>
            </div>

            {/* Right section: User profile & Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                    <span className="text-[10px] text-slate-400">{user.organization || 'Enterprise Analyst'}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-brand-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* API Reference Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-700 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg text-white">DocuSphere REST API Endpoints</h3>
              </div>
              <button 
                onClick={() => setShowApiModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto py-4 space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-emerald-400 font-bold">POST</span> <span className="font-mono text-slate-200">/api/documents/upload</span>
                <p className="text-slate-400 mt-1">Accepts multipart form-data (`file`, optional `domain`). Dispatches to Gemini multimodal vision pipeline.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-cyan-400 font-bold">GET</span> <span className="font-mono text-slate-200">/api/documents</span>
                <p className="text-slate-400 mt-1">Lists all ingested documents with filters (`domain`, `category`, `status`, `search`).</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-cyan-400 font-bold">GET</span> <span className="font-mono text-slate-200">/api/documents/:id</span>
                <p className="text-slate-400 mt-1">Returns full document extraction entities, line items, and mathematical audit anomalies.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-emerald-400 font-bold">POST</span> <span className="font-mono text-slate-200">/api/documents/:id/chat</span>
                <p className="text-slate-400 mt-1">Conversational AI query over parsed document contents with cited sources.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-cyan-400 font-bold">GET</span> <span className="font-mono text-slate-200">/api/documents/:id/export?format=json|csv</span>
                <p className="text-slate-400 mt-1">Universal export of parsed entities and itemized records.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
