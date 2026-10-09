import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth/security';
import { UserRole, DEFAULT_ROLE_PERMISSIONS, Permission } from '@/lib/types';
import { seedDatabase } from '@/lib/seed';

export interface RegisteredUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  department: string;
  designation: string;
  team: string;
  managerName: string;
  status: string;
  lastActive: string;
  joiningDate: string;
  phone: string;
  avatar: string;
  permissions: Permission[];
}

const DEFAULT_SALT = process.env.INITIAL_ADMIN_SALT || 'c8b4f210d7a93e81';

let isSeeded = false;
async function ensureSeeded() {
  if (!isSeeded) {
    try {
      await seedDatabase();
      isSeeded = true;
    } catch (e) {
      console.error('Seed error:', e);
    }
  }
}

export async function findUserByEmail(email: string): Promise<RegisteredUser | null> {
  if (!email || typeof email !== 'string') return null;
  await ensureSeeded();
  const cleanEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail }
  });

  if (!user) return null;

  let parsedPerms: Permission[] = [];
  try {
    parsedPerms = JSON.parse(user.permissions);
  } catch (e) {
    parsedPerms = DEFAULT_ROLE_PERMISSIONS[user.role as UserRole] || [];
  }

  return {
    id: user.id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    salt: user.salt,
    role: user.role as UserRole,
    department: user.department,
    designation: user.designation,
    team: user.team,
    managerName: user.managerName,
    status: user.status,
    lastActive: user.lastActive,
    joiningDate: user.joiningDate,
    phone: user.phone,
    avatar: user.avatar,
    permissions: parsedPerms
  };
}

export async function verifyUserCredentials(email: string, password: string): Promise<RegisteredUser | null> {
  if (!email || !password) return null;
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) return null;

  return user;
}

export async function getAllPersistentUsers(): Promise<RegisteredUser[]> {
  await ensureSeeded();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return users.map(u => {
    let parsedPerms: Permission[] = [];
    try {
      parsedPerms = JSON.parse(u.permissions);
    } catch (e) {
      parsedPerms = DEFAULT_ROLE_PERMISSIONS[u.role as UserRole] || [];
    }
    return {
      id: u.id,
      employeeId: u.employeeId,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      salt: u.salt,
      role: u.role as UserRole,
      department: u.department,
      designation: u.designation,
      team: u.team,
      managerName: u.managerName,
      status: u.status,
      lastActive: u.lastActive,
      joiningDate: u.joiningDate,
      phone: u.phone,
      avatar: u.avatar,
      permissions: parsedPerms
    };
  });
}

export async function registerNewEmployee(name: string, email: string, password: string): Promise<{ success: boolean; error?: string; user?: RegisteredUser }> {
  await ensureSeeded();
  const cleanEmail = email.toLowerCase().trim();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const existing = await prisma.user.findUnique({
    where: { email: cleanEmail }
  });

  if (existing) {
    return { success: false, error: 'An account with this email address already exists. Please login instead.' };
  }

  const passwordHash = hashPassword(password, DEFAULT_SALT);
  const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const defaultRole: UserRole = 'employee';

  const newUser = await prisma.user.create({
    data: {
      id: `usr-${Date.now()}`,
      employeeId,
      name,
      email: cleanEmail,
      passwordHash,
      salt: DEFAULT_SALT,
      role: defaultRole,
      department: 'Operations',
      designation: 'Staff Associate',
      team: 'General Workspace',
      managerName: 'N/A',
      status: 'active',
      lastActive: 'Just now',
      joiningDate: new Date().toISOString().split('T')[0],
      phone: '+1 (555) 019-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      permissions: JSON.stringify(DEFAULT_ROLE_PERMISSIONS[defaultRole])
    }
  });

  return {
    success: true,
    user: {
      id: newUser.id,
      employeeId: newUser.employeeId,
      name: newUser.name,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      salt: newUser.salt,
      role: newUser.role as UserRole,
      department: newUser.department,
      designation: newUser.designation,
      team: newUser.team,
      managerName: newUser.managerName,
      status: newUser.status,
      lastActive: newUser.lastActive,
      joiningDate: newUser.joiningDate,
      phone: newUser.phone,
      avatar: newUser.avatar,
      permissions: DEFAULT_ROLE_PERMISSIONS[defaultRole]
    }
  };
}

export async function registerUserByAdmin(data: {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string;
  designation?: string;
  team?: string;
  permissions?: Permission[];
}): Promise<{ success: boolean; error?: string; user?: RegisteredUser }> {
  await ensureSeeded();
  const cleanEmail = data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: cleanEmail }
  });

  if (existing) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const rawPassword = data.password || 'R@jasekar2004';
  const passwordHash = hashPassword(rawPassword, DEFAULT_SALT);
  const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

  const rolePerms = data.permissions && data.permissions.length > 0
    ? data.permissions
    : (DEFAULT_ROLE_PERMISSIONS[data.role] || []);

  const newUser = await prisma.user.create({
    data: {
      id: `usr-${Date.now()}`,
      employeeId,
      name: data.name,
      email: cleanEmail,
      passwordHash,
      salt: DEFAULT_SALT,
      role: data.role,
      department: data.department || (data.role === 'hr_admin' ? 'Human Resources' : data.role === 'manager' ? 'Management' : 'Operations'),
      designation: data.designation || data.role.toUpperCase(),
      team: data.team || 'General Workspace',
      managerName: 'N/A',
      status: 'active',
      lastActive: 'Just now',
      joiningDate: new Date().toISOString().split('T')[0],
      phone: '+1 (555) 019-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      permissions: JSON.stringify(rolePerms)
    }
  });

  return {
    success: true,
    user: {
      id: newUser.id,
      employeeId: newUser.employeeId,
      name: newUser.name,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      salt: newUser.salt,
      role: newUser.role as UserRole,
      department: newUser.department,
      designation: newUser.designation,
      team: newUser.team,
      managerName: newUser.managerName,
      status: newUser.status,
      lastActive: newUser.lastActive,
      joiningDate: newUser.joiningDate,
      phone: newUser.phone,
      avatar: newUser.avatar,
      permissions: rolePerms
    }
  };
}

export async function updateUserInDb(id: string, data: Partial<RegisteredUser>): Promise<RegisteredUser | null> {
  await ensureSeeded();
  const updatePayload: any = {};
  if (data.name) updatePayload.name = data.name;
  if (data.email) updatePayload.email = data.email.toLowerCase().trim();
  if (data.role) updatePayload.role = data.role;
  if (data.department) updatePayload.department = data.department;
  if (data.designation) updatePayload.designation = data.designation;
  if (data.team) updatePayload.team = data.team;
  if (data.status) updatePayload.status = data.status;
  if (data.permissions) updatePayload.permissions = JSON.stringify(data.permissions);

  const updated = await prisma.user.update({
    where: { id },
    data: updatePayload
  });

  let parsedPerms: Permission[] = [];
  try {
    parsedPerms = JSON.parse(updated.permissions);
  } catch (e) {
    parsedPerms = DEFAULT_ROLE_PERMISSIONS[updated.role as UserRole] || [];
  }

  return {
    id: updated.id,
    employeeId: updated.employeeId,
    name: updated.name,
    email: updated.email,
    passwordHash: updated.passwordHash,
    salt: updated.salt,
    role: updated.role as UserRole,
    department: updated.department,
    designation: updated.designation,
    team: updated.team,
    managerName: updated.managerName,
    status: updated.status,
    lastActive: updated.lastActive,
    joiningDate: updated.joiningDate,
    phone: updated.phone,
    avatar: updated.avatar,
    permissions: parsedPerms
  };
}
