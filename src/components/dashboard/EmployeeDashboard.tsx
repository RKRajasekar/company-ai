'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/RoleBadge';
import { 
  Bot, 
  FileText, 
  Search, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  User as UserIcon
} from 'lucide-react';

export function EmployeeDashboard() {
  const router = useRouter();
  const { currentUser, documents, sendChatMessage } = useAuth();
  const [quickQuery, setQuickQuery] = useState('');

  const authorizedDocs = documents.filter(d => d.accessLevel === 'Public' || d.accessLevel === 'Internal');

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    sendChatMessage(quickQuery);
    router.push('/ai-assistant');
  };

  return (
    <div className="space-y-6">
      {/* Employee Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Employee AI Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Ask questions about authorized company policies, HR procedures, travel reimbursements, or IT FAQs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/ai-assistant"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center space-x-2"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Full Chat UI</span>
          </Link>
        </div>
      </div>

      {/* Quick AI Search Input */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Bot className="w-4 h-4 text-blue-600" />
          <span>Ask Authorized RAG Knowledge Base</span>
        </label>

        <form onSubmit={handleQuickAsk} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="e.g. What is our annual leave policy and expense submission deadline?"
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center space-x-2 shrink-0"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
          {[
            'What is the work from home policy?',
            'What is the maximum client dinner reimbursement limit?',
            'How do I reset my VPN password?'
          ].map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sendChatMessage(sample);
                router.push('/ai-assistant');
              }}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors border border-slate-200"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>

      {/* Grid: My Profile & Authorized Knowledge Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Authorized Knowledge Base Docs */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>My Authorized Company Knowledge Base</span>
              </h2>
              <p className="text-xs text-slate-500">
                Documents available for your role scope ({currentUser.department})
              </p>
            </div>
            <Link href="/knowledge-base" className="text-xs text-blue-600 font-semibold hover:underline">
              Browse Docs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {authorizedDocs.map(doc => (
              <div key={doc.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 truncate max-w-[180px]">
                      {doc.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {doc.accessLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {doc.snippet}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-200">
                  <span>Category: {doc.category}</span>
                  <span>{doc.fileSize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Profile Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <UserIcon className="w-4 h-4 text-blue-600" />
            <span>My Profile & Access</span>
          </h2>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
            <div>
              <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
              <div className="text-xs text-slate-500">{currentUser.designation}</div>
              <div className="mt-1"><RoleBadge role={currentUser.role} size="sm" /></div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Employee ID:</span>
              <span className="font-mono font-semibold text-slate-800">{currentUser.employeeId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Department:</span>
              <span className="font-medium text-slate-800">{currentUser.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Team:</span>
              <span className="font-medium text-slate-800">{currentUser.team}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Manager:</span>
              <span className="font-medium text-slate-800">{currentUser.manager}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1 text-xs">
            <div className="font-semibold text-blue-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Role Security Bounds</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Authorized access to search company documents and submit queries to the RAG AI Assistant. Confidential executive files and admin settings are restricted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
