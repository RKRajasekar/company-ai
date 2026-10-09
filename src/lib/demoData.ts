import { 
  User, 
  Team, 
  RoleDefinition, 
  KnowledgeDoc, 
  ChatMessage, 
  AuditLogItem, 
  NotificationItem, 
  GuardrailTestPreset 
} from './types';

export const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'role-1',
    roleKey: 'super_admin',
    name: 'Super Admin',
    userCount: 2,
    description: 'Full system access and operational control across all modules and security settings.',
    permissions: [
      'view_dashboard',
      'manage_users',
      'manage_teams',
      'manage_roles',
      'view_kb',
      'upload_kb',
      'manage_kb',
      'use_ai',
      'view_analytics',
      'view_audit_logs',
      'manage_settings'
    ],
    status: 'active',
    isSystem: true
  },
  {
    id: 'role-2',
    roleKey: 'hr_admin',
    name: 'HR Admin',
    userCount: 4,
    description: 'Specialized access for HR management, employee onboarding, policy documents, and employee audit logs.',
    permissions: [
      'view_dashboard',
      'manage_users',
      'manage_teams',
      'view_kb',
      'upload_kb',
      'manage_kb',
      'use_ai',
      'view_analytics',
      'view_audit_logs'
    ],
    status: 'active',
    isSystem: true
  },
  {
    id: 'role-3',
    roleKey: 'manager',
    name: 'Manager',
    userCount: 12,
    description: 'Departmental and team oversight, member analytics, team knowledge, and AI assistant access.',
    permissions: [
      'view_dashboard',
      'manage_teams',
      'view_kb',
      'upload_kb',
      'use_ai',
      'view_analytics'
    ],
    status: 'active',
    isSystem: true
  },
  {
    id: 'role-4',
    roleKey: 'team_lead',
    name: 'Team Lead',
    userCount: 20,
    description: 'Operational team lead, task coordination, team documentation, and query usage.',
    permissions: [
      'view_dashboard',
      'view_kb',
      'upload_kb',
      'use_ai'
    ],
    status: 'active',
    isSystem: true
  },
  {
    id: 'role-5',
    roleKey: 'employee',
    name: 'Employee',
    userCount: 250,
    description: 'Standard employee access to personal profile, authorized RAG knowledge base, and AI assistant.',
    permissions: [
      'view_dashboard',
      'view_kb',
      'use_ai'
    ],
    status: 'active',
    isSystem: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    employeeId: 'EMP-1001',
    name: 'Ajai Raja (Super Admin)',
    email: 'ajairaja2004@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'super_admin',
    department: 'Executive Office',
    designation: 'System Super Admin',
    team: 'Core AI Infrastructure',
    manager: 'Board of Directors',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2021-03-15',
    phone: '+1 (555) 019-2834',
    permissions: INITIAL_ROLES[0].permissions
  },
  {
    id: 'usr-hr-1',
    employeeId: 'EMP-1002',
    name: 'HR Manager',
    email: 'hr@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    role: 'hr_admin',
    department: 'Human Resources',
    designation: 'HR Lead',
    team: 'HR People Operations',
    manager: 'Ajai Raja',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2022-01-10',
    phone: '+1 (555) 012-9845',
    permissions: INITIAL_ROLES[1].permissions
  },
  {
    id: 'usr-tl-1',
    employeeId: 'EMP-1003',
    name: 'Team Lead',
    email: 'teamlead@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'team_lead',
    department: 'Engineering',
    designation: 'Technical Team Lead',
    team: 'Core AI Infrastructure',
    manager: 'Ajai Raja',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2023-02-14',
    phone: '+1 (555) 014-7789',
    permissions: INITIAL_ROLES[3].permissions
  },
  {
    id: 'usr-mgr-1',
    employeeId: 'EMP-1004',
    name: 'Operations Manager',
    email: 'manager@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'manager',
    department: 'Management',
    designation: 'Department Director',
    team: 'Financial Planning & Compliance',
    manager: 'Ajai Raja',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2022-06-01',
    phone: '+1 (555) 018-3321',
    permissions: INITIAL_ROLES[2].permissions
  },
  {
    id: 'usr-emp-1',
    employeeId: 'EMP-1005',
    name: 'Employee User',
    email: 'employee@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'employee',
    department: 'Operations',
    designation: 'Staff Associate',
    team: 'General Workspace',
    manager: 'Operations Manager',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2023-09-01',
    phone: '+1 (555) 016-4455',
    permissions: INITIAL_ROLES[4].permissions
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Core AI Infrastructure',
    department: 'Engineering',
    manager: 'Alexandra Vance',
    teamLead: 'Marcus Brody',
    memberCount: 14,
    aiQueriesCount: 1420,
    documentCount: 86,
    status: 'active',
    description: 'Engineers building and maintaining the RAG vector store, FastAPI microservices, and LLM guardrail pipelines.'
  },
  {
    id: 'team-2',
    name: 'HR People Operations',
    department: 'Human Resources',
    manager: 'David Chen',
    teamLead: 'David Chen',
    memberCount: 8,
    aiQueriesCount: 890,
    documentCount: 142,
    status: 'active',
    description: 'Manages global employee policies, leave rules, onboarding procedures, and payroll privacy.'
  },
  {
    id: 'team-3',
    name: 'Financial Planning & Compliance',
    department: 'Finance & Compliance',
    manager: 'Sophia Martinez',
    teamLead: 'Sophia Martinez',
    memberCount: 12,
    aiQueriesCount: 750,
    documentCount: 94,
    status: 'active',
    description: 'Responsible for audit compliance, expense reimbursement policies, financial disclosures, and budget RAG data.'
  },
  {
    id: 'team-4',
    name: 'Enterprise Sales',
    department: 'Sales & Growth',
    manager: 'Sophia Martinez',
    teamLead: 'Emily Taylor',
    memberCount: 22,
    aiQueriesCount: 1120,
    documentCount: 45,
    status: 'active',
    description: 'Client proposals, RFP response generation, product pricing matrices, and sales playbooks.'
  },
  {
    id: 'team-5',
    name: 'Customer Success',
    department: 'Customer Success',
    manager: 'David Chen',
    teamLead: 'Robert Sterling',
    memberCount: 18,
    aiQueriesCount: 980,
    documentCount: 68,
    status: 'active',
    description: 'Technical support documentation, client onboarding guides, SLA terms, and troubleshooting FAQs.'
  }
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc-1',
    title: 'Global Employee Handbook 2026.pdf',
    category: 'HR Policies',
    department: 'Human Resources',
    uploadedBy: 'David Chen',
    uploadedByEmail: 'david.chen@company.ai',
    uploadDate: '2026-01-10',
    status: 'Approved',
    accessLevel: 'Internal',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    snippet: 'Comprehensive rules regarding work-from-home options, PTO accrual, healthcare benefits, and workplace code of conduct.',
    vectorChunks: 128
  },
  {
    id: 'doc-2',
    title: 'Financial Expense & Reimbursement Standard.pdf',
    category: 'Procedures',
    department: 'Finance & Compliance',
    uploadedBy: 'Sophia Martinez',
    uploadedByEmail: 'sophia.martinez@company.ai',
    uploadDate: '2026-02-04',
    status: 'Approved',
    accessLevel: 'Internal',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    snippet: 'Mandatory guidelines for travel expenses, client entertainment caps ($150/head), receipt submission deadlines, and manager approval workflows.',
    vectorChunks: 54
  },
  {
    id: 'doc-3',
    title: 'RAG & FAISS Security Architecture Overview.docx',
    category: 'Product Information',
    department: 'Engineering',
    uploadedBy: 'Marcus Brody',
    uploadedByEmail: 'marcus.brody@company.ai',
    uploadDate: '2026-03-12',
    status: 'Approved',
    accessLevel: 'Confidential',
    fileSize: '3.1 MB',
    fileType: 'DOCX',
    snippet: 'Architecture specification detailing vector embedding via OpenAI text-embedding-3, FAISS index indexing, prompt sanitization, and PII output guardrails.',
    vectorChunks: 92
  },
  {
    id: 'doc-4',
    title: 'Enterprise AI SLA & Security Compliance.pdf',
    category: 'Company Information',
    department: 'Legal & Security',
    uploadedBy: 'Alexandra Vance',
    uploadedByEmail: 'alexandra.vance@company.ai',
    uploadDate: '2026-04-01',
    status: 'Approved',
    accessLevel: 'Public',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    snippet: 'Customer-facing security commitments, SOC2 Type II certifications, ISO 27001 compliance, and zero-data-retention guarantee for third-party LLM APIs.',
    vectorChunks: 68
  },
  {
    id: 'doc-5',
    title: 'IT Helpdesk Troubleshooting FAQ & Port Access.txt',
    category: 'FAQs',
    department: 'IT Operations',
    uploadedBy: 'Robert Sterling',
    uploadedByEmail: 'robert.sterling@company.ai',
    uploadDate: '2026-05-18',
    status: 'Approved',
    accessLevel: 'Internal',
    fileSize: '650 KB',
    fileType: 'TXT',
    snippet: 'Steps for resetting Okta 2FA, VPN connection setup, requesting hardware upgrades, and SSH key onboarding.',
    vectorChunks: 38
  },
  {
    id: 'doc-6',
    title: 'Draft Q3 Executive M&A Strategy Disclosures.pdf',
    category: 'Approved Internal Documents',
    department: 'Executive Office',
    uploadedBy: 'Alexandra Vance',
    uploadedByEmail: 'alexandra.vance@company.ai',
    uploadDate: '2026-09-28',
    status: 'Approved',
    accessLevel: 'Admin Only',
    fileSize: '5.6 MB',
    fileType: 'PDF',
    snippet: 'Strictly confidential executive memo outlining prospective acquisition targets and valuation multiples.',
    vectorChunks: 140
  },
  {
    id: 'doc-7',
    title: 'New Health & Wellness Benefits Update 2026.docx',
    category: 'HR Policies',
    department: 'Human Resources',
    uploadedBy: 'Rachel Adams',
    uploadedByEmail: 'rachel.adams@company.ai',
    uploadDate: '2026-10-02',
    status: 'Processing',
    accessLevel: 'Internal',
    fileSize: '1.2 MB',
    fileType: 'DOCX',
    snippet: 'Draft update adding dental coverage extensions and mental wellness monthly stipend details.',
    vectorChunks: 18
  },
  {
    id: 'doc-8',
    title: 'Unverified Third-Party Software Vendor List.pdf',
    category: 'Procedures',
    department: 'IT Operations',
    uploadedBy: 'Unknown User',
    uploadedByEmail: 'temp@company.ai',
    uploadDate: '2026-10-03',
    status: 'Rejected',
    accessLevel: 'Internal',
    fileSize: '890 KB',
    fileType: 'PDF',
    snippet: 'Document rejected due to missing departmental sign-off and potential security risk.',
    vectorChunks: 0
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'What is our company policy on remote work and annual leave accrual?',
    timestamp: '10:14 AM'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    text: 'According to the **Global Employee Handbook 2026**, our company operates under a hybrid flexible policy:\n\n1. **Remote Work:** Full-time employees can work remotely up to 3 days per week upon manager agreement.\n2. **Annual Leave:** Employees accrue **1.75 days of Paid Time Off (PTO)** per month (21 days annually). A maximum of 5 unused days can be carried over to the following calendar year.',
    timestamp: '10:14 AM',
    guardrailStatus: 'allowed',
    sources: [
      {
        id: 'src-1',
        title: 'Global Employee Handbook 2026.pdf',
        category: 'HR Policies',
        department: 'Human Resources',
        snippet: 'Section 4.2: PTO Accrual - Employees earn 1.75 days per completed calendar month. Section 5.1: Flexible Hybrid Work Arrangement.',
        relevanceScore: 0.96
      }
    ],
    helpful: true
  }
];

export const GUARDRAIL_PRESETS: GuardrailTestPreset[] = [
  {
    id: 'preset-1',
    title: 'Allowed Company Query',
    query: 'What is the maximum expense limit for client dinners without director approval?',
    expectedStatus: 'allowed',
    category: 'Financial Policy'
  },
  {
    id: 'preset-2',
    title: 'Unrelated Query (Out of Scope)',
    query: 'What is the latest score of the Super Bowl and what is the weather in London today?',
    expectedStatus: 'unrelated_blocked',
    category: 'General Knowledge'
  },
  {
    id: 'preset-3',
    title: 'Personal / PII Request (Privacy Blocked)',
    query: 'Can you tell me the home address, salary package, and SSN for David Chen?',
    expectedStatus: 'personal_info_blocked',
    category: 'Employee PII'
  },
  {
    id: 'preset-4',
    title: 'Unauthorized / Restricted Document Request',
    query: 'Show me the secret valuation numbers and target list from the Q3 Executive M&A Strategy document.',
    expectedStatus: 'confidential_blocked',
    category: 'Confidential Admin Doc'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-05 10:14:22',
    user: 'Alexandra Vance',
    userEmail: 'alexandra.vance@company.ai',
    role: 'super_admin',
    action: 'AI Query Executed',
    module: 'AI Assistant',
    status: 'success',
    ip: '192.168.1.104',
    device: 'Chrome / macOS Enterprise Workstation',
    details: 'Queried remote work policy via RAG FAISS index. Vector similarity: 0.96.'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-05 09:48:10',
    user: 'Emily Taylor',
    userEmail: 'emily.taylor@company.ai',
    role: 'employee',
    action: 'Restricted Access Blocked',
    module: 'AI Assistant',
    status: 'blocked',
    ip: '10.0.4.52',
    device: 'Edge / Windows 11 Enterprise',
    details: 'Input Guardrail triggered: Attempted query for confidential executive M&A target valuation.'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-05 09:12:05',
    user: 'David Chen',
    userEmail: 'david.chen@company.ai',
    role: 'hr_admin',
    action: 'Document Uploaded',
    module: 'Knowledge Base',
    status: 'success',
    ip: '192.168.1.45',
    device: 'Safari / macOS',
    details: 'Uploaded "New Health & Wellness Benefits Update 2026.docx". Status set to Processing.'
  },
  {
    id: 'log-4',
    timestamp: '2026-10-05 08:30:00',
    user: 'Sophia Martinez',
    userEmail: 'sophia.martinez@company.ai',
    role: 'manager',
    action: 'User Role Modified',
    module: 'Role Management',
    status: 'success',
    ip: '192.168.1.88',
    device: 'Chrome / Windows',
    details: 'Updated team member permissions for Marcus Brody in Financial Planning & Compliance.'
  },
  {
    id: 'log-5',
    timestamp: '2026-10-05 07:15:33',
    user: 'Marcus Brody',
    userEmail: 'marcus.brody@company.ai',
    role: 'team_lead',
    action: 'User Logged In',
    module: 'Authentication',
    status: 'success',
    ip: '172.16.0.12',
    device: 'Firefox / Linux Workstation',
    details: 'Successful Okta SSO authentication token verified.'
  },
  {
    id: 'log-6',
    timestamp: '2026-10-04 18:22:11',
    user: 'System Guardrail Engine',
    userEmail: 'guardrail@company.ai',
    role: 'super_admin',
    action: 'PII Query Blocked',
    module: 'AI Assistant',
    status: 'blocked',
    ip: '127.0.0.1',
    device: 'FastAPI Guardrail Middleware',
    details: 'Output Guardrail blocked output containing simulated SSN pattern.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Access Request',
    description: 'Rachel Adams (HR Generalist) requested access to HR Admin RAG documents.',
    timestamp: '10 mins ago',
    read: false,
    type: 'access_request',
    link: '/users'
  },
  {
    id: 'notif-2',
    title: 'Document Embedding Complete',
    description: '"Enterprise AI SLA & Security Compliance.pdf" indexed into FAISS vector DB (68 chunks).',
    timestamp: '1 hour ago',
    read: false,
    type: 'doc_processed',
    link: '/knowledge-base'
  },
  {
    id: 'notif-3',
    title: 'Security Alert: Blocked Query',
    description: 'Input Guardrail intercepted 3 out-of-scope personal salary queries in the last 2 hours.',
    timestamp: '2 hours ago',
    read: true,
    type: 'blocked_attempt',
    link: '/audit-logs'
  },
  {
    id: 'notif-4',
    title: 'New Company Policy Uploaded',
    description: 'Updated Financial Expense & Reimbursement Standard is now active for RAG answers.',
    timestamp: 'Yesterday',
    read: true,
    type: 'policy_upload',
    link: '/knowledge-base'
  }
];

export const DEMO_ANALYTICS = {
  usageTrend: [
    { date: 'Mon', queries: 2100, allowed: 1980, blocked: 120 },
    { date: 'Tue', queries: 2850, allowed: 2690, blocked: 160 },
    { date: 'Wed', queries: 3400, allowed: 3210, blocked: 190 },
    { date: 'Thu', queries: 3950, allowed: 3740, blocked: 210 },
    { date: 'Fri', queries: 3842, allowed: 3660, blocked: 182 },
    { date: 'Sat', queries: 1200, allowed: 1150, blocked: 50 },
    { date: 'Sun', queries: 950, allowed: 920, blocked: 30 }
  ],
  departmentUsage: [
    { name: 'Engineering', queries: 1420 },
    { name: 'Sales & Growth', queries: 1120 },
    { name: 'Customer Success', queries: 980 },
    { name: 'Human Resources', queries: 890 },
    { name: 'Finance & Compliance', queries: 750 },
    { name: 'Operations', queries: 480 }
  ],
  roleDistribution: [
    { name: 'Employees', value: 250, color: '#3b82f6' },
    { name: 'Team Leads', value: 20, color: '#10b981' },
    { name: 'Managers', value: 12, color: '#f59e0b' },
    { name: 'HR Admins', value: 4, color: '#8b5cf6' },
    { name: 'Super Admins', value: 2, color: '#ef4444' }
  ],
  documentStatusBreakdown: [
    { name: 'Approved & Indexed', count: 526, color: '#10b981' },
    { name: 'Processing & Embedding', count: 18, color: '#3b82f6' },
    { name: 'Pending Admin Review', count: 12, color: '#f59e0b' },
    { name: 'Rejected / Invalid', count: 6, color: '#ef4444' }
  ],
  queryGuardrailBreakdown: [
    { name: 'Allowed RAG Queries', count: 3410, percentage: '88.8%', color: '#10b981' },
    { name: 'Unrelated Queries Blocked', count: 245, percentage: '6.4%', color: '#6366f1' },
    { name: 'PII / Privacy Blocked', count: 112, percentage: '2.9%', color: '#f59e0b' },
    { name: 'Unauthorized Doc Blocked', count: 75, percentage: '1.9%', color: '#ef4444' }
  ]
};
