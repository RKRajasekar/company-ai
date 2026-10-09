'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Permission, 
  RoleDefinition, 
  KnowledgeDoc, 
  Team, 
  ChatMessage, 
  AuditLogItem, 
  NotificationItem,
  GuardrailStatus,
  SourceCitation,
  DEFAULT_ROLE_PERMISSIONS
} from '@/lib/types';
import { 
  INITIAL_USERS, 
  INITIAL_ROLES, 
  INITIAL_TEAMS, 
  INITIAL_KNOWLEDGE_DOCS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '@/lib/demoData';

interface AuthUserPayload {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  department?: string;
  designation?: string;
}

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  isAuthenticated: boolean;
  users: User[];
  roles: RoleDefinition[];
  teams: Team[];
  documents: KnowledgeDoc[];
  chatMessages: ChatMessage[];
  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
  
  // Actions
  login: (email: string, role?: UserRole, userData?: AuthUserPayload) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: Permission) => boolean;
  
  // Data Mutators for dynamic UI interactivity
  addUser: (newUser: Partial<User>) => void;
  updateUser: (id: string, updatedData: Partial<User>) => void;
  updateRolePermissions: (roleKey: UserRole, permissions: Permission[]) => void;
  createRole: (newRole: { name: string; description: string; permissions: Permission[] }) => void;
  addTeam: (newTeam: Partial<Team>) => void;
  addDocument: (newDoc: Partial<KnowledgeDoc>) => Promise<KnowledgeDoc>;
  updateDocumentStatus: (id: string, status: KnowledgeDoc['status']) => void;
  sendChatMessage: (queryText: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (action: string, module: AuditLogItem['module'], status: AuditLogItem['status'], details: string) => void;
}

const GUEST_USER: User = {
  id: 'usr-guest',
  employeeId: 'EMP-GUEST',
  name: 'Guest User',
  email: 'guest@company.ai',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  role: 'ai_only_user',
  department: 'General Access',
  designation: 'Guest',
  team: 'General Workspace',
  manager: 'N/A',
  status: 'active',
  lastActive: 'Just now',
  joiningDate: new Date().toISOString().split('T')[0],
  phone: '+1 (555) 000-0000',
  permissions: ['ai-assistant']
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [documents, setDocuments] = useState<KnowledgeDoc[]>(INITIAL_KNOWLEDGE_DOCS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [currentUser, setCurrentUser] = useState<User>(GUEST_USER);
  const [currentRole, setCurrentRole] = useState<UserRole>('ai_only_user');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Fetch persistent users from API and restore session
  useEffect(() => {
    const loadUsersAndSession = async () => {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (data.users && Array.isArray(data.users)) {
            setUsers(data.users);
          }
        }
      } catch (err) {
        // Fallback to local default
      }

      if (typeof window !== 'undefined') {
        const savedUserStr = localStorage.getItem('companyai_user');
        if (savedUserStr) {
          try {
            const saved = JSON.parse(savedUserStr);
            if (saved.email && saved.role) {
              const cleanEmail = saved.email.toLowerCase().trim();
              const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

              let hydratedUser: User;
              if (foundUser) {
                hydratedUser = { 
                  ...foundUser, 
                  role: saved.role,
                  name: saved.name || foundUser.name,
                  department: saved.department || foundUser.department,
                  designation: saved.designation || foundUser.designation,
                  permissions: DEFAULT_ROLE_PERMISSIONS[saved.role as UserRole] || foundUser.permissions
                };
              } else {
                const displayName = saved.name || cleanEmail.split('@')[0].replace('.', ' ') || 'Registered User';
                hydratedUser = {
                  id: saved.id || `usr-${Date.now()}`,
                  employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
                  name: displayName,
                  email: cleanEmail,
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                  role: saved.role,
                  department: saved.department || (saved.role === 'ai_only_user' ? 'General User' : 'Operations'),
                  designation: saved.designation || (saved.role === 'ai_only_user' ? 'AI Guest User' : 'Staff'),
                  team: 'General Workspace',
                  manager: 'N/A',
                  status: 'active',
                  lastActive: 'Just now',
                  joiningDate: new Date().toISOString().split('T')[0],
                  phone: '+1 (555) 019-0000',
                  permissions: DEFAULT_ROLE_PERMISSIONS[saved.role as UserRole] || ['ai-assistant']
                };
                setUsers(prev => [hydratedUser, ...prev.filter(u => u.email.toLowerCase() !== cleanEmail)]);
              }

              setCurrentUser(hydratedUser);
              setCurrentRole(saved.role);
              setIsAuthenticated(true);
              return;
            }
          } catch (e) {
            // ignore
          }
        }
        setIsAuthenticated(false);
        setCurrentUser(GUEST_USER);
      }
    };

    loadUsersAndSession();
  }, []);

  const login = (email: string, targetRole: UserRole = 'employee', userData?: AuthUserPayload) => {
    setIsAuthenticated(true);
    const cleanEmail = email.toLowerCase().trim();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    let userObj: User;

    if (foundUser) {
      userObj = { 
        ...foundUser, 
        role: targetRole,
        name: userData?.name || foundUser.name,
        department: userData?.department || foundUser.department,
        designation: userData?.designation || foundUser.designation,
        permissions: DEFAULT_ROLE_PERMISSIONS[targetRole] || foundUser.permissions
      };
    } else {
      const displayName = userData?.name || cleanEmail.split('@')[0].replace('.', ' ') || 'Registered User';
      userObj = {
        id: userData?.id || `usr-${Date.now()}`,
        employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: displayName,
        email: cleanEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: targetRole,
        department: userData?.department || (targetRole === 'ai_only_user' ? 'General User' : 'Operations'),
        designation: userData?.designation || (targetRole === 'ai_only_user' ? 'AI Guest User' : 'Staff'),
        team: 'General Workspace',
        manager: 'N/A',
        status: 'active',
        lastActive: 'Just now',
        joiningDate: new Date().toISOString().split('T')[0],
        phone: '+1 (555) 019-0000',
        permissions: DEFAULT_ROLE_PERMISSIONS[targetRole] || ['ai-assistant']
      };
      setUsers(prev => [userObj, ...prev.filter(u => u.email.toLowerCase() !== cleanEmail)]);
    }

    setCurrentUser(userObj);
    setCurrentRole(targetRole);

    if (typeof window !== 'undefined') {
      localStorage.setItem('companyai_user', JSON.stringify({ 
        email: cleanEmail, 
        name: userObj.name, 
        role: targetRole,
        department: userObj.department,
        designation: userObj.designation,
        id: userObj.id
      }));
    }
    
    addAuditLog('User Logged In', 'Authentication', 'success', `User ${userObj.name} (${cleanEmail}) logged in with role ${targetRole.toUpperCase()}.`);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
    setCurrentUser(GUEST_USER);
    setCurrentRole('ai_only_user');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('companyai_user');
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  const switchRole = (newRoleKey: UserRole) => {
    setCurrentRole(newRoleKey);
    const matchingUser = users.find(u => u.role === newRoleKey);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      setCurrentUser(prev => ({
        ...prev,
        role: newRoleKey,
        permissions: DEFAULT_ROLE_PERMISSIONS[newRoleKey] || roles.find(r => r.roleKey === newRoleKey)?.permissions || []
      }));
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('companyai_user', JSON.stringify({ 
        email: currentUser.email, 
        name: currentUser.name,
        role: newRoleKey,
        department: currentUser.department,
        designation: currentUser.designation,
        id: currentUser.id
      }));
    }
    addAuditLog('Role Switched (Demo)', 'Role Management', 'success', `Simulated role switch to ${newRoleKey.toUpperCase()}.`);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (currentRole === 'super_admin') return true;
    if (currentRole === 'ai_only_user') {
      return permission === 'ai-assistant' || permission === 'use_ai';
    }

    const legacyMap: Record<string, string[]> = {
      'dashboard': ['view_dashboard', 'dashboard'],
      'users': ['manage_users', 'users'],
      'roles': ['manage_roles', 'roles'],
      'teams': ['manage_teams', 'teams'],
      'knowledge-base': ['view_kb', 'upload_kb', 'manage_kb', 'knowledge-base'],
      'ai-assistant': ['use_ai', 'ai-assistant'],
      'audit-logs': ['view_audit_logs', 'audit-logs'],
      'settings': ['manage_settings', 'settings'],
    };

    const targetKeys = legacyMap[permission] || [permission];

    // 1. Check user-assigned permissions
    if (currentUser && Array.isArray(currentUser.permissions) && currentUser.permissions.length > 0) {
      if (currentUser.permissions.some(p => targetKeys.includes(p as string))) {
        return true;
      }
    }

    // 2. Check role definition permissions as fallback
    const roleDef = roles.find(r => r.roleKey === currentRole);
    if (!roleDef) return false;
    return roleDef.permissions.some(p => targetKeys.includes(p as string));
  };

  const addAuditLog = (
    action: string, 
    module: AuditLogItem['module'], 
    status: AuditLogItem['status'], 
    details: string
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      userEmail: currentUser.email,
      role: currentRole,
      action,
      module,
      status,
      ip: '192.168.1.' + (Math.floor(Math.random() * 200) + 10),
      device: 'Enterprise Web Client (Next.js)',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addUser = async (newUserPartial: Partial<User>) => {
    const selectedRole = newUserPartial.role || 'employee';
    const roleDef = roles.find(r => r.roleKey === selectedRole);
    
    // Default permissions logic
    const defaultPerms = ['dashboard', 'knowledge-base', 'ai-assistant'];
    const assignedPerms = (newUserPartial.permissions && newUserPartial.permissions.length > 0)
      ? newUserPartial.permissions
      : (roleDef ? roleDef.permissions : defaultPerms);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserPartial.name || 'New Employee',
          email: newUserPartial.email,
          password: (newUserPartial as any).password || 'R@jasekar2004',
          role: selectedRole,
          department: newUserPartial.department,
          designation: newUserPartial.designation,
          team: newUserPartial.team,
          permissions: assignedPerms
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUsers(prev => [data.user, ...prev.filter(u => u.id !== data.user.id && u.email.toLowerCase() !== data.user.email.toLowerCase())]);
          setRoles(prev => prev.map(r => r.roleKey === selectedRole ? { ...r, userCount: r.userCount + 1 } : r));
          addAuditLog('User Created', 'User Management', 'success', `Created user ${data.user.name} (${data.user.email}) with role ${selectedRole}.`);
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      employeeId: newUserPartial.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newUserPartial.name || 'New Employee',
      email: newUserPartial.email || 'employee@gmail.com',
      avatar: newUserPartial.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: selectedRole,
      department: newUserPartial.department || 'Human Resources',
      designation: newUserPartial.designation || 'Specialist',
      team: newUserPartial.team || 'HR People Operations',
      manager: newUserPartial.manager || 'Ajai Raja',
      status: newUserPartial.status || 'active',
      lastActive: 'Just now',
      joiningDate: new Date().toISOString().split('T')[0],
      phone: newUserPartial.phone || '+1 (555) 019-0000',
      permissions: assignedPerms as Permission[]
    };

    setUsers(prev => [newUser, ...prev]);
    setRoles(prev => prev.map(r => r.roleKey === newUser.role ? { ...r, userCount: r.userCount + 1 } : r));
    addAuditLog('User Created', 'User Management', 'success', `Created user ${newUser.name} (${newUser.email}) with role ${newUser.role}.`);
  };

  const updateUser = async (id: string, updatedData: Partial<User>) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data.user } : u));
          if (currentUser.id === id || currentUser.email.toLowerCase() === data.user.email.toLowerCase()) {
            setCurrentUser(prev => ({ ...prev, ...data.user }));
          }
          addAuditLog('User Profile Updated', 'User Management', 'success', `Updated user ID ${id} profile details.`);
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const merged = { ...u, ...updatedData };
        if (currentUser.id === id || currentUser.email.toLowerCase() === u.email.toLowerCase()) {
          setCurrentUser(merged);
        }
        return merged;
      }
      return u;
    }));
    addAuditLog('User Profile Updated', 'User Management', 'success', `Updated user ID ${id} profile details and permissions.`);
  };

  const updateRolePermissions = (roleKey: UserRole, permissions: Permission[]) => {
    setRoles(prev => prev.map(r => r.roleKey === roleKey ? { ...r, permissions } : r));
    setUsers(prev => prev.map(u => u.role === roleKey ? { ...u, permissions } : u));
    if (currentUser.role === roleKey) {
      setCurrentUser(prev => ({ ...prev, permissions }));
    }
    addAuditLog('Permissions Updated', 'Role Management', 'success', `Updated permissions matrix for role ${roleKey}.`);
  };

  const createRole = (newRoleData: { name: string; description: string; permissions: Permission[] }) => {
    const roleKeyStr = newRoleData.name.toLowerCase().replace(/\s+/g, '_') as UserRole;
    const newRole: RoleDefinition = {
      id: `role-${Date.now()}`,
      roleKey: roleKeyStr,
      name: newRoleData.name,
      userCount: 0,
      description: newRoleData.description,
      permissions: newRoleData.permissions,
      status: 'active',
      isSystem: false
    };
    setRoles(prev => [...prev, newRole]);
    addAuditLog('Custom Role Created', 'Role Management', 'success', `Created new custom role: ${newRoleData.name}.`);
  };

  const addTeam = (newTeamPartial: Partial<Team>) => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newTeamPartial.name || 'New Team Workspace',
      department: newTeamPartial.department || 'Engineering',
      description: newTeamPartial.description || 'Department workspace for team operations and file repositories.',
      manager: newTeamPartial.manager || currentUser.name,
      teamLead: newTeamPartial.teamLead || currentUser.name,
      memberCount: newTeamPartial.memberCount || 1,
      documentCount: newTeamPartial.documentCount || 0,
      aiQueriesCount: 0,
      status: newTeamPartial.status || 'active'
    };

    setTeams(prev => [...prev, newTeam]);
    addAuditLog('Team Workspace Created', 'User Management', 'success', `Created new team: ${newTeam.name} (${newTeam.department}).`);
  };

  const addDocument = async (newDocPartial: Partial<KnowledgeDoc>): Promise<KnowledgeDoc> => {
    const doc: KnowledgeDoc = {
      id: `doc-${Date.now()}`,
      title: newDocPartial.title || 'Untitled Document.pdf',
      category: newDocPartial.category || 'Company Information',
      department: newDocPartial.department || 'General',
      uploadedBy: currentUser.name,
      uploadedByEmail: currentUser.email,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Uploading',
      accessLevel: newDocPartial.accessLevel || 'Internal',
      fileSize: newDocPartial.fileSize || '2.4 MB',
      fileType: newDocPartial.fileType || 'PDF',
      snippet: newDocPartial.snippet || 'Document currently being processed for RAG vector search.',
      vectorChunks: 0
    };

    setDocuments(prev => [doc, ...prev]);
    addAuditLog('Document Uploaded', 'Knowledge Base', 'success', `Uploaded document "${doc.title}" to RAG pipeline.`);

    return doc;
  };

  const updateDocumentStatus = (id: string, status: KnowledgeDoc['status']) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        const chunks = status === 'Approved' || status === 'Indexed' ? Math.floor(20 + Math.random() * 80) : d.vectorChunks;
        return { ...d, status, vectorChunks: chunks };
      }
      return d;
    }));
    addAuditLog('Document Status Changed', 'Knowledge Base', 'success', `Document ${id} state updated to ${status}.`);
  };

  const sendChatMessage = async (queryText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      const data = await res.json();
      const status: GuardrailStatus = data.guardrailStatus || 'allowed';

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.text || 'An error occurred processing your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        guardrailStatus: status,
        sources: data.sources,
        blockedReason: data.blockedReason,
        helpful: null
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      addAuditLog(
        status === 'allowed' ? 'AI Query Executed' : 'Restricted Query Blocked',
        'AI Assistant',
        status === 'allowed' ? 'success' : 'blocked',
        `Query: "${queryText.substring(0, 40)}..." -> Status: ${status.toUpperCase()}`
      );
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: 'Failed to connect to AI Assistant service. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        guardrailStatus: 'allowed',
        helpful: null
      };
      setChatMessages(prev => [...prev, errorMsg]);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole,
      isAuthenticated,
      users,
      roles,
      teams,
      documents,
      chatMessages,
      auditLogs,
      notifications,
      login,
      logout,
      switchRole,
      hasPermission,
      addUser,
      updateUser,
      updateRolePermissions,
      createRole,
      addTeam,
      addDocument,
      updateDocumentStatus,
      sendChatMessage,
      markNotificationRead,
      markAllNotificationsRead,
      addAuditLog
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
