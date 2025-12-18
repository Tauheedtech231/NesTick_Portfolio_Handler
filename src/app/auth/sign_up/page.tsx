'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User,  } from 'lucide-react';
import { cn } from '@/lib/utils';
/* eslint-disable */

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia',
    'Germany', 'France', 'Japan', 'India', 'Brazil', 'Mexico',
    'Spain', 'Italy', 'South Korea', 'China', 'Russia',
    'South Africa', 'United Arab Emirates', 'Saudi Arabia',
    'Singapore', 'Malaysia', 'Pakistan', 'Bangladesh',
    'Sri Lanka', 'Nepal',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword, country } = formData;

    // Frontend validation (UX only)
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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          country,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setMessage(
        'Account created successfully. Please check your email.'
      );

      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= MESSAGE POPUP ================= */
  const MessagePopup = () => {
    if (!message) return null;

    const isError =
      message.toLowerCase().includes('required') ||
      message.toLowerCase().includes('match') ||
      message.toLowerCase().includes('exists') ||
      message.toLowerCase().includes('failed');

    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div
          className={cn(
            'rounded-lg px-4 py-3 shadow-lg border',
            isError
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          )}
        >
          {message}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <Input
            label="Full Name"
            icon={<User className="h-5 w-5 text-gray-400" />}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          {/* Email */}
          <Input
            label="Email Address"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="">Select country</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            show={showPassword}
            setShow={setShowPassword}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gray-900 text-white disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <a href="/auth/login" className="underline font-semibold">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ================= REUSABLE INPUT ================= */
function Input({ label, icon, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-3">{icon}</div>
        <input
          {...props}
          className="w-full pl-10 py-3 rounded-xl border"
        />
      </div>
    </div>
  );
}

function PasswordInput({ label, show, setShow, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className="w-full px-4 py-3 rounded-xl border"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-3"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
