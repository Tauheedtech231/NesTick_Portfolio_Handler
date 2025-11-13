// app/auth/sign_up/page.tsx
'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
}

interface UserData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  createdAt: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'India',
    'Brazil', 'Mexico', 'Spain', 'Italy', 'South Korea', 'China', 'Russia', 'South Africa',
    'United Arab Emirates', 'Saudi Arabia', 'Singapore', 'Malaysia', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); // Clear message when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, country } = formData;

    // Validation
    if (!fullName || !email || !password || !confirmPassword || !country) {
      setMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Check for existing email in localStorage
      const existing = typeof window !== 'undefined' ? localStorage.getItem('users') : null;
      const arr: UserData[] = existing ? JSON.parse(existing) : [];

      if (arr.find((u: UserData) => u.email.toLowerCase() === email.toLowerCase())) {
        setMessage('An account with this email already exists. Please login.');
        setIsLoading(false);
        return;
      }

      // Create new user object
      const newUser: UserData = {
        fullName,
        email,
        password, // Note: In production, never store plain passwords
        country,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      arr.push(newUser);
      localStorage.setItem('users', JSON.stringify(arr));

      // Send confirmation email via API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          country
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send confirmation email');
      }

      setMessage('Account created successfully! A confirmation email has been sent.');
      
      // Redirect to login after success
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Message popup component
  const MessagePopup = () => {
    if (!message) return null;

    const isError = message.includes('required') || 
                   message.includes('match') || 
                   message.includes('already exists') || 
                   message.includes('failed') ||
                   message.includes('characters');

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-300">
        <div className={cn(
          "rounded-lg px-4 py-3 shadow-lg border",
          isError 
            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isError ? "bg-red-500" : "bg-green-500"
            )}></div>
            <p className={cn(
              "text-sm font-medium",
              isError ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"
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
            Create Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign up to get started
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent",
                    "transition-all duration-200"
                  )}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Country Field */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent",
                    "transition-all duration-200 appearance-none cursor-pointer"
                  )}
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
                  placeholder="Enter password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent",
                    "transition-all duration-200"
                  )}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
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
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="font-semibold underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}