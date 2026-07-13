/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/FooterSection.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube
} from 'react-icons/fi';

interface FooterSectionProps {
  college: College;
  templateId?: number;
}

interface Program {
  name: string;
  link: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  officeHours: string;
}

interface FooterFormData {
  logo: string;
  collegeName: string;
  tagline: string;
  description: string;
  programs: Program[];
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  accentColor: string;
  darkBgColor: string;
}

const defaultFormData: FooterFormData = {
  logo: '',
  collegeName: 'Nestick College',
  tagline: 'Empowering Minds. Shaping Futures.',
  description: 'Nestick College is committed to academic excellence, innovation, and holistic development. We provide quality education that empowers students to become leaders, critical thinkers, and responsible citizens.',
  programs: [
    { name: 'FSc Pre-Medical', link: '/programs/fsc-pre-medical' },
    { name: 'FSc Pre-Engineering', link: '/programs/fsc-pre-engineering' },
    { name: 'ICS', link: '/programs/ics' },
    { name: 'I.Com', link: '/programs/i-com' },
    { name: 'DAE', link: '/programs/dae' },
    { name: 'DIT', link: '/programs/dit' },
  ],
  contactInfo: {
    address: '123 Education Boulevard, Lahore',
    phone: '+92-42-111-222-333',
    email: 'info@nestickcollege.edu.pk',
    officeHours: 'Mon-Fri: 8:00 AM - 6:00 PM'
  },
  socialLinks: [
    { name: 'Facebook', url: 'https://facebook.com/nestickcollege', icon: 'facebook' },
    { name: 'Twitter', url: 'https://twitter.com/nestickcollege', icon: 'twitter' },
    { name: 'Instagram', url: 'https://instagram.com/nestickcollege', icon: 'instagram' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/nestickcollege', icon: 'linkedin' },
    { name: 'YouTube', url: 'https://youtube.com/nestickcollege', icon: 'youtube' },
  ],
  accentColor: '#0D9488',
  darkBgColor: '#0a0e1a'
};



export function FooterSection({ college, templateId }: FooterSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<FooterFormData>(defaultFormData);
  const [lastUpdated, setLastUpdated] = useState('');

  const getActiveTemplateId = () => {
    return templateId || (college as any).template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt((college as any).id);
  };

  // ✅ Load from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Footer&college_id=${collegeId}&_=${timestamp}`;
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          setLastUpdated(data.sections[0].updated_at);
          
          if (dbContent && Object.keys(dbContent).length > 0) {
            setFormData({
              ...defaultFormData,
              ...dbContent,
              programs: dbContent.programs || defaultFormData.programs,
              contactInfo: dbContent.contactInfo || defaultFormData.contactInfo,
              socialLinks: dbContent.socialLinks || defaultFormData.socialLinks
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load footer data:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [templateId, college.template_id, college.id]);

  // ✅ Save to database
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: activeTemplateId,
          section_name: "Footer",
          college_id: collegeId,
          content: formData
        })
      });
      
      if (response.ok) {
        setShowSuccessPopup(true);
        setIsEditing(false);
        await loadFromDatabase(false);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Program handlers
  const addProgram = () => {
    setFormData(prev => ({
      ...prev,
      programs: [...prev.programs, { name: 'New Program', link: '/programs/new' }]
    }));
  };

  const updateProgram = (index: number, field: string, value: string) => {
    const newPrograms = [...formData.programs];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    setFormData(prev => ({ ...prev, programs: newPrograms }));
  };

  const removeProgram = (index: number) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index)
    }));
  };

  // ✅ Social link handlers
  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: 'New Social', url: '#', icon: 'facebook' }]
    }));
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: newLinks }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleLogoChange = (fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      setFormData(prev => ({ ...prev, logo: fileOrString }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(fileOrString);
  };

  useEffect(() => {
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading footer section data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <FiCheck className="w-5 h-5" />
            <div>
              <p className="font-medium">Footer Saved Successfully!</p>
              <p className="text-sm text-green-100">Footer data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Footer Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage footer content</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => loadFromDatabase(true)}>
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Footer
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <FiX className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                  <FiSave className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save All Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Modify footer content. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Brand Info */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Brand Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College Name</label>
              <input
                type="text"
                value={formData.collegeName}
                onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo</label>
              <UploadImage
                value={formData.logo}
                onChange={handleLogoChange}
                onRemove={() => handleLogoChange('')}
                aspectRatio="square"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Programs */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Programs</h3>
            {isEditing && (
              <Button size="sm" onClick={addProgram} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Program
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {formData.programs.map((program, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) => updateProgram(index, 'name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Program Name"
                  className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
                <input
                  type="text"
                  value={program.link}
                  onChange={(e) => updateProgram(index, 'link', e.target.value)}
                  disabled={!isEditing}
                  placeholder="/programs/..."
                  className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
                {isEditing && (
                  <Button variant="ghost" size="sm" onClick={() => removeProgram(index)} className="text-red-500">
                    <FiTrash2 />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input
                type="text"
                value={formData.contactInfo.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, address: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Office Hours</label>
              <input
                type="text"
                value={formData.contactInfo.officeHours}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, officeHours: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h3>
            {isEditing && (
              <Button size="sm" onClick={addSocialLink} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Social
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Facebook"
                  className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
                <select
                  value={link.icon}
                  onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                  disabled={!isEditing}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
                {isEditing && (
                  <Button variant="ghost" size="sm" onClick={() => removeSocialLink(index)} className="text-red-500">
                    <FiTrash2 />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Accent Color</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                  disabled={!isEditing}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dark Background Color</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.darkBgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, darkBgColor: e.target.value }))}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
                <input
                  type="color"
                  value={formData.darkBgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, darkBgColor: e.target.value }))}
                  disabled={!isEditing}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterSection;