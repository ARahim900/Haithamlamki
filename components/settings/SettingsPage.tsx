'use client';
import React, { useState, useEffect } from 'react';
import { KPI } from '@/components/Shared';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile, updatePassword } from '@/lib/auth';

export function SettingsPage() {
  const { user } = useAuth();

  // Profile
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  // Dark mode
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
    // Load saved theme preference
    const saved = localStorage.getItem('abraj-theme') as 'system' | 'light' | 'dark' | null;
    if (saved) setTheme(saved);
  }, [user]);

  useEffect(() => {
    const html = document.documentElement;
    localStorage.setItem('abraj-theme', theme);

    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
    } else {
      // system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }, [theme]);

  // Listen for system preference changes when in system mode
  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setProfileMsg('');
    try {
      await updateProfile({ full_name: fullName });
      setProfileMsg('Profile updated successfully.');
    } catch (err: unknown) {
      setProfileMsg(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwMsg('');
    if (newPassword.length < 6) {
      setPwMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg('Passwords do not match.');
      return;
    }
    setPwSaving(true);
    try {
      await updatePassword(newPassword);
      setPwMsg('Password changed successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setPwMsg(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  const initials = fullName
    ? fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="card">
        <div className="card-hdr">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">Settings</span>
            <span className="bdg p">Account &amp; Preferences</span>
          </div>
        </div>
      </div>

      {/* Profile KPIs */}
      <div className="kpi-row">
        <KPI l="Account" v={user?.email ?? '-'} cls="b" />
        <KPI l="Role" v={user?.user_metadata?.role ?? 'User'} cls="g" />
        <KPI l="Joined" v={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'} cls="b" />
        <KPI l="Last Sign In" v={user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'} cls="b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile Section */}
        <div className="card">
          <div className="card-hdr">Profile Information</div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="settings-avatar">{initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{fullName || 'No name set'}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{user?.email}</div>
              </div>
            </div>

            <div>
              <label className="f-lbl" htmlFor="settings-name">Full Name</label>
              <input
                id="settings-name"
                type="text"
                className="f-man"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="f-lbl" htmlFor="settings-email">Email</label>
              <input
                id="settings-email"
                type="email"
                className="f-man"
                value={user?.email ?? ''}
                readOnly
                style={{ opacity: 0.6 }}
              />
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Email cannot be changed</span>
            </div>

            {profileMsg && (
              <div className={profileMsg.includes('success') ? 'settings-msg settings-msg-ok' : 'settings-msg settings-msg-err'}>
                {profileMsg}
              </div>
            )}

            <button className="btn btn-p" onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="card">
          <div className="card-hdr">Change Password</div>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label className="f-lbl" htmlFor="settings-pw-new">New Password</label>
              <input
                id="settings-pw-new"
                type="password"
                className="f-man"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="f-lbl" htmlFor="settings-pw-confirm">Confirm Password</label>
              <input
                id="settings-pw-confirm"
                type="password"
                className="f-man"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>

            {pwMsg && (
              <div className={pwMsg.includes('success') ? 'settings-msg settings-msg-ok' : 'settings-msg settings-msg-err'}>
                {pwMsg}
              </div>
            )}

            <button className="btn btn-p" onClick={handleChangePassword} disabled={pwSaving}>
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card">
        <div className="card-hdr">Appearance</div>
        <div className="p-4">
          <label className="f-lbl">Theme</label>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            Choose how the dashboard looks. Dark mode is recommended for field use in harsh lighting.
          </p>
          <div className="settings-theme-grid">
            {(['light', 'dark', 'system'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                className={`settings-theme-btn${theme === opt ? ' active' : ''}`}
                onClick={() => setTheme(opt)}
                aria-pressed={theme === opt}
              >
                <span className="settings-theme-icon">
                  {opt === 'light' ? '☀️' : opt === 'dark' ? '🌙' : '💻'}
                </span>
                <span className="settings-theme-label">
                  {opt === 'light' ? 'Light' : opt === 'dark' ? 'Dark' : 'System'}
                </span>
                <span className="settings-theme-desc">
                  {opt === 'light' ? 'Office & meetings' : opt === 'dark' ? 'Field & night use' : 'Match device setting'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="card-hdr">About</div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Platform</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Abraj MIS Dashboard v1.0</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Stack</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Next.js 15 + React 19 + Supabase</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Operator</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Abraj Energy Services, Oman</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
