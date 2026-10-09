'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GuardrailAlert } from '@/components/common/GuardrailAlert';
import { RoleBadge } from '@/components/common/RoleBadge';
import { SourceCitation } from '@/lib/types';
import { GUARDRAIL_PRESETS } from '@/lib/demoData';
import { 
  Bot, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  RotateCcw, 
  FileText, 
  Zap,
  Check,
  XCircle
} from 'lucide-react';

export default function AIAssistantPage() {
  const { chatMessages, sendChatMessage, currentRole } = useAuth();
  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<SourceCitation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    sendChatMessage(inputQuery);
    setInputQuery('');
  };

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-6 font-sans">
      {/* Sidebar: Guardrail Test Presets */}
      <div className="w-full md:w-80 shrink-0 flex flex-col space-y-4">
        {/* Preset Triggers for Guardrail Demo */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Guardrail Query Testers</span>
            </span>
            <span className="text-[10px] text-blue-600 font-mono font-semibold">Interactive</span>
          </div>

          <p className="text-xs text-slate-500">
            Click any preset below to test real-time RAG input/output guardrail policies:
          </p>

          <div className="space-y-2">
            {GUARDRAIL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => sendChatMessage(preset.query)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all space-y-1 ${
                  preset.expectedStatus === 'allowed'
                    ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/60'
                    : preset.expectedStatus === 'unrelated_blocked'
                    ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100/60'
                    : preset.expectedStatus === 'personal_info_blocked'
                    ? 'bg-amber-50 border-amber-200 hover:bg-amber-100/60'
                    : 'bg-red-50 border-red-200 hover:bg-red-100/60'
                }`}
              >
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span className="text-xs">{preset.title}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {preset.expectedStatus.replace('_blocked', '')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 truncate">
                  "{preset.query}"
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Context Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2 text-xs">
          <div className="font-semibold text-slate-900 flex items-center justify-between">
            <span>RAG Context Scope</span>
            <RoleBadge role={currentRole} size="sm" />
          </div>
          <p className="text-xs text-slate-500">
            Vector queries are strictly bound to documents tagged for {currentRole.toUpperCase()} permission scope.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 flex items-center space-x-2 truncate">
                <span>CompanyAI Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-semibold border border-emerald-200 shrink-0">
                  FAISS RAG Active
                </span>
              </h1>
              <p className="text-xs text-slate-500 truncate">
                Ask questions about your authorized company knowledge.
              </p>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-2 ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                {/* Requirement 12: User Message (Very light blue background) */}
                {msg.sender === 'user' ? (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-slate-900 text-xs md:text-sm font-medium shadow-2xs">
                    {msg.text}
                  </div>
                ) : (
                  /* Requirement 12: AI Response (White background) */
                  <div className="p-5 rounded-xl bg-white border border-slate-200 text-xs md:text-sm text-slate-900 shadow-2xs space-y-3">
                    {/* Guardrail Alert if non-allowed */}
                    {msg.guardrailStatus && msg.guardrailStatus !== 'allowed' && (
                      <GuardrailAlert status={msg.guardrailStatus} customText={msg.text} reason={msg.blockedReason} />
                    )}

                    {/* Standard Allowed Text Content */}
                    {(!msg.guardrailStatus || msg.guardrailStatus === 'allowed') && (
                      <div className="leading-relaxed whitespace-pre-wrap text-slate-800">
                        {msg.text}
                      </div>
                    )}

                    {/* Requirement 12: Source Documents (Small bordered white cards) */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Sources:</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((src) => (
                            <button
                              key={src.id}
                              onClick={() => setSelectedCitation(src)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-500 text-xs font-semibold text-blue-600 flex items-center space-x-1.5 shadow-2xs transition-all"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>{src.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({(src.relevanceScore * 100).toFixed(0)}%)</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action & Feedback buttons */}
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors flex items-center space-x-1"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px]">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => sendChatMessage(msg.text)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors flex items-center space-x-1"
                          title="Regenerate answer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Regenerate</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="text-[10px] text-slate-400 font-mono px-1">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a question about authorized company knowledge..."
              className="flex-1 px-4 py-2.5 text-xs md:text-sm rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Citation Source Inspection Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-blue-600 uppercase font-semibold">Verified Source Document</span>
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{selectedCitation.title}</span>
                </h3>
              </div>
              <button onClick={() => setSelectedCitation(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 font-mono text-xs text-slate-800 space-y-2 border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Matched Excerpt:</div>
              <p className="leading-relaxed">"{selectedCitation.snippet}"</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Department: {selectedCitation.department}</span>
              <span className="text-emerald-700 font-bold font-mono">Similarity: {(selectedCitation.relevanceScore * 100).toFixed(1)}%</span>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
