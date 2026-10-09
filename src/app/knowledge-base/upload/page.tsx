'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DocumentCategory } from '@/lib/types';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Database, 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';

export default function DocumentUploadPage() {
  const router = useRouter();
  const { addDocument, updateDocumentStatus } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('HR Policies');
  const [department, setDepartment] = useState('Human Resources');
  const [accessLevel, setAccessLevel] = useState<'Public' | 'Internal' | 'Confidential' | 'Admin Only'>('Internal');
  const [snippet, setSnippet] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);

  const categoriesList: DocumentCategory[] = [
    'Company Information',
    'HR Policies',
    'Product Information',
    'FAQs',
    'Procedures',
    'Approved Internal Documents'
  ];

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      if (!title) setTitle(selectedFile.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) setTitle(selectedFile.name);
    }
  };

  const handleStartUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsProcessing(true);
    setCurrentStage(1);

    const createdDoc = await addDocument({
      title: title.endsWith('.pdf') || title.endsWith('.docx') || title.endsWith('.txt') ? title : `${title}.pdf`,
      category,
      department,
      accessLevel,
      fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB',
      fileType: file ? file.name.split('.').pop()?.toUpperCase() || 'PDF' : 'PDF',
      snippet: snippet || 'Standard operating procedure outlining company guidelines and vector index requirements.'
    });

    setTimeout(() => {
      setCurrentStage(2);
      updateDocumentStatus(createdDoc.id, 'Processing');
    }, 1200);

    setTimeout(() => {
      setCurrentStage(3);
      updateDocumentStatus(createdDoc.id, 'Embedding');
    }, 2500);

    setTimeout(() => {
      setCurrentStage(4);
      updateDocumentStatus(createdDoc.id, 'Indexed');
    }, 3800);

    setTimeout(() => {
      setCurrentStage(5);
      updateDocumentStatus(createdDoc.id, 'Approved');
      setIsProcessing(false);
    }, 4800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div>
        <Link href="/knowledge-base" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Base</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <Upload className="w-6 h-6 text-blue-600" />
          <span>Upload Document to RAG Pipeline</span>
        </h1>
        <p className="text-xs text-slate-500">
          Documents uploaded here are chunked, vectorized, and indexed into the FAISS vector database for authorized AI search.
        </p>
      </div>

      {currentStage > 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              {currentStage === 5 ? 'Document Successfully Indexed & Approved!' : 'Processing RAG Vector Pipeline'}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Document: {title}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { stage: 1, title: 'Stage 1: Document Uploading & Storage', desc: 'Saving file to encrypted S3 storage bucket', icon: Upload },
              { stage: 2, title: 'Stage 2: Text Extraction & OCR Parsing', desc: 'Parsing headers, tables, and clean plaintext', icon: FileText },
              { stage: 3, title: 'Stage 3: Vector Embedding Generation', desc: 'Computing dense 1536-dim embeddings via OpenAI Model', icon: Cpu },
              { stage: 4, title: 'Stage 4: Indexing into FAISS Vector Database', desc: 'Creating HNSW vector index & similarity centroids', icon: Database },
              { stage: 5, title: 'Stage 5: RAG Approval & Guardrail Ready', desc: 'Document live for authorized AI search queries', icon: CheckCircle2 }
            ].map((s) => {
              const IconComponent = s.icon;
              const isDone = currentStage > s.stage || currentStage === 5;
              const isCurrent = currentStage === s.stage && currentStage !== 5;

              return (
                <div
                  key={s.stage}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDone ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">{s.title}</div>
                      <div className="text-[11px] text-slate-500">{s.desc}</div>
                    </div>
                  </div>

                  <div>
                    {isDone ? (
                      <span className="text-xs font-bold text-emerald-600 font-mono">COMPLETE</span>
                    ) : isCurrent ? (
                      <span className="text-xs font-bold text-blue-600 font-mono">PROCESSING...</span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">QUEUED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {currentStage === 5 && (
            <div className="pt-4 flex items-center justify-center space-x-4">
              <Link
                href="/knowledge-base"
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center space-x-2"
              >
                <span>View in Knowledge Base</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleStartUpload} className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-50 transition-colors cursor-pointer space-y-2 relative"
          >
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
              <Upload className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                {file ? file.name : 'Drag and drop your company document here'}
              </p>
              <p className="text-[11px] text-slate-400">
                Supports PDF, DOCX, TXT up to 25MB
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Document Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Work From Home & Hybrid Policy 2026.pdf"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Document Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                >
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance & Compliance">Finance & Compliance</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Legal & Security">Legal & Security</option>
                  <option value="IT Operations">IT Operations</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Access Level Scope</label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
              >
                <option value="Public">Public (All company employees & clients)</option>
                <option value="Internal">Internal (Standard company employees only)</option>
                <option value="Confidential">Confidential (Managers & Team Leads only)</option>
                <option value="Admin Only">Admin Only (Super Admin & Executive Office)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Description</label>
              <textarea
                rows={3}
                placeholder="Brief summary of document..."
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Submit for RAG Vector Processing</span>
          </button>
        </form>
      )}
    </div>
  );
}
