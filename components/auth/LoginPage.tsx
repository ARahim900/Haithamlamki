'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<unknown>;
  onRegister: (email: string, password: string, fullName: string) => Promise<unknown>;
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        if (!fullName.trim()) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        await onRegister(email, password, fullName);
        setSuccess('Account created. Check your email for confirmation, then sign in.');
        setMode('login');
        setPassword('');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left panel — branding */}
        <div className="login-brand">
          <div className="login-brand-inner">
            <Image src="/abraj-logo.jpeg" alt="Abraj Energy Services" width={200} height={50} className="login-logo" priority />
            <h1 className="login-brand-title">Abraj MIS</h1>
            <p className="login-brand-sub">Rig Operations Management Platform</p>
            <div className="login-brand-features">
              <div className="login-feature">
                <span className="login-feature-icon">📊</span>
                <span>Fleet Performance Analytics</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">📋</span>
                <span>Daily Drilling Operations</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">💰</span>
                <span>Revenue &amp; Billing Tracking</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">📈</span>
                <span>Real-time KPI Dashboards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-form-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-form-title">
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="login-form-sub">
              {mode === 'login'
                ? 'Enter your credentials to access the dashboard'
                : 'Fill in your details to get started'}
            </p>

            {error && (
              <div className="login-alert login-alert-error" role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 10a.75.75 0 100 1.5.75.75 0 000-1.5zM8 4a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 008 4z" /></svg>
                {error}
              </div>
            )}

            {success && (
              <div className="login-alert login-alert-success" role="status">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.22 4.97a.75.75 0 00-1.06 0L7 9.13 5.84 7.97a.75.75 0 10-1.06 1.06l1.69 1.69a.75.75 0 001.06 0l3.69-3.69a.75.75 0 000-1.06z" /></svg>
                {success}
              </div>
            )}

            {mode === 'register' && (
              <div className="login-field">
                <label htmlFor="fullName" className="login-label">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  className="login-input"
                  placeholder="e.g. Haitham Al Lamki"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email" className="login-label">Email</label>
              <input
                id="email"
                type="email"
                className="login-input"
                placeholder="name@abraj.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">Password</label>
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>

            <div className="login-switch">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button type="button" className="login-link" onClick={() => { setMode('register'); setError(''); setSuccess(''); }}>
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" className="login-link" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>
                    Sign in
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
