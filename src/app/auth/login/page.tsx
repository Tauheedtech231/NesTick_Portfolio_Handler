'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Building2, Crown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
/* eslint-disable */

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  const ADMIN_TEST_EMAIL = 'imransir@gmail.com';
  const ADMIN_TEST_PASSWORD = '123456';
  const CONTACT_WEBSITE = 'https://nesticktech.com';
  const CONTACT_PHONE = '+92 319 3236529';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); // Clear message when user starts typing
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { email, password } = formData;
    setMessage('');
    setIsLoading(true);

    // 🔹 Admin Test Login (Hardcoded credentials)
    if (email === ADMIN_TEST_EMAIL && password === ADMIN_TEST_PASSWORD) {
      const adminData = { 
        email, 
        name: 'Super Admin', 
        type: 'super_admin',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('superAdminTest', JSON.stringify(adminData));
      localStorage.setItem('login_user', JSON.stringify(adminData));
      
      setTimeout(() => {
        window.location.href = '/Portfolio_Handler';
      }, 500);
      return;
    }

    // 🔹 Check regular users first (from signup)
    const usersStored = localStorage.getItem('users');
    if (usersStored) {
      const users = JSON.parse(usersStored);
      const existingUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (existingUser) {
        // ✅ Regular user login success
        const userData = {
          email: existingUser.email,
          name: existingUser.fullName,
          country: existingUser.country,
          type: 'user',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('login_user', JSON.stringify(userData));
        
        setIsLoading(false);
        setMessage('Login successful! Redirecting...');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        return;
      }
    }

    // 🔹 Check college admins (existing functionality)
    const collegeAdminsStored = localStorage.getItem('collegeAdmins');
    if (collegeAdminsStored) {
      const collegeAdmins = JSON.parse(collegeAdminsStored);

      const existingCollegeAdmin = collegeAdmins.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingCollegeAdmin) {
        // 🔹 Check if password matches
        if (existingCollegeAdmin.password !== password) {
          setMessage('Invalid password. Please try again.');
          setIsLoading(false);
          return;
        }

        // ✅ College admin login success
        const adminData = {
          email: existingCollegeAdmin.email,
          collegeName: existingCollegeAdmin.collegeName,
          adminName: existingCollegeAdmin.adminName,
          type: 'college_admin',
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('loggedInCollege', JSON.stringify(adminData));
        localStorage.setItem('login_user', JSON.stringify(adminData));

        setIsLoading(false);
        setShowContactModal(true);
        return;
      }
    }

    // 🔹 If no user found in any storage
    setMessage('No account found with these credentials. Please sign up first.');
    setIsLoading(false);
  }

  function handleModalOk() {
    setShowContactModal(false);
    setTimeout(() => {
      window.location.href = '/'; // Redirect to homepage
    }, 300);
  }

  // Message popup component
  const MessagePopup = () => {
    if (!message) return null;

    const isError = message.includes('Invalid') || 
                   message.includes('No account') || 
                   message.includes('failed');
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

          {/* Demo Credentials Hint */}
          <div className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Demo Admin: imransir@gmail.com / 123456
            </p>
          </div>
        </form>
      </div>

      {/* Contact Modal - Only for College Admins */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowContactModal(false)}
          ></div>

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-11/12 max-w-lg border border-gray-200 dark:border-gray-700 shadow-xl transform transition-all duration-300 scale-100">
            <div className="text-center mb-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to Admin Portal!
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-center">
              Our team will contact you soon to complete your setup.
              <br />
              Feel free to reach out if you have any questions!
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                  <a
                    href={CONTACT_WEBSITE}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:underline"
                  >
                    {CONTACT_WEBSITE.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {CONTACT_PHONE}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                  "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                Close
              </button>
              <button
                onClick={handleModalOk}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                  "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900",
                  "hover:bg-gray-800 dark:hover:bg-gray-200"
                )}
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}