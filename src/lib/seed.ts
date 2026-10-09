import { prisma } from './prisma';
import { hashPassword } from './auth/security';
import { DEFAULT_ROLE_PERMISSIONS, UserRole } from './types';

const DEFAULT_SALT = process.env.INITIAL_ADMIN_SALT || 'c8b4f210d7a93e81';

export const INITIAL_PERSISTENT_USERS = [
  {
    id: 'usr-admin-1',
    employeeId: 'EMP-1001',
    name: 'Ajai Raja (Super Admin)',
    email: 'ajairaja2004@gmail.com',
    role: 'super_admin' as UserRole,
    department: 'Executive Office',
    designation: 'System Super Admin',
    team: 'Core AI Infrastructure',
    managerName: 'Board of Directors',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2021-03-15',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    permissions: JSON.stringify(DEFAULT_ROLE_PERMISSIONS['super_admin'])
  },
  {
    id: 'usr-hr-1',
    employeeId: 'EMP-1002',
    name: 'HR Manager',
    email: 'hr@gmail.com',
    role: 'hr_admin' as UserRole,
    department: 'Human Resources',
    designation: 'HR Lead',
    team: 'HR People Operations',
    managerName: 'Ajai Raja',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2022-01-10',
    phone: '+1 (555) 012-9845',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    permissions: JSON.stringify(DEFAULT_ROLE_PERMISSIONS['hr_admin'])
  },
  {
    id: 'usr-tl-1',
    employeeId: 'EMP-1003',
    name: 'Team Lead',
    email: 'teamlead@gmail.com',
    role: 'team_lead' as UserRole,
    department: 'Engineering',
    designation: 'Technical Team Lead',
    team: 'Core AI Infrastructure',
    managerName: 'Ajai Raja',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2023-02-14',
    phone: '+1 (555) 014-7789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    permissions: JSON.stringify(DEFAULT_ROLE_PERMISSIONS['team_lead'])
  },
  {
    id: 'usr-mgr-1',
    employeeId: 'EMP-1004',
    name: 'Operations Manager',
    email: 'manager@gmail.com',
    role: 'manager' as UserRole,
    department: 'Management',
    designation: 'Department Director',
    team: 'Financial Planning & Compliance',
    managerName: 'Ajai Raja',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2022-06-01',
    phone: '+1 (555) 018-3321',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    permissions: JSON.stringify(DEFAULT_ROLE_PERMISSIONS['manager'])
  },
  {
    id: 'usr-emp-1',
    employeeId: 'EMP-1005',
    name: 'Employee User',
    email: 'employee@gmail.com',
    role: 'employee' as UserRole,
    department: 'Operations',
    designation: 'Staff Associate',
    team: 'General Workspace',
    managerName: 'Operations Manager',
    status: 'active',
    lastActive: 'Just now',
    joiningDate: '2023-09-01',
    phone: '+1 (555) 016-4455',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    permissions: JSON.stringify(DEFAULT_ROLE_PERMISSIONS['employee'])
  }
];

export async function seedDatabase() {
  const commonPasswordHash = hashPassword('R@jasekar2004', DEFAULT_SALT);

  for (const user of INITIAL_PERSISTENT_USERS) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email.toLowerCase().trim() }
    });

    if (!existing) {
      await prisma.user.create({
        data: {
          ...user,
          email: user.email.toLowerCase().trim(),
          passwordHash: commonPasswordHash,
          salt: DEFAULT_SALT
        }
      });
    }
  }
}
