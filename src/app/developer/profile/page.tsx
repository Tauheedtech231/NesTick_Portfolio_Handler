// app/developer/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award,
  Code2,
  Save,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface DeveloperProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  specialization: string;
  experience: string;
  skills: string[];
  portfolio: string;
  bio: string;
  location: string;
  bank_account_details: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const getDeveloperId = (): string | null => {
    const auth = sessionStorage.getItem('developer_auth');
    if (!auth) return null;
    try {
      const parsed = JSON.parse(auth);
      return parsed?.user?.id ? parsed.user.id.toString() : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        router.push('/designer/login?type=developer');
        return;
      }

      const response = await fetch(`/api/developer/profile?developerId=${developerId}`);
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        router.push('/developer');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setProfile(prev => prev ? { ...prev, skills } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const developerId = getDeveloperId();
    if (!developerId) {
      setError('Developer session expired, please log in again.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/developer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, developerId })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        setError('Developer session expired, please log in again.');
        return;
      }

      const response = await fetch('/api/developer/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, developerId })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Password changed successfully!');
        setShowPasswordForm(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleProfileChange}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleProfileChange}
                    placeholder="City, Country"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="company_name"
                    value={profile.company_name || ''}
                    onChange={handleProfileChange}
                    placeholder="Your company/agency name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                <select
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="WordPress Developer">WordPress Developer</option>
                  <option value="Shopify Developer">Shopify Developer</option>
                  <option value="React/Next.js Specialist">React/Next.js Specialist</option>
                  <option value="UI/UX Developer">UI/UX Developer</option>
                  <option value="Mobile App Developer">Mobile App Developer</option>
                  <option value="E-commerce Developer">E-commerce Developer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</label>
                <select
                  name="experience"
                  value={profile.experience}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="Fresher (0-1 years)">Fresher (0-1 years)</option>
                  <option value="Junior (1-3 years)">Junior (1-3 years)</option>
                  <option value="Intermediate (3-5 years)">Intermediate (3-5 years)</option>
                  <option value="Senior (5-8 years)">Senior (5-8 years)</option>
                  <option value="Expert (8+ years)">Expert (8+ years)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills (comma separated)</label>
                <div className="relative">
                  <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={profile.skills.join(', ')}
                    onChange={handleSkillsChange}
                    placeholder="React, Node.js, Python, etc."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio/GitHub URL</label>
              <input
                type="url"
                name="portfolio"
                value={profile.portfolio || ''}
                onChange={handleProfileChange}
                placeholder="https://github.com/yourusername"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={profile.bio || ''}
                onChange={handleProfileChange}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank Account Details (For Payments)</label>
              <textarea
                name="bank_account_details"
                value={profile.bank_account_details || ''}
                onChange={handleProfileChange}
                rows={2}
                placeholder="Bank name, Account holder name, Account number, IBAN"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Right Side - Password Change */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full py-2.5 rounded-lg border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {error && (
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-xs">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setError('');
                    }}
                    className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex-1 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all disabled:opacity-50"
                  >
                    {changingPassword ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}