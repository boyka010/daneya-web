'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductsManagement from '@/components/admin/ProductsManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import CustomersManagement from '@/components/admin/CustomersManagement';
import AnalyticsPage from '@/components/admin/AnalyticsPage';
import ContentPage from '@/components/admin/ContentPage';
import ThemeBuilder from '@/components/admin/ThemeBuilder';
import SettingsPage from '@/components/admin/SettingsPage';
import { Lock, ShieldAlert, X } from 'lucide-react';

const SESSION_KEY = 'daneya-admin-auth';
const SESSION_TIMESTAMP_KEY = 'daneya-admin-auth-time';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

const ADMIN_CREDENTIALS_KEY = 'daneya-admin-creds';

function hashCredential(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function getStoredCredentials(): { pinHash: string; salt: string } | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
  if (!stored) {
    const defaultSalt = generateSecureToken();
    const defaultPinHash = hashCredential('daneya2025' + defaultSalt);
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify({ pinHash: defaultPinHash, salt: defaultSalt }));
    return { pinHash: defaultPinHash, salt: defaultSalt };
  }
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function verifyPin(pin: string): boolean {
  const creds = getStoredCredentials();
  if (!creds) return false;
  const inputHash = hashCredential(pin + creds.salt);
  return inputHash === creds.pinHash;
}

const sectionTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  products: 'Products',
  customers: 'Customers',
  analytics: 'Analytics',
  content: 'Content',
  themes: 'Theme Builder',
  settings: 'Settings',
};

function AdminLockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(pin)) {
      const secureToken = generateSecureToken();
      sessionStorage.setItem(SESSION_KEY, secureToken);
      sessionStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin('');
    }
  }, [pin, onUnlock]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPin(value);
    setError(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
      <div className="w-full max-w-sm mx-4">
        <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          {/* Header */}
          <div className="bg-gray-900 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">Admin Access Required</h1>
            <p className="text-sm text-gray-400 mt-1">Enter your PIN to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="relative">
              <input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={handlePinChange}
                placeholder="Enter PIN"
                autoComplete="off"
                className={`w-full bg-gray-50 border-2 py-3.5 px-4 text-center text-lg font-mono tracking-[0.3em] text-gray-900 placeholder:text-gray-400 placeholder:tracking-normal focus:outline-none transition-colors ${
                  error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-900'
                }`}
              />
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 justify-center">
                <ShieldAlert size={14} className="text-red-500" />
                <span className="text-sm font-medium text-red-500">Access Denied — Invalid PIN</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-6 bg-gray-900 text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Unlock
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-4">
              Session expires after 30 minutes of inactivity
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

export default function AdminPage() {
  const currentPage = useStore((s) => s.currentPage);
  const adminSection = useStore((s) => s.adminSection);
  const setAdminSection = useStore((s) => s.setAdminSection);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check session on mount
  useEffect(() => {
    const auth = sessionStorage.getItem(SESSION_KEY);
    const timestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);

    if (auth === 'true' && timestamp) {
      const elapsed = Date.now() - parseInt(timestamp, 10);
      if (elapsed < SESSION_TIMEOUT_MS) {
        // Refresh timestamp
        sessionStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
        setIsAuthenticated(true);
      } else {
        // Session expired
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
      }
    }
    setIsChecking(false);
  }, []);

  // Auto-logout after 30 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInterval = setInterval(() => {
      const timestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
      if (!timestamp) {
        setIsAuthenticated(false);
        return;
      }
      const elapsed = Date.now() - parseInt(timestamp, 10);
      if (elapsed >= SESSION_TIMEOUT_MS) {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
        setIsAuthenticated(false);
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(checkInterval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isAuthenticated]);

  // Clear session on unmount (tab close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Using sessionStorage means it's auto-cleared when tab closes.
      // We keep the session alive while the tab is open via the interval check.
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Sync URL section to store
  useEffect(() => {
    if (currentPage.type === 'admin') {
      const section = currentPage.section || 'dashboard';
      if (adminSection !== section) {
        setAdminSection(section);
      }
    }
  }, [currentPage, adminSection, setAdminSection]);

  const handleUnlock = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
    setIsAuthenticated(false);
  }, []);

  // Show loading while checking session
  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
        <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Show lock screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLockScreen onUnlock={handleUnlock} />;
  }

  const renderContent = () => {
    switch (adminSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'orders':
        return <OrdersManagement />;
      case 'products':
        return <ProductsManagement />;
      case 'customers':
        return <CustomersManagement />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'content':
        return <ContentPage />;
      case 'themes':
        return <ThemeBuilder />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  const title = sectionTitles[adminSection] || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>HAYA Store</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-700">{title}</span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Lock admin panel"
            >
              <Lock size={12} />
              <span>Lock</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
