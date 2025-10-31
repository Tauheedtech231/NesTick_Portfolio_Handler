'use client';
import { useState } from 'react';
/* eslint-disable */
export default function SignUpPage() {
  const [formData, setFormData] = useState({
    collegeName: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { collegeName, adminName, email, password, confirmPassword } = formData;

    if (!collegeName || !adminName || !email || !password || !confirmPassword) {
      setMessage('⚠️ All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    // read existing array or create new
    const existing = typeof window !== 'undefined' ? localStorage.getItem('collegeAdmins') : null;
    const  arr = existing ? JSON.parse(existing) : [];

    // prevent duplicate email
    if (arr.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      setMessage('❌ An account with this email already exists. Please login.');
      return;
    }

    const newUser = {
      collegeName,
      adminName,
      email,
      password, // NOTE: localStorage only for testing — don't use plain passwords in prod
      createdAt: new Date().toISOString()
    };

    arr.push(newUser);
    localStorage.setItem('collegeAdmins', JSON.stringify(arr));

    setMessage(' Sign up successful! Redirecting to login...');
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-6">College Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="collegeName" value={formData.collegeName} onChange={handleChange}
            placeholder="College Name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />

          <input name="adminName" value={formData.adminName} onChange={handleChange}
            placeholder="Admin Name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />

          <input name="email" value={formData.email} onChange={handleChange} type="email"
            placeholder="Official Email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />

          <input name="password" value={formData.password} onChange={handleChange} type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />

          <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />

          <button type="submit"
            className="w-full bg-black text-white dark:bg-white dark:text-black py-2.5 rounded-lg font-semibold hover:scale-105 transition-all duration-300">
            Sign Up
          </button>

          {message && <p className="text-center text-sm mt-3 text-gray-700 dark:text-gray-300">{message}</p>}
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <a href="/auth/login" className="font-semibold underline hover:text-black dark:hover:text-white">Login</a>
        </p>
      </div>
    </div>
  );
}
