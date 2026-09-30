import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Quote } from 'lucide-react';
import { ChatMessage } from '../types/index.js';
import { apiAskChat } from '../services/api.js';

interface DocumentChatProps {
  documentId: string;
  initialChatHistory?: ChatMessage[];
  domain?: string;
}

export const DocumentChat: React.FC<DocumentChatProps> = ({ 
  documentId, 
  initialChatHistory = [],
  domain
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = domain === 'HEALTHCARE' ? [
    'What is the primary clinical diagnosis?',
    'What are the itemized hospital charges?',
    'Who is the attending physician and insurance payer?',
    'Are there any prior-authorization risks?'
  ] : domain === 'LEGAL' ? [
    'What is the mutual limitation of liability cap?',
    'What is the service level agreement (SLA) uptime guarantee?',
    'What are the contract termination terms?',
    'Which jurisdiction governs this agreement?'
  ] : [
    'What is the grand total and payment due date?',
    'Explain the itemized line items breakdown.',
    'Are there any arithmetic discrepancies in this document?',
    'What are the vendor wire payment terms?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      document_id: documentId,
      role: 'user',
      message: query,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await apiAskChat(documentId, query);
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMsg.id),
        res.userMessage,
        res.assistantMessage
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        document_id: documentId,
        role: 'assistant',
        message: 'Apologies, I encountered an error querying the document. Please try again.',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3 shadow-glow-indigo">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Conversational Document Intelligence</h4>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Ask questions about clauses, payment terms, diagnosis codes, or arithmetic totals in natural language.
            </p>

            {/* Quick Prompts */}
            <div className="mt-5 flex flex-wrap justify-center gap-1.5 max-w-md">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.message}</div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center gap-1.5 flex-wrap text-[10px] text-slate-400">
                    <Quote className="w-3 h-3 text-cyan-400" />
                    <span>Cited:</span>
                    {msg.sources.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 text-slate-400 text-xs border border-slate-700/80 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
              <span>Analyzing document context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips if conversation is active */}
      {messages.length > 0 && (
        <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-400" /> Suggestions:
          </span>
          {quickPrompts.slice(0, 2).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 text-[10px] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={e => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about this document..."
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
