'use client';
import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Menu, X } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-500">
      {/* 🔹 Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 transition-all duration-300 ${
          isSidebarOpen
            ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90'
            : 'bg-white dark:bg-gray-900 text-black dark:text-white hover:opacity-90'
        }`}
      >
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 🔹 Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* 🔹 Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
        ></div>
      )}

      {/* 🔹 Main Content Area */}
      <div className="flex-1 flex flex-col transition-colors duration-500 md:ml-0">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-white dark:bg-black transition-colors duration-500 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
