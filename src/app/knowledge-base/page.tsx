'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DocumentCategory, KnowledgeDoc } from '@/lib/types';
import { 
  FileText, 
  Upload, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Check, 
  Database
} from 'lucide-react';

function KnowledgeBaseContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { documents, updateDocumentStatus, hasPermission, currentRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<KnowledgeDoc | null>(null);

  const totalCount = 526 + documents.length - 8;
  const approvedCount = documents.filter(d => d.status === 'Approved' || d.status === 'Indexed').length + 500;
  const pendingCount = documents.filter(d => ['Uploading', 'Processing', 'Embedding', 'Pending'].includes(d.status)).length;
  const rejectedCount = documents.filter(d => d.status === 'Rejected').length;

  const categoriesList: DocumentCategory[] = [
    'Company Information',
    'HR Policies',
    'Product Information',
    'FAQs',
    'Procedures',
    'Approved Internal Documents'
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.snippet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesDept = deptFilter === 'all' || doc.department === deptFilter;

    if (['super_admin', 'hr_admin'].includes(currentRole)) return matchesSearch && matchesCategory && matchesDept;
    if (currentRole === 'manager') return matchesSearch && matchesCategory && matchesDept && doc.accessLevel !== 'Admin Only';
    return matchesSearch && matchesCategory && matchesDept && (doc.accessLevel === 'Public' || doc.accessLevel === 'Internal');
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Company Knowledge Base & RAG Index</span>
          </h1>
          <p className="text-xs text-slate-500">
            Internal document repository parsed into chunked embeddings for FAISS vector search.
          </p>
        </div>

        {hasPermission('upload_kb') && (
          <Link
            href="/knowledge-base/upload"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Document</span>
          </Link>
        )}
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center space-x-4">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Documents</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{totalCount}</div>
            <div className="text-[11px] text-slate-400">In FAISS Vector DB</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center space-x-4">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Approved & Indexed</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{approvedCount}</div>
            <div className="text-[11px] text-emerald-600 font-medium">Ready for RAG Q&A</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center space-x-4">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Processing & Pending</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{pendingCount}</div>
            <div className="text-[11px] text-amber-600 font-medium">Embedding pipeline</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center space-x-4">
          <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Rejected Documents</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{rejectedCount}</div>
            <div className="text-[11px] text-red-600 font-medium">Failed security audit</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document title, snippet..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"
          >
            <option value="all">All Approved Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"
          >
            <option value="all">All Departments</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance & Compliance">Finance & Compliance</option>
            <option value="Engineering">Engineering</option>
            <option value="Legal & Security">Legal & Security</option>
            <option value="IT Operations">IT Operations</option>
          </select>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Uploaded By</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Access Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="space-y-2">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-semibold text-slate-700 text-xs">No documents found matching your search</div>
                      <p className="text-[11px] text-slate-400">Try adjusting your category or department filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate max-w-xs">{doc.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize} • {doc.fileType}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {doc.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {doc.department}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {doc.uploadedBy}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {doc.uploadDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        doc.accessLevel === 'Public' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        doc.accessLevel === 'Internal' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        doc.accessLevel === 'Confidential' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {doc.accessLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedDocForPreview(doc)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                          title="Preview Snippet"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {['super_admin', 'hr_admin'].includes(currentRole) && doc.status !== 'Approved' && (
                          <button
                            onClick={() => updateDocumentStatus(doc.id, 'Approved')}
                            className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50"
                            title="Approve Document"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-blue-600 uppercase font-semibold">FAISS Vector Chunk Preview</span>
                <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>{selectedDocForPreview.title}</span>
                </h3>
              </div>
              <button onClick={() => setSelectedDocForPreview(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 font-mono text-xs text-slate-800 space-y-2 border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Extracted Text Snippet:
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">
                "{selectedDocForPreview.snippet}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div><span className="text-slate-400">Category:</span> <span className="font-semibold text-slate-800">{selectedDocForPreview.category}</span></div>
              <div><span className="text-slate-400">Department:</span> <span className="font-semibold text-slate-800">{selectedDocForPreview.department}</span></div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KnowledgeBasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center font-sans text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading Knowledge Base...</span>
        </div>
      </div>
    }>
      <KnowledgeBaseContent />
    </Suspense>
  );
}
