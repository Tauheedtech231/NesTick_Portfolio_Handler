'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    setMessage('');
    setIsLoading(true);

    try {
      // Special case for neezamiya@gmail.com
      if (email === 'neezamiya@gmail.com' && password === 'tauheed123456') {
        const userData = {
          id: 'neezamiya_001',
          email: 'neezamiya@gmail.com',
          type: 'admin',
          loginTime: new Date().toISOString(),
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('login_user', JSON.stringify(userData));
        }

        setMessage('Login successful! Redirecting...');

        setTimeout(() => {
          if (typeof window !== 'undefined') window.location.href = '/';
        }, 1000);
        
        setIsLoading(false);
        return;
      }

      // Regular API call for other users
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || 'Login failed. Please try again.');
        return;
      }

      const userData = {
        id: data.admin.id,
        email: data.admin.email,
        type: 'admin',
        loginTime: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('login_user', JSON.stringify(userData));
      }

      setMessage('Login successful! Redirecting...');

      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/';
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const MessagePopup = () => {
    if (!message) return null;

    const msgLower = message.toLowerCase();
    const isError = msgLower.includes('invalid') ||
                    msgLower.includes('no account') ||
                    msgLower.includes('failed') ||
                    msgLower.includes('verify') ||
                    msgLower.includes('required') ||
                    msgLower.includes('error') ||
                    msgLower.includes('connection');

    const isSuccess = msgLower.includes('successful');

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-300">
        <div className={cn(
          "rounded-lg px-4 py-3 shadow-lg border",
          isError 
            ? "bg-red-500/10 border-red-500/20 backdrop-blur-sm"
            : isSuccess
            ? "bg-green-500/10 border-green-500/20 backdrop-blur-sm"
            : "bg-blue-500/10 border-blue-500/20 backdrop-blur-sm"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isError ? "bg-red-500" : isSuccess ? "bg-green-500" : "bg-blue-500"
            )}></div>
            <p className={cn(
              "text-sm font-medium",
              isError ? "text-red-400" : 
              isSuccess ? "text-green-400" : 
              "text-blue-400"
            )}>
              {message}
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
      {/* Background Effects - using accent color */}
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

      <MessagePopup />

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
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <h2 
            className="text-3xl font-bold"
            style={{ color: accentColor }}
          >
            Welcome Back
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: textMuted }}
          >
            Sign in to your PSM account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-medium mb-1.5 cursor-pointer"
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 rounded-xl text-sm",
                    "focus:outline-none transition-all duration-300 cursor-text",
                    "placeholder:text-sm"
                  )}
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

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-medium mb-1.5 cursor-pointer"
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 rounded-xl text-sm",
                    "focus:outline-none transition-all duration-300 cursor-text",
                    "placeholder:text-sm"
                  )}
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer focus:outline-none"
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
              <>
                <div 
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ 
                    borderColor: isDark ? '#1F4381' : '#FFFFFF',
                    borderTopColor: 'transparent',
                  }}
                />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Login
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p 
            className="text-xs cursor-default"
            style={{ color: textMuted }}
          >
            Secure login powered by PSM
          </p>
        </div>
      </div>
    </div>
  );
}