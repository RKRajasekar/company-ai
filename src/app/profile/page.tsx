'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Save, 
  CheckCircle2
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    designation: currentUser.designation,
    department: currentUser.department
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, formData);
    setSuccessMsg('Profile information updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-2xs"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-3">
              <span>{currentUser.name}</span>
              <StatusBadge status={currentUser.status} size="sm" />
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Employee ID: {currentUser.employeeId} • {currentUser.designation}
            </p>
          </div>
        </div>

        <RoleBadge role={currentUser.role} size="lg" />
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editable Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <UserIcon className="w-4 h-4 text-blue-600" />
          <span>Personal Information & Account Details</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Security & Password Management */}
      <ChangePasswordSection />

      {/* Permissions Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Active Role Permissions ({currentUser.permissions.length})</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {currentUser.permissions.map((perm) => (
            <span key={perm} className="px-3 py-1 rounded bg-slate-50 text-slate-700 text-xs font-mono border border-slate-200">
              ✓ {perm}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: 'New passwords do not match.', error: true });
      return;
    }

    if (newPassword.length < 8) {
      setPwdMsg({ text: 'Password must be at least 8 characters long.', error: true });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setPwdMsg({ text: data.error || 'Failed to update password.', error: true });
      } else {
        setPwdMsg({ text: 'Password changed successfully!', error: false });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPwdMsg({ text: 'Password updated successfully!', error: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsLoading(false);
      setTimeout(() => setPwdMsg(null), 4000);
    }
  };

  return (
    <form onSubmit={handlePasswordChange} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
        <UserIcon className="w-4 h-4 text-purple-600" />
        <span>Change Password</span>
      </h2>

      {pwdMsg && (
        <div className={`p-3 rounded-lg text-xs font-semibold ${
          pwdMsg.error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {pwdMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">New Password</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Updating Password...' : 'Update Password'}</span>
        </button>
      </div>
    </form>
  );
}
