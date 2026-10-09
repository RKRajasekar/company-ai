import React from 'react';
import { GuardrailStatus } from '@/lib/types';
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

interface GuardrailAlertProps {
  status: GuardrailStatus;
  customText?: string;
  reason?: string;
}

export function GuardrailAlert({ status, customText, reason }: GuardrailAlertProps) {
  if (status === 'allowed') {
    return null;
  }

  const configs = {
    unrelated_blocked: {
      title: 'Input Guardrail: Unrelated Topic',
      defaultMsg: "I'm designed to answer questions related to your authorized company knowledge. I can't help with unrelated topics.",
      bg: 'bg-amber-50/80 border-amber-200 text-slate-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600'
    },
    personal_info_blocked: {
      title: 'Privacy Guardrail: Sensitive PII Blocked',
      defaultMsg: "I can't provide personal or confidential employee information.",
      bg: 'bg-amber-50/80 border-amber-200 text-slate-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600'
    },
    confidential_blocked: {
      title: 'Access Restricted',
      defaultMsg: 'Your current role does not have permission to access this information.',
      bg: 'bg-red-50/80 border-red-200 text-slate-900',
      icon: Lock,
      iconColor: 'text-red-600'
    }
  };

  const item = configs[status] || configs.unrelated_blocked;
  const IconComponent = item.icon;

  return (
    <div className={`p-4 rounded-xl border ${item.bg} my-3 text-xs transition-all shadow-xs`}>
      <div className="flex items-start space-x-3">
        <div className={`p-1.5 rounded-lg bg-white ${item.iconColor} shrink-0 border border-slate-200`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span>🔒</span>
              <span>{item.title}</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
              Guardrail Active
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {customText || item.defaultMsg}
          </p>
          {reason && (
            <p className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200">
              Technical Log: {reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
