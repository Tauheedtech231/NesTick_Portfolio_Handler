// app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollegeAdmin {
  email: string;
  password: string;
  adminName: string;
  collegeId: string;
}

interface AuthCollege {
  email: string;
  name: string;
  collegeId: string;
  token: string;
  timestamp: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const router = useRouter();

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
  
  // Accent: Gold in dark, Chocolate in light
  const accentColor = isDark ? GOLD : CHOCOLATE;
  const accentShadow = isDark ? `${GOLD}40` : `${CHOCOLATE}40`;
  const accentHoverShadow = isDark ? `${GOLD}50` : `${CHOCOLATE}50`;

  const bgColor = isDark ? '#0B0F19' : '#F4F7FC';
  const cardBg = isDark ? '#0F172A' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E5E7EB';
  const textColor = isDark ? '#FFFFFF' : '#1A2332';
  const textMuted = isDark ? '#9CA3AF' : '#6B7A8F';
  const inputBg = isDark ? '#0F172A' : '#FFFFFF';
  const inputBorder = isDark ? '#1E293B' : '#E5E7EB';
  const inputFocusBorder = isDark ? GOLD : CHOCOLATE;

  useEffect(() => {
    // Check if user is already authenticated
    const authCollege = localStorage.getItem('auth_college');
    console.log('Auth college from localStorage:', authCollege);
    if (authCollege) {
      router.push('/College_Portfolio_Handler');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // ✅ TEST CREDENTIALS - Direct redirect
      if (email.trim() === 'test@gmail.com' && password.trim() === '1234') {
        const authData: AuthCollege = {
          email: 'test@gmail.com',
          name: 'Test College',
          collegeId: 'TEST123',
          token: `college_${Date.now()}`,
          timestamp: Date.now()
        };

        // Save to localStorage
        localStorage.setItem('auth_college', JSON.stringify(authData));

        // Redirect to portal
        router.push('/College_Portfolio_Handler');
        setIsLoading(false);
        return;
      }

      // Regular API login
      const response = await fetch('/api/colleges/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Login failed");
        setIsLoading(false);
        return;
      }

      const authData: AuthCollege = {
        email: result.data.email,
        name: result.data.collegeName,
        collegeId: result.data.collegeId,
        token: `college_${Date.now()}`,
        timestamp: Date.now()
      };

      // Save to localStorage
      localStorage.setItem('auth_college', JSON.stringify(authData));

      // Redirect to portal
      router.push('/College_Portfolio_Handler');

    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Error popup component
  const ErrorPopup = () => {
    if (!error) return null;

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-300">
        <div 
          className="rounded-lg px-4 py-3 shadow-lg border"
          style={{
            backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
            borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p 
              className="text-sm font-medium"
              style={{ color: isDark ? '#FCA5A5' : '#DC2626' }}
            >
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{ background: `${accentColor}08` }}
        />
        <div 
          className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ background: `${accentColor}08` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ background: `${accentColor}05` }}
        />
      </div>

      <ErrorPopup />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with Real Logo - FULL ROUNDED */}
        <div className="text-center">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse"
              style={{ background: accentColor }}
            />
            <div 
              className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{ 
                boxShadow: `0 8px 32px ${accentShadow}`,
              }}
            >
              <Image
                src="/logo.jpg"
                alt="Neezamiya Logo"
                width={80}
                height={80}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
          <h2 
            className="text-3xl font-bold"
            style={{ color: accentColor }}
          >
            College Portal
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: textMuted }}
          >
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <form 
          onSubmit={handleLogin} 
          className="mt-8 space-y-6"
          style={{
            backgroundColor: cardBg,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${borderColor}`,
            boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2 cursor-pointer"
                style={{ color: textMuted }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: textMuted }} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl text-sm focus:outline-none transition-all duration-300 cursor-text"
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textColor,
                  }}
                  placeholder="Enter your email"
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

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2 cursor-pointer"
                style={{ color: textMuted }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: textMuted }} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 rounded-xl text-sm focus:outline-none transition-all duration-300 cursor-text"
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textColor,
                  }}
                  placeholder="Enter your password"
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:scale-110 transition-transform duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 transition-colors" style={{ color: textMuted }} />
                  ) : (
                    <Eye className="h-5 w-5 transition-colors" style={{ color: textMuted }} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer focus:outline-none"
            style={{
              backgroundColor: accentColor,
              color: isDark ? '#1F4381' : '#FFFFFF',
              boxShadow: `0 8px 32px ${accentShadow}`,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = `0 12px 40px ${accentHoverShadow}`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${accentShadow}`;
              }
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ 
                    borderColor: isDark ? '#1F4381' : '#FFFFFF',
                    borderTopColor: 'transparent',
                  }}
                />
                Signing in...
              </div>
            ) : (
              'Sign in to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}