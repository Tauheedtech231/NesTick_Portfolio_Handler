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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4 ${
            portalType === 'designer' ? 'bg-blue-600' : 'bg-purple-600'
          }`}>
            {portalType === 'designer' ? (
              <Palette size={32} className="text-white" />
            ) : (
              <Code2 size={32} className="text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {portalType === 'designer' ? 'Designer Portal' : 'Developer Portal'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to your {portalType} account
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <button
              onClick={() => {
                setPortalType('designer');
                setEmail('');
                setPassword('');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                portalType === 'designer'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
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
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Code2 size={16} />
              Developer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={portalType === 'designer' ? 'designer@example.com' : 'developer@example.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                portalType === 'designer'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/partner')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
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