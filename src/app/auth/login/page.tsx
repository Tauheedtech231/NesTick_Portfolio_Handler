'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <MessagePopup />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with Real Logo */}
        <div className="text-center">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-[#FFD700] rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg shadow-[#FFD700]/30 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image
                src="/logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            Sign in to your Portfolio Handler account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5 cursor-pointer">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
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
                    "block w-full pl-10 pr-3 py-3 rounded-xl",
                    "bg-[#0F172A] border border-[#1E293B] text-white",
                    "placeholder:text-gray-600 text-sm",
                    "focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]",
                    "transition-all duration-300 cursor-text"
                  )}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1.5 cursor-pointer">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
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
                    "block w-full pl-10 pr-12 py-3 rounded-xl",
                    "bg-[#0F172A] border border-[#1E293B] text-white",
                    "placeholder:text-gray-600 text-sm",
                    "focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]",
                    "transition-all duration-300 cursor-text"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:scale-110 transition-transform duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-[#FFD700] transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-[#FFD700] transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl",
              "text-sm font-semibold text-black",
              "bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90",
              "shadow-lg shadow-[#FFD700]/30",
              "hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/40",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19] focus:ring-[#FFD700]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "transition-all duration-300 cursor-pointer"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
          <p className="text-xs text-gray-600 cursor-default">
            Secure login powered by Portfolio Handler
          </p>
        </div>
      </div>
    </div>
  );
}