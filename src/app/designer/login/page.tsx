// app/designer/login/page.tsx
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Palette, Code2, AlertCircle } from 'lucide-react';

// Main component that uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [portalType, setPortalType] = useState<'designer' | 'developer'>('designer');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Detect theme
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  // Theme colors - matching the existing component colors
  const GOLD = '#E8CA5E';
  const CHOCOLATE = '#7B3F00';
  const BLUE = '#0066FF';
  
  // Accent: Gold in dark, Chocolate in light for Business Dev
  // For Designer: Blue, Developer: Purple
  const getAccentColor = () => {
    if (portalType === 'designer') return BLUE;
    if (portalType === 'developer') return '#7C3AED'; // Purple
    return BLUE;
  };

  const accentColor = getAccentColor();
  const accentShadow = isDark ? `${accentColor}30` : `${accentColor}25`;
  const accentHoverShadow = isDark ? `${accentColor}50` : `${accentColor}40`;

  const bgColor = isDark ? '#0B0F19' : '#F4F7FC';
  const cardBg = isDark ? '#0F172A' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E5E7EB';
  const textColor = isDark ? '#FFFFFF' : '#1A2332';
  const textMuted = isDark ? '#9CA3AF' : '#6B7A8F';
  const inputBg = isDark ? '#0F172A' : '#FFFFFF';
  const inputBorder = isDark ? '#1E293B' : '#E5E7EB';
  const inputFocusBorder = accentColor;

  useEffect(() => {
    const type = searchParams.get('type') as 'designer' | 'developer';
    if (type === 'developer') {
      setPortalType('developer');
    }
    
    const designerAuth = sessionStorage.getItem('designer_auth');
    const developerAuth = sessionStorage.getItem('developer_auth');
    
    if (portalType === 'designer' && designerAuth) {
      try {
        const auth = JSON.parse(designerAuth);
        if (auth.user && auth.user.id) {
          router.replace('/designer');
        }
      } catch (e) {
        sessionStorage.removeItem('designer_auth');
      }
    }
    
    if (portalType === 'developer' && developerAuth) {
      try {
        const auth = JSON.parse(developerAuth);
        if (auth.user && auth.user.id) {
          router.replace('/developer');
        }
      } catch (e) {
        sessionStorage.removeItem('developer_auth');
      }
    }
  }, [router, searchParams, portalType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = portalType === 'developer' ? '/api/developers/login' : '/api/designers/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (portalType === 'designer') {
          sessionStorage.removeItem('designer_auth');
          sessionStorage.setItem('designer_auth', JSON.stringify({
            user: data.user,
            loggedInAt: new Date().toISOString()
          }));
          router.replace('/designer');
        } else {
          sessionStorage.removeItem('developer_auth');
          sessionStorage.setItem('developer_auth', JSON.stringify({
            user: data.user,
            loggedInAt: new Date().toISOString()
          }));
          router.replace('/developer');
        }
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: `${accentColor}08` }}
        />
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: `${accentColor}08` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 8px 32px ${accentShadow}`,
            }}
          >
            {portalType === 'designer' ? (
              <Palette size={32} className="text-white" />
            ) : (
              <Code2 size={32} className="text-white" />
            )}
          </div>
          <h1 
            className="text-2xl font-bold"
            style={{ color: textColor }}
          >
            {portalType === 'designer' ? 'Designer Portal' : 'Developer Portal'}
          </h1>
          <p 
            className="text-sm mt-1"
            style={{ color: textMuted }}
          >
            Sign in to your {portalType} account
          </p>
        </div>

        <div 
          className="rounded-2xl shadow-xl border p-6 md:p-8"
          style={{
            backgroundColor: cardBg,
            borderColor: borderColor,
            boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ backgroundColor: isDark ? '#1E293B' : '#F3F4F6' }}>
            <button
              onClick={() => {
                setPortalType('designer');
                setEmail('');
                setPassword('');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                portalType === 'designer'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              style={{
                backgroundColor: portalType === 'designer' ? accentColor : 'transparent',
                boxShadow: portalType === 'designer' ? `0 4px 16px ${accentShadow}` : 'none',
              }}
            >
              <Palette size={16} />
              Designer
            </button>
            <button
              onClick={() => {
                setPortalType('developer');
                setEmail('');
                setPassword('');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                portalType === 'developer'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              style={{
                backgroundColor: portalType === 'developer' ? accentColor : 'transparent',
                boxShadow: portalType === 'developer' ? `0 4px 16px ${accentShadow}` : 'none',
              }}
            >
              <Code2 size={16} />
              Developer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div 
                className="p-3 rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
                  border: `1px solid ${isDark ? 'rgba(239,68,68,0.3)' : '#FECACA'}`,
                }}
              >
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: textMuted }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: textMuted }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={portalType === 'designer' ? 'designer@example.com' : 'developer@example.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all duration-300 cursor-text placeholder:text-sm"
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textColor,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = inputFocusBorder;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}15`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = inputBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: textMuted }}
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: textMuted }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm focus:outline-none transition-all duration-300 cursor-text placeholder:text-sm"
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textColor,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = inputFocusBorder;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}15`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = inputBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform duration-200"
                  style={{ color: textMuted }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              style={{
                backgroundColor: accentColor,
                color: '#FFFFFF',
                boxShadow: `0 4px 16px ${accentShadow}`,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${accentHoverShadow}`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = `0 4px 16px ${accentShadow}`;
                }
              }}
            >
              {loading ? (
                <>
                  <div 
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In as {portalType === 'designer' ? 'Designer' : 'Developer'}
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-4 border-t text-center" style={{ borderColor: borderColor }}>
            <p className="text-xs" style={{ color: textMuted }}>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/partner')}
                className="hover:underline"
                style={{ color: accentColor }}
              >
                Register as {portalType === 'designer' ? 'Designer' : 'Developer'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Main exported component with Suspense
export default function DesignerLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}