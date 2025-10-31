'use client';
import { useState } from 'react';
/* eslint-disable */
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  const ADMIN_TEST_EMAIL = 'imransir@gmail.com';
  const ADMIN_TEST_PASSWORD = '123456';
  const CONTACT_WEBSITE = 'https://nesticktech.com';
  const CONTACT_PHONE = '+92 319 3236529';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { email, password } = formData;
    setMessage('');

    // 🔹 Admin Test Login
    if (email === ADMIN_TEST_EMAIL && password === ADMIN_TEST_PASSWORD) {
      localStorage.setItem('superAdminTest', JSON.stringify({ email, name: 'Super Admin' }));
      window.location.href = '/Portfolio_Handler';
      return;
    }

    // 🔹 Check if collegeAdmins exist
    const stored = localStorage.getItem('collegeAdmins');
    if (!stored) {
      setMessage('❌ No college accounts found. Please sign up first.');
      return;
    }

    const arr = JSON.parse(stored);

    // 🔹 Check if email exists
    const existingUser = arr.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!existingUser) {
      setMessage('⚠️ No account found for this email. Please sign up first.');
      return;
    }

    // 🔹 Check if password matches
    if (existingUser.password !== password) {
      setMessage('❌ Invalid password. Please try again.');
      return;
    }

    // ✅ Login success
    localStorage.setItem(
      'loggedInCollege',
      JSON.stringify({
        email: existingUser.email,
        collegeName: existingUser.collegeName,
        adminName: existingUser.adminName,
      })
    );

    setShowContactModal(true);
  }

  function handleModalOk() {
    setShowContactModal(false);
    window.location.href = '/'; // Redirect to homepage
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-6">
          College Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Official Email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />

          <button
            type="submit"
            className="w-full bg-black text-white dark:bg-white dark:text-black py-2.5 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
          >
            Login
          </button>

          {message && (
            <p className="text-center text-sm mt-3 text-gray-700 dark:text-gray-300">
              {message}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don’t have an account?{' '}
          <a
            href="/auth/sign_up"
            className="font-semibold underline hover:text-black dark:hover:text-white"
          >
            Sign Up
          </a>
        </p>
      </div>

      {/* 🌟 Cool English Popup */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowContactModal(false)}
          ></div>

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-11/12 max-w-lg border border-gray-200 dark:border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-black dark:text-white mb-3">
              🎉 Thank you for logging in!
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Our team will contact you soon.
              <br />
              <br />
              If you have any questions, feel free to reach out to us anytime!
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <span className="font-semibold">🌐 Website:</span>{' '}
                <a
                  href={CONTACT_WEBSITE}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {CONTACT_WEBSITE.replace(/^https?:\/\//, '')}
                </a>
              </p>
              <p className="text-sm">
                <span className="font-semibold">📞 Phone:</span> {CONTACT_PHONE}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleModalOk}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
