// app/designer/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Globe,
  Calendar,
  Save,
  Edit2,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    website: '',
    bio: '',
    specialization: '',
    experience: '',
    avatar: null as string | null,
    total_earnings: 0,
    total_designs: 0
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const auth = sessionStorage.getItem('designer_auth');
      if (!auth) return;
      
      const authData = JSON.parse(auth);
      const response = await fetch(`/api/designer/profile?designerId=${authData.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile({
          id: data.profile.id,
          name: data.profile.name || '',
          email: data.profile.email || '',
          phone: data.profile.phone || '',
          company: data.profile.company || '',
          location: data.profile.location || '',
          website: data.profile.website || '',
          bio: data.profile.bio || '',
          specialization: data.profile.specialization || '',
          experience: data.profile.experience || '',
          avatar: data.profile.avatar || null,
          total_earnings: data.profile.total_earnings || 0,
          total_designs: data.profile.total_designs || 0
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'lms_upload');
    formData.append('folder', 'designer-avatars');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dfp9qc0gu/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      
      // Update avatar in database
      const auth = sessionStorage.getItem('designer_auth');
      if (auth) {
        const authData = JSON.parse(auth);
        const updateResponse = await fetch('/api/designer/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            designerId: authData.user.id,
            avatar: data.secure_url
          })
        });
        
        if (updateResponse.ok) {
          setProfile(prev => ({ ...prev, avatar: data.secure_url }));
          setSuccess('Avatar updated successfully!');
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload avatar');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const auth = sessionStorage.getItem('designer_auth');
      if (!auth) return;
      
      const authData = JSON.parse(auth);
      const response = await fetch('/api/designer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designerId: authData.user.id,
          name: profile.name,
          phone: profile.phone,
          company: profile.company,
          location: profile.location,
          website: profile.website,
          bio: profile.bio,
          specialization: profile.specialization,
          experience: profile.experience
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update session storage
        authData.user.name = profile.name;
        authData.user.phone = profile.phone;
        sessionStorage.setItem('designer_auth', JSON.stringify(authData));
        
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Network error. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const errors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setChangingPassword(true);
    setPasswordErrors({});
    
    try {
      const auth = sessionStorage.getItem('designer_auth');
      if (!auth) return;
      
      const authData = JSON.parse(auth);
      const response = await fetch('/api/designer/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designerId: authData.user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPasswordSuccess(true);
        setTimeout(() => setPasswordSuccess(false), 3000);
        
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        setPasswordErrors({ currentPassword: data.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors({ currentPassword: 'Network error. Please try again.' });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        {/* Avatar */}
        <div className="relative px-6">
          <div className="relative -mt-12 inline-block">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name?.charAt(0) || 'D'}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera size={14} className="text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
         
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">${profile.total_earnings}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <p className="text-gray-900 dark:text-white">{profile.email}</p>
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.phone || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company/Studio</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.company || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.location || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              ) : (
                profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.website}
                  </a>
                ) : (
                  <p className="text-gray-500">Not specified</p>
                )
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
              {isEditing ? (
                <select
                  value={profile.specialization}
                  onChange={(e) => handleProfileChange('specialization', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="">Select specialization</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Portfolio Design">Portfolio Design</option>
                  <option value="Brand Identity">Brand Identity</option>
                </select>
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.specialization || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
              {isEditing ? (
                <select
                  value={profile.experience}
                  onChange={(e) => handleProfileChange('experience', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.experience || 'Not specified'}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{profile.bio || 'No bio added yet'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password</p>
            </div>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Lock size={16} /> Change Password
              </button>
            )}
          </div>
        </div>

        {showPasswordForm && (
          <div className="p-5 space-y-4">
            {passwordSuccess && (
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-sm text-green-700 dark:text-green-300">Password changed successfully!</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border ${
                    passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } text-gray-900 dark:text-white pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border ${
                    passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } text-gray-900 dark:text-white pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border ${
                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } text-gray-900 dark:text-white pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {changingPassword && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordErrors({});
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}