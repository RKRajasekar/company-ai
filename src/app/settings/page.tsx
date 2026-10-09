'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Settings, 
  Building, 
  Lock, 
  Cpu, 
  ShieldCheck, 
  Bell, 
  CheckCircle2,
  Save,
  Globe,
  KeyRound,
  Sliders,
  Users,
  AlertTriangle,
  Mail,
  ShieldAlert,
  Loader2
} from 'lucide-react';

import { PermissionGuard } from '@/components/common/PermissionGuard';

type TabType = 'general' | 'security' | 'ai' | 'access' | 'notifications';

export default function SettingsPage() {
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // Success Notification State
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. General Settings State
  const [companyName, setCompanyName] = useState('CompanyAI Enterprise Inc.');
  const [companyLogo, setCompanyLogo] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80');
  const [organizationId, setOrganizationId] = useState('ORG-ENT-2026-8942');
  const [defaultLanguage, setDefaultLanguage] = useState('en-US');
  const [timezone, setTimezone] = useState('America/New_York (UTC-5)');

  // 2. Security Settings State
  const [passwordMinLength, setPasswordMinLength] = useState(12);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
  const [enable2FA, setEnable2FA] = useState(true);
  const [loginSecurityMode, setLoginSecurityMode] = useState('Strict SAML SSO & MFA');

  // 3. AI Configuration State
  const [aiModel, setAiModel] = useState('fastapi-rag-llama3');
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [inputGuardrail, setInputGuardrail] = useState('Strict PII & Non-Corporate Query Block');
  const [outputGuardrail, setOutputGuardrail] = useState('Automatic Data Leak & Citation Sanitization');

  // 4. Access Control State
  const [defaultEmployeeAccess, setDefaultEmployeeAccess] = useState('Read-Only Authorized Knowledge Base');
  const [defaultManagerAccess, setDefaultManagerAccess] = useState('Department Workspace & User Oversight');
  const [defaultTeamLeadAccess, setDefaultTeamLeadAccess] = useState('Team Workspace & Document Management');

  // 5. Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [accessRequests, setAccessRequests] = useState(true);
  const [documentProcessingAlerts, setDocumentProcessingAlerts] = useState(true);

  const handleSave = async (tabName: string) => {
    setIsSaving(true);
    setSaveSuccessMsg(null);

    // Simulate saving settings to server
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsSaving(false);
    setSaveSuccessMsg(`Saved successfully! ${tabName} settings have been updated.`);

    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  return (
    <PermissionGuard permission="settings">
      <div className="max-w-5xl mx-auto space-y-6 font-sans">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <span>Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure enterprise platform parameters, AI model guardrails, security policies, and access controls.
          </p>
        </div>

        {/* Save Success Banner */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'general' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>General</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'security' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'ai' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('access')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'access' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Access Control</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>General Organization Settings</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Company Logo URL</label>
                <input
                  type="text"
                  value={companyLogo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Organization ID</label>
                <input
                  type="text"
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Default Language</label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                  <option value="es-ES">Spanish (Español)</option>
                  <option value="de-DE">German (Deutsch)</option>
                  <option value="fr-FR">French (Français)</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-700">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="America/New_York (UTC-5)">Eastern Time (US & Canada) (UTC-5)</option>
                  <option value="America/Chicago (UTC-6)">Central Time (US & Canada) (UTC-6)</option>
                  <option value="America/Los_Angeles (UTC-8)">Pacific Time (US & Canada) (UTC-8)</option>
                  <option value="Europe/London (UTC+0)">London, Edinburgh (UTC+0)</option>
                  <option value="Asia/Kolkata (UTC+5:30)">India Standard Time (UTC+5:30)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                disabled={isSaving}
                onClick={() => handleSave('General')}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Security */}
        {activeTab === 'security' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Security & Authentication Policy</span>
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>Password Policy</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">Minimum Password Length ({passwordMinLength} characters)</label>
                    <input
                      type="number"
                      min={8}
                      max={32}
                      value={passwordMinLength}
                      onChange={(e) => setPasswordMinLength(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <label className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                    <span className="font-semibold text-slate-800">Require Special Characters & Symbols</span>
                    <input
                      type="checkbox"
                      checked={requireSpecialChars}
                      onChange={(e) => setRequireSpecialChars(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Login Security Mode</label>
                  <select
                    value={loginSecurityMode}
                    onChange={(e) => setLoginSecurityMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                  >
                    <option value="Strict SAML SSO & MFA">Strict SAML SSO & MFA Mandatory</option>
                    <option value="Password + 2FA Optional">Password + TOTP 2FA Optional</option>
                    <option value="Standard Password Auth">Standard Password Auth</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Two-Factor Authentication (2FA)</div>
                  <div className="text-slate-500 text-[11px]">Enforce TOTP authenticator app verification for all employee accounts</div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnable2FA(!enable2FA)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    enable2FA ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      enable2FA ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                disabled={isSaving}
                onClick={() => handleSave('Security')}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: AI Configuration */}
        {activeTab === 'ai' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>AI Model & RAG Pipeline Configuration</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">AI Model Backbone</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                >
                  <option value="fastapi-rag-llama3">FastAPI + Llama 3 70B Enterprise (Self-Hosted)</option>
                  <option value="azure-openai-gpt4o">FastAPI + Azure OpenAI GPT-4o Zero Data Retention</option>
                  <option value="claude-3-5-sonnet">FastAPI + Claude 3.5 Sonnet Enterprise</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Response Temperature ({temperature})</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.0 (Strict / Deterministic)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-700">Max Tokens Output Limit ({maxTokens})</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Input Guardrail Rule</label>
                <select
                  value={inputGuardrail}
                  onChange={(e) => setInputGuardrail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                >
                  <option value="Strict PII & Non-Corporate Query Block">Strict PII & Non-Corporate Query Block</option>
                  <option value="PII Anonymization Only">PII Anonymization Only</option>
                  <option value="Permissive Logged Mode">Permissive Logged Mode</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Output Guardrail Rule</label>
                <select
                  value={outputGuardrail}
                  onChange={(e) => setOutputGuardrail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                >
                  <option value="Automatic Data Leak & Citation Sanitization">Automatic Data Leak & Citation Sanitization</option>
                  <option value="Strict Confidential Classification Filtering">Strict Confidential Classification Filtering</option>
                  <option value="Standard Response Verification">Standard Response Verification</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                disabled={isSaving}
                onClick={() => handleSave('AI Configuration')}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Access Control */}
        {activeTab === 'access' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Default Role Access Controls</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Default Employee Access</label>
                <input
                  type="text"
                  value={defaultEmployeeAccess}
                  onChange={(e) => setDefaultEmployeeAccess(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Default Manager Access</label>
                <input
                  type="text"
                  value={defaultManagerAccess}
                  onChange={(e) => setDefaultManagerAccess(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Default Team Lead Access</label>
                <input
                  type="text"
                  value={defaultTeamLeadAccess}
                  onChange={(e) => setDefaultTeamLeadAccess(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                disabled={isSaving}
                onClick={() => handleSave('Access Control')}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Notification & Alert Subscriptions</span>
            </h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Email Notifications</div>
                  <div className="text-slate-500 text-[11px]">Receive digest emails for operational updates and system reports</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Security Alerts</div>
                  <div className="text-slate-500 text-[11px]">Instant notifications for suspicious logins, PII blocks, or privilege changes</div>
                </div>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Access Requests</div>
                  <div className="text-slate-500 text-[11px]">Notify when team members request elevated role grants or document access</div>
                </div>
                <input
                  type="checkbox"
                  checked={accessRequests}
                  onChange={(e) => setAccessRequests(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Document Processing Alerts</div>
                  <div className="text-slate-500 text-[11px]">Notifications when FAISS vector chunking completes for uploaded PDFs</div>
                </div>
                <input
                  type="checkbox"
                  checked={documentProcessingAlerts}
                  onChange={(e) => setDocumentProcessingAlerts(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                disabled={isSaving}
                onClick={() => handleSave('Notifications')}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
