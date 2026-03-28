'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1D4ED8]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#38BDF8]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1D4ED8]/5 rounded-full blur-3xl" />
      </div>

      <MessagePopup />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#1D4ED8]/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">Sign in to your Portfolio Handler account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
                    "block w-full pl-10 pr-3 py-3 border rounded-xl",
                    "bg-[#0F172A] border-[#1E293B] text-white",
                    "placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent",
                    "transition-all duration-200"
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
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
                    "block w-full pl-10 pr-12 py-3 border rounded-xl",
                    "bg-[#0F172A] border-[#1E293B] text-white",
                    "placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent",
                    "transition-all duration-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-[#38BDF8] transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-[#38BDF8] transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full flex justify-center py-3 px-4 border border-transparent rounded-xl",
              "text-sm font-medium text-white",
              "bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8]",
              "hover:scale-105 hover:shadow-lg hover:shadow-[#1D4ED8]/30",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19] focus:ring-[#38BDF8]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "transition-all duration-300"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </div>
            ) : 'Login'}
          </button>
        </form>

       
      </div>
    </div>
  );
}