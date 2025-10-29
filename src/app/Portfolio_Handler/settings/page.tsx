// app/settings/page.tsx
'use client';
import { MainLayout } from '../components/layout/main-layout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { Moon, Sun, Palette, RefreshCw } from 'lucide-react';
/* eslint-disable */
export default function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: false,
    accentColor: 'blue' as 'blue' | 'purple' | 'green',
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setSettings(parsed);
      applyTheme(parsed);
    } else {
      applyTheme(settings);
    }
  }, []);

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
    applyTheme(newSettings);
  };

  const applyTheme = (themeSettings: typeof settings) => {
    // Apply Tailwind's dark mode class
    if (themeSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Set accent color via CSS variable
    const root = document.documentElement;
    root.style.setProperty('--color-accent', getAccentColor(themeSettings.accentColor));
  };

  const getAccentColor = (color: string) => {
    switch (color) {
      case 'blue': return '#3B82F6';
      case 'purple': return '#8B5CF6';
      case 'green': return '#10B981';
      default: return '#3B82F6';
    }
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    saveSettings({ ...settings, darkMode: enabled });
  };

  const handleAccentColorChange = (color: 'blue' | 'purple' | 'green') => {
    saveSettings({ ...settings, accentColor: color });
  };

  const resetPreferences = () => {
    if (confirm('Are you sure you want to reset all preferences to default?')) {
      const defaultSettings = { darkMode: false, accentColor: 'blue' as const };
      saveSettings(defaultSettings);
    }
  };

  const accentColors = [
    { value: 'blue', name: 'Blue', class: 'bg-blue-500' },
    { value: 'purple', name: 'Purple', class: 'bg-purple-500' },
    { value: 'green', name: 'Green', class: 'bg-green-500' },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Settings</h1>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-500">
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Appearance</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Customize the look and feel of the portal
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {settings.darkMode ? (
                    <Moon className="text-gray-200" size={24} />
                  ) : (
                    <Sun className="text-yellow-500" size={24} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Dark Mode</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={settings.darkMode} onChange={handleDarkModeToggle} />
            </div>

            {/* Accent Color Selection */}
         
          </div>
        </div>

        {/* Reset Preferences */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <RefreshCw className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Reset Preferences</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Reset all settings to their default values
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetPreferences}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset Settings
            </motion.button>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
