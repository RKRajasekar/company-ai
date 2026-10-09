export type UserRole = 'super_admin' | 'hr_admin' | 'manager' | 'team_lead' | 'employee' | 'ai_only_user';

export type PermissionKey =
  | 'dashboard'
  | 'users'
  | 'roles'
  | 'teams'
  | 'knowledge-base'
  | 'ai-assistant'
  | 'audit-logs'
  | 'settings';

export type Permission = 
  | PermissionKey
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_teams'
  | 'manage_roles'
  | 'view_kb'
  | 'upload_kb'
  | 'manage_kb'
  | 'use_ai'
  | 'view_analytics'
  | 'view_audit_logs'
  | 'manage_settings';

export const ALL_PERMISSION_OPTIONS: { key: PermissionKey; label: string; route: string }[] = [
  { key: 'dashboard', label: 'Dashboard', route: '/dashboard' },
  { key: 'users', label: 'Users', route: '/users' },
  { key: 'roles', label: 'Roles & Permissions', route: '/roles' },
  { key: 'teams', label: 'Responsibilities', route: '/teams' },
  { key: 'knowledge-base', label: 'Knowledge Base', route: '/knowledge-base' },
  { key: 'ai-assistant', label: 'AI Assistant', route: '/ai-assistant' },
  { key: 'audit-logs', label: 'Audit Logs', route: '/audit-logs' },
  { key: 'settings', label: 'Settings', route: '/settings' }
];

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: ['dashboard', 'users', 'roles', 'teams', 'knowledge-base', 'ai-assistant', 'audit-logs', 'settings'],
  hr_admin: ['dashboard', 'users', 'teams', 'knowledge-base', 'ai-assistant', 'audit-logs', 'settings'],
  manager: ['dashboard', 'knowledge-base', 'ai-assistant'],
  team_lead: ['dashboard', 'knowledge-base', 'ai-assistant'],
  employee: ['dashboard', 'knowledge-base', 'ai-assistant'],
  ai_only_user: ['ai-assistant']
};

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: string;
  designation: string;
  team: string;
  manager: string;
  status: 'active' | 'pending' | 'disabled';
  lastActive: string;
  joiningDate: string;
  phone: string;
  permissions: Permission[];
}

export interface Team {
  id: string;
  name: string;
  department: string;
  manager: string;
  teamLead: string;
  memberCount: number;
  aiQueriesCount: number;
  documentCount: number;
  status: 'active' | 'archived';
  description: string;
}

export interface RoleDefinition {
  id: string;
  roleKey: UserRole;
  name: string;
  userCount: number;
  description: string;
  permissions: Permission[];
  status: 'active' | 'inactive';
  isSystem: boolean;
}

export type DocumentStatus = 'Uploading' | 'Processing' | 'Embedding' | 'Indexed' | 'Approved' | 'Rejected';

export type DocumentCategory = 
  | 'Company Information'
  | 'HR Policies'
  | 'Product Information'
  | 'FAQs'
  | 'Procedures'
  | 'Approved Internal Documents';

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: DocumentCategory;
  department: string;
  uploadedBy: string;
  uploadedByEmail: string;
  uploadDate: string;
  status: DocumentStatus;
  accessLevel: 'Public' | 'Internal' | 'Confidential' | 'Admin Only';
  fileSize: string;
  fileType: string;
  snippet?: string;
  vectorChunks?: number;
}

export type GuardrailStatus = 'allowed' | 'unrelated_blocked' | 'personal_info_blocked' | 'confidential_blocked';

export interface SourceCitation {
  id: string;
  title: string;
  category: DocumentCategory;
  department: string;
  snippet: string;
  relevanceScore: number; // e.g. 0.94
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  guardrailStatus?: GuardrailStatus;
  sources?: SourceCitation[];
  helpful?: boolean | null;
  blockedReason?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  role: UserRole;
  action: string;
  module: 'Authentication' | 'AI Assistant' | 'Knowledge Base' | 'User Management' | 'Role Management' | 'System Settings' | 'Teams';
  status: 'success' | 'warning' | 'blocked' | 'error';
  ip: string;
  device: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'access_request' | 'doc_processed' | 'role_changed' | 'policy_upload' | 'blocked_attempt' | 'system';
  link?: string;
}

export interface GuardrailTestPreset {
  id: string;
  title: string;
  query: string;
  expectedStatus: GuardrailStatus;
  category: string;
}
