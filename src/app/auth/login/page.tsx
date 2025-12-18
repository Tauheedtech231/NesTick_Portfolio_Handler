'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
/* eslint-disable */

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); // Clear message when user starts typing
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { email, password } = formData;
    
    // Basic validation
    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    setMessage('');
    setIsLoading(true);

    try {
      // Call the API for user login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // ✅ Login success - store user data
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.full_name,
        country: data.user.country,
        type: 'user',
        loginTime: new Date().toISOString()
      };
      
      // Store in localStorage for session management
      localStorage.setItem('login_user', JSON.stringify(userData));
      
      // Show success message
      setMessage('Login successful! Redirecting...');
      
      // Redirect to homepage after 1 second
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  }

  // Message popup component - FIXED VERSION
  const MessagePopup = () => {
    if (!message) return null;

    // Fixed the condition - using logical OR (||) instead of comparison operators
    const isError = message.includes('Invalid') || 
                   message.includes('No account') || 
                   message.includes('failed') ||
                   message.includes('verify') ||
                   message.includes('required') ||
                   message.includes('error') ||
                   message.includes('connection');
    
    const isSuccess = message.includes('successful');

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-300">
        <div className={cn(
          "rounded-lg px-4 py-3 shadow-lg border",
          isError 
            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            : isSuccess
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isError ? "bg-red-500" : isSuccess ? "bg-green-500" : "bg-blue-500"
            )}></div>
            <p className={cn(
              "text-sm font-medium",
              isError ? "text-red-700 dark:text-red-300" : 
              isSuccess ? "text-green-700 dark:text-green-300" : 
              "text-blue-700 dark:text-blue-300"
            )}>
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <MessagePopup />
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-white dark:text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Login
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent",
                    "transition-all duration-200"
                  )}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent",
                    "transition-all duration-200"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full flex justify-center py-3 px-4 border border-transparent rounded-xl",
              "text-sm font-medium text-white dark:text-gray-900",
              "bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              'Login'
            )}
          </button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <a
                href="/auth/sign_up"
                className="font-semibold underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}