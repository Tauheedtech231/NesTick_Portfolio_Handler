'use client';

import React, { useState } from 'react';
import { ContactInfo, College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button'; 
import { 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiGlobe, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin, 
  FiInstagram,
  FiExternalLink,
  FiCopy
} from 'react-icons/fi';
import { validateEmail, validateUrl } from '@/lib/utils';
/* eslint-disable */

interface ContactSectionProps {
  data: any;
  college: College;
  onUpdate: (data: any) => void;
}

export function ContactSection({ data, college, onUpdate }: ContactSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(data ?? college.contact);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copySuccess, setCopySuccess] = useState(false);

  const updateContact = (patch: Partial<ContactInfo>) => {
    const next: ContactInfo = {
      ...contactInfo,
      ...patch,
    };
    setContactInfo(next);
    onUpdate(next);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!contactInfo.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!contactInfo.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (contactInfo.website && !validateUrl(contactInfo.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (contactInfo.socialMedia?.facebook && !validateUrl(contactInfo.socialMedia.facebook)) {
      newErrors.facebook = 'Please enter a valid URL';
    }

    if (contactInfo.socialMedia?.twitter && !validateUrl(contactInfo.socialMedia.twitter)) {
      newErrors.twitter = 'Please enter a valid URL';
    }

    if (contactInfo.socialMedia?.linkedin && !validateUrl(contactInfo.socialMedia.linkedin)) {
      newErrors.linkedin = 'Please enter a valid URL';
    }

    if (contactInfo.socialMedia?.instagram && !validateUrl(contactInfo.socialMedia.instagram)) {
      newErrors.instagram = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveChanges = () => {
    if (validateForm()) {
      onUpdate(contactInfo);
      setIsEditing(false);
      setErrors({});
    }
  };

  const cancelEditing = () => {
    const original = data ?? college.contact;
    setContactInfo(original);
    onUpdate(original);
    setIsEditing(false);
    setErrors({});
  };

  const updateContactField = (field: keyof ContactInfo, value: string) => {
    updateContact({ [field]: value } as Partial<ContactInfo>);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateSocialMedia = (platform: string, value: string) => {
    const nextSocial = {
      ...(contactInfo.socialMedia || {}),
      [platform]: value,
    };
    updateContact({ socialMedia: nextSocial } as Partial<ContactInfo>);
    if (errors[platform]) {
      setErrors(prev => ({ ...prev, [platform]: '' }));
    }
  };

  const handleCopyContactInfo = () => {
    const contactText = `Email: ${contactInfo.email}\nPhone: ${contactInfo.phone}\nAddress: ${contactInfo.address}${contactInfo.website ? `\nWebsite: ${contactInfo.website}` : ''}`;
    navigator.clipboard.writeText(contactText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const socialMediaPlatforms = [
    { 
      key: 'facebook', 
      icon: FiFacebook, 
      label: 'Facebook', 
      color: 'text-blue-600 dark:text-blue-400',
      placeholder: 'https://facebook.com/your-college' 
    },
    { 
      key: 'twitter', 
      icon: FiTwitter, 
      label: 'Twitter', 
      color: 'text-sky-500 dark:text-sky-400',
      placeholder: 'https://twitter.com/your-college' 
    },
    { 
      key: 'linkedin', 
      icon: FiLinkedin, 
      label: 'LinkedIn', 
      color: 'text-blue-700 dark:text-blue-300',
      placeholder: 'https://linkedin.com/school/your-college' 
    },
    { 
      key: 'instagram', 
      icon: FiInstagram, 
      label: 'Instagram', 
      color: 'text-pink-600 dark:text-pink-400',
      placeholder: 'https://instagram.com/your-college' 
    },
  ];

  const hasSocialMedia = contactInfo.socialMedia && 
    Object.values(contactInfo.socialMedia).some(val => val && val.trim() !== '');

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage college contact details and social media links
          </p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <FiEdit2 className="w-4 h-4 mr-2" />
            Edit Contact Info
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={cancelEditing}
              className="w-full sm:w-auto"
            >
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={saveChanges}
              className="w-full sm:w-auto"
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Contact Information */}
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Contact Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Primary contact details for your college
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  <FiMail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => updateContactField('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.email 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="contact@college.edu"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <FiMail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{contactInfo.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  <FiPhone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => updateContactField('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.phone 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{contactInfo.phone}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  <FiMapPin className="w-4 h-4 inline mr-2" />
                  Address *
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      value={contactInfo.address}
                      onChange={(e) => updateContactField('address', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                        errors.address 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="123 College Avenue, City, State 12345"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-900 dark:text-white leading-relaxed">{contactInfo.address}</span>
                  </div>
                )}
              </div>

              {/* Website */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  <FiGlobe className="w-4 h-4 inline mr-2" />
                  Website
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="url"
                      value={contactInfo.website || ''}
                      onChange={(e) => updateContactField('website', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.website 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="https://college.edu"
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>
                    )}
                  </div>
                ) : (
                  contactInfo.website && (
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <FiGlobe className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {contactInfo.website.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                      <a 
                        href={contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiGlobe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Social Media Links
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect with your audience on social platforms
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {socialMediaPlatforms.map(({ key, icon: Icon, label, color, placeholder }) => (
                <div key={key} className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                    <Icon className={`w-4 h-4 inline mr-2 ${color}`} />
                    {label}
                  </label>
                  {isEditing ? (
                    <div>
                      <div className="flex gap-2">
                        <div className="flex items-center px-4 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-xl bg-gray-50 dark:bg-gray-700">
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <input
                          type="url"
                          value={contactInfo.socialMedia?.[key as keyof typeof contactInfo.socialMedia] || ''}
                          onChange={(e) => updateSocialMedia(key, e.target.value)}
                          className={`flex-1 px-4 py-3 border rounded-r-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors[key] 
                              ? 'border-red-500 dark:border-red-400 border-l-0' 
                              : 'border-gray-300 dark:border-gray-600 border-l-0'
                          }`}
                          placeholder={placeholder}
                        />
                      </div>
                      {errors[key] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[key]}</p>
                      )}
                    </div>
                  ) : (
                    contactInfo.socialMedia?.[key as keyof typeof contactInfo.socialMedia] && (
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${color}`} />
                          <span className="text-gray-900 dark:text-white">
                            {contactInfo.socialMedia[key as keyof typeof contactInfo.socialMedia]?.replace(/^https?:\/\//, '')}
                          </span>
                        </div>
                        <a 
                          href={contactInfo.socialMedia[key as keyof typeof contactInfo.socialMedia]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>

            {!isEditing && !hasSocialMedia && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl mt-4">
                <FiGlobe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  No social media links added yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Add your social media profiles to help visitors connect with your college
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {!isEditing && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Make your contact information easily accessible
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleCopyContactInfo}
                className="flex items-center gap-2"
              >
                <FiCopy className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Copy Contact Info'}
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 className="w-4 h-4 mr-2" />
                Edit Contact Info
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}