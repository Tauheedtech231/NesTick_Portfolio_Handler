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
  const router = useRouter();

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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <ErrorPopup />
      
      <div className="max-w-md w-full space-y-8">
        {/* Header with Real Logo */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden shadow-lg mb-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <Image
              src="/logo.jpg"
              alt="Neezamiya Logo"
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            College Portal
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent",
                    "transition-all duration-200 cursor-text"
                  )}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent",
                    "transition-all duration-200 cursor-text"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:scale-110 transition-transform duration-200"
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
              "transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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