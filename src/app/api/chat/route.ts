import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth/security';
import { GuardrailStatus, SourceCitation } from '@/lib/types';

const PRIVACY_REFUSAL_MSG = "Sorry, I can't provide information about individual company employees or their private records. Please contact an authorized company administrator if you need assistance.";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('companyai_session')?.value;
    const session = token ? verifyAuthToken(token) : null;

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to access AI Assistant.' },
        { status: 401 }
      );
    }

    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query text is required.' },
        { status: 400 }
      );
    }

    const q = query.toLowerCase().trim();

    // --- Backend Security Guardrail: Employee Privacy Check ---
    const employeePrivacyKeywords = [
      'salary', 'salaries', 'pay', 'payroll', 'compensation', 'wages', 'stipend', 'package', 'earning', 'income',
      'phone', 'mobile', 'cell', 'contact number', 'phone number', 'email address', 'home address', 'street address',
      'attendance', 'leave history', 'leave record', 'employment record', 'joining date', 'employee id', 'ssn',
      'hr record', 'hr records', 'hr details', 'performance', 'appraisal', 'review', 'disciplinary', 'punishment', 'warning',
      'password', 'passwords', 'credential', 'credentials', 'secret',
      'personal info', 'personal details', 'private info', 'private details', 'employee details', 'employee record',
      'who works', 'list of employees', 'employee list', 'show me employees', 'all employees',
      'manager\'s personal', 'hr employee\'s', 'details of employee', 'employee info',
      // Employee names in system
      'rajasekar', 'ajai', 'sarah', 'marcus', 'elena', 'david', 'alexandra', 'vance', 'rostova', 'chen', 'jenkins'
    ];

    const isEmployeePrivacyViolation = employeePrivacyKeywords.some(kw => q.includes(kw));

    if (isEmployeePrivacyViolation) {
      return NextResponse.json({
        text: PRIVACY_REFUSAL_MSG,
        guardrailStatus: 'personal_info_blocked' as GuardrailStatus,
        blockedReason: 'Privacy Guardrail: Requests regarding individual employee personal information, compensation, or private records are strictly prohibited.'
      });
    }

    // --- Greetings Handling ---
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') || q.startsWith('hello ')) {
      return NextResponse.json({
        text: "Hi! How can I help you today?",
        guardrailStatus: 'allowed' as GuardrailStatus
      });
    } else if (q.includes('good morning')) {
      return NextResponse.json({
        text: "Good morning! How can I help you today?",
        guardrailStatus: 'allowed' as GuardrailStatus
      });
    } else if (q.includes('good afternoon')) {
      return NextResponse.json({
        text: "Good afternoon! How can I assist you today?",
        guardrailStatus: 'allowed' as GuardrailStatus
      });
    } else if (q.includes('good evening')) {
      return NextResponse.json({
        text: "Good evening! How can I help you today?",
        guardrailStatus: 'allowed' as GuardrailStatus
      });
    } else if (q.includes('how are you')) {
      return NextResponse.json({
        text: "I'm doing well, thank you! How can I assist you today?",
        guardrailStatus: 'allowed' as GuardrailStatus
      });
    } else if (q.includes('thank you') || q === 'thanks' || q.startsWith('thanks')) {
      return NextResponse.json({
        text: "You're welcome! Let me know if you need anything else.",
        guardrailStatus: 'allowed' as GuardrailStatus
      });
    } else if (q === 'okay' || q === 'ok') {
      return NextResponse.json({
        text: "Great! Let me know if you have any questions.",
        guardrailStatus: 'allowed' as GuardrailStatus
      });
    }

    // --- Authorized Company Knowledge Base Policies ---
    if (q.includes('leave') || q.includes('vacation') || q.includes('pto') || q.includes('holiday')) {
      const sources: SourceCitation[] = [
        {
          id: 'src-leave',
          title: 'Global Employee Handbook 2026.pdf',
          category: 'HR Policies',
          department: 'Human Resources',
          snippet: 'Section 4.1: Annual Leave & Absence Policy - 20 days paid vacation, 10 days sick leave.',
          relevanceScore: 0.97
        }
      ];
      return NextResponse.json({
        text: "Based on the Global Employee Handbook 2026, full-time employees receive 20 days of paid annual leave, 10 days of sick leave, and standard company holidays. To apply for leave, submit your request through the HR Portal at least 5 business days in advance for manager approval.",
        guardrailStatus: 'allowed' as GuardrailStatus,
        sources
      });
    } else if (q.includes('product') || q.includes('service') || q.includes('provide') || q.includes('offer')) {
      const sources: SourceCitation[] = [
        {
          id: 'src-prod',
          title: 'Company Product & Services Guide 2026.pdf',
          category: 'Approved Internal Documents',
          department: 'Product & Operations',
          snippet: 'Section 1: Enterprise AI Solutions - RAG document pipelines and assistant workflows.',
          relevanceScore: 0.96
        }
      ];
      return NextResponse.json({
        text: "CompanyAI provides enterprise RAG knowledge platforms, AI assistant agents, automated policy compliance tools, and secure document repository systems for departmental teams.",
        guardrailStatus: 'allowed' as GuardrailStatus,
        sources
      });
    } else if (q.includes('expense') || q.includes('reimburse') || q.includes('limit') || q.includes('dinner')) {
      const sources: SourceCitation[] = [
        {
          id: 'src-exp',
          title: 'Financial Expense & Reimbursement Standard.pdf',
          category: 'Procedures',
          department: 'Finance & Compliance',
          snippet: 'Section 3.4: Client Entertainment Expenses - Capped at $150/head. Receipts must be submitted within 14 business days.',
          relevanceScore: 0.95
        }
      ];
      return NextResponse.json({
        text: "Based on the Financial Expense & Reimbursement Standard, client entertainment and dinner expenses are capped at $150 per person. Receipts must be submitted within 14 business days.",
        guardrailStatus: 'allowed' as GuardrailStatus,
        sources
      });
    }

    // Default company knowledge query response
    const sources: SourceCitation[] = [
      {
        id: 'src-gen',
        title: 'Global Employee Handbook 2026.pdf',
        category: 'HR Policies',
        department: 'Human Resources',
        snippet: 'Section 1.2: Enterprise Operational Compliance & Knowledge Governance.',
        relevanceScore: 0.91
      }
    ];

    return NextResponse.json({
      text: `Based on authorized company knowledge base sources: "${query}" is documented in accordance with standard operating procedures and company policies.`,
      guardrailStatus: 'allowed' as GuardrailStatus,
      sources
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process AI query.' },
      { status: 500 }
    );
  }
}
