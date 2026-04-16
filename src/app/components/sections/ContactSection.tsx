'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
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
  FiCopy,
  FiClock,
  FiCalendar,
  FiMap,
  FiMessageSquare,
  FiCheck,
  FiRefreshCw
} from 'react-icons/fi';
import { validateEmail, validateUrl } from '@/lib/utils';

/* eslint-disable */

interface ContactSectionProps {
  college: College;
  templateId?: number;
}

interface WorkingHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

interface ContactNumbers {
  phone: string;
  whatsapp: string;
  office: string;
}

interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  website: string;
  mapLink: string;
  appointmentLink: string;
  socialMedia: SocialMedia;
  workingHours: WorkingHours;
  contactNumbers: ContactNumbers;
}

const defaultContactInfo: ContactInfo = {
  email: '',
  phone: '',
  address: '',
  website: '',
  mapLink: '',
  appointmentLink: '',
  socialMedia: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  },
  workingHours: {
    weekdays: '9:00 AM - 6:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed'
  },
  contactNumbers: {
    phone: '',
    whatsapp: '',
    office: ''
  }
};

export function ContactSection({ college, templateId }: ContactSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getActiveTemplateId = () => {
    return templateId || college.template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt(college.id);
  };

  // Load contact data from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Contact&college_id=${collegeId}&_=${timestamp}`;
      
      console.log('🔄 [Contact] Fetching contact data from:', url);
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          const updatedAt = data.sections[0].updated_at;
          
          setLastUpdated(updatedAt);
          
          if (dbContent) {
            setContactInfo({
              email: dbContent.email || defaultContactInfo.email,
              phone: dbContent.phone || defaultContactInfo.phone,
              address: dbContent.address || defaultContactInfo.address,
              website: dbContent.website || defaultContactInfo.website,
              mapLink: dbContent.mapLink || defaultContactInfo.mapLink,
              appointmentLink: dbContent.appointmentLink || defaultContactInfo.appointmentLink,
              socialMedia: {
                facebook: dbContent.socialMedia?.facebook || '',
                twitter: dbContent.socialMedia?.twitter || '',
                linkedin: dbContent.socialMedia?.linkedin || '',
                instagram: dbContent.socialMedia?.instagram || ''
              },
              workingHours: {
                weekdays: dbContent.workingHours?.weekdays || defaultContactInfo.workingHours.weekdays,
                saturday: dbContent.workingHours?.saturday || defaultContactInfo.workingHours.saturday,
                sunday: dbContent.workingHours?.sunday || defaultContactInfo.workingHours.sunday
              },
              contactNumbers: {
                phone: dbContent.contactNumbers?.phone || '',
                whatsapp: dbContent.contactNumbers?.whatsapp || '',
                office: dbContent.contactNumbers?.office || ''
              }
            });
            console.log('✅ [Contact] Loaded contact data');
          }
        }
      }
    } catch (error) {
      console.error('❌ [Contact] Failed to load:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [templateId, college.template_id, college.id]);

  useEffect(() => {
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  // Save to database
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
          section_name: "Contact",
          college_id: collegeId,
          content: contactInfo
        })
      });
      
      if (response.ok) {
        setShowSuccessPopup(true);
        setIsEditing(false);
        await loadFromDatabase(false);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        const error = await response.json();
        alert('Failed to save: ' + (error.error || error.message));
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!contactInfo.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (contactInfo.website && !validateUrl(contactInfo.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    const hasContactNumber = contactInfo.contactNumbers.phone || 
                             contactInfo.contactNumbers.whatsapp || 
                             contactInfo.contactNumbers.office;
    
    if (!hasContactNumber) {
      newErrors.contactNumbers = 'At least one contact number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCopyContactInfo = () => {
    const contactText = `
Contact Information:
📧 Email: ${contactInfo.email}
📍 Address: ${contactInfo.address}
📞 Phone: ${contactInfo.contactNumbers.phone || 'N/A'}
📱 WhatsApp: ${contactInfo.contactNumbers.whatsapp || 'N/A'}
🏢 Office: ${contactInfo.contactNumbers.office || 'N/A'}
🌐 Website: ${contactInfo.website || 'N/A'}

Working Hours:
🕒 Weekdays: ${contactInfo.workingHours.weekdays}
🕒 Saturday: ${contactInfo.workingHours.saturday}
🕒 Sunday: ${contactInfo.workingHours.sunday}
    `.trim();
    
    navigator.clipboard.writeText(contactText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const refreshData = async () => {
    await loadFromDatabase(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading contact information...</p>
        </div>
      </div>
    );
  }

  const socialMediaPlatforms = [
    { key: 'facebook', icon: FiFacebook, label: 'Facebook', color: 'text-blue-600', placeholder: 'https://facebook.com/your-college' },
    { key: 'twitter', icon: FiTwitter, label: 'Twitter', color: 'text-sky-500', placeholder: 'https://twitter.com/your-college' },
    { key: 'linkedin', icon: FiLinkedin, label: 'LinkedIn', color: 'text-blue-700', placeholder: 'https://linkedin.com/school/your-college' },
    { key: 'instagram', icon: FiInstagram, label: 'Instagram', color: 'text-pink-600', placeholder: 'https://instagram.com/your-college' },
  ];

  return (
    <>
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <FiCheck className="w-5 h-5" />
            <div>
              <p className="font-medium">Changes Saved Successfully!</p>
              <p className="text-sm text-green-100">Contact information updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your college contact details</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} variant="outline" className="gap-2">
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Contact Info
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <FiX className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                  <FiSave className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <FiMail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Update your contact information. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Address */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMapPin className="text-teal-500" /> Address
                </h3>
                <textarea
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-900 dark:text-white ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Airport Road, Opposite Honda Point, Lahore, Punjab, Pakistan"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* Map Link */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMap className="text-teal-500" /> Map Link
                </h3>
                <input
                  type="url"
                  value={contactInfo.mapLink}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, mapLink: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-900 dark:text-white"
                  placeholder="https://maps.google.com/?q=Your+Address"
                />
              </div>

              {/* Email */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMail className="text-teal-500" /> Email Address
                </h3>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="info@college.edu"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Website */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiGlobe className="text-teal-500" /> Website
                </h3>
                <input
                  type="url"
                  value={contactInfo.website}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-900 dark:text-white"
                  placeholder="https://www.college.edu"
                />
              </div>

              {/* Working Hours */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiClock className="text-teal-500" /> Working Hours
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={contactInfo.workingHours.weekdays}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, workingHours: { ...prev.workingHours, weekdays: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                    placeholder="Weekdays: 9:00 AM - 6:00 PM"
                  />
                  <input
                    type="text"
                    value={contactInfo.workingHours.saturday}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, workingHours: { ...prev.workingHours, saturday: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                    placeholder="Saturday: 9:00 AM - 2:00 PM"
                  />
                  <input
                    type="text"
                    value={contactInfo.workingHours.sunday}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, workingHours: { ...prev.workingHours, sunday: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                    placeholder="Sunday: Closed"
                  />
                </div>
              </div>

              {/* Appointment Link */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiCalendar className="text-teal-500" /> Appointment Link
                </h3>
                <input
                  type="url"
                  value={contactInfo.appointmentLink}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, appointmentLink: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-900 dark:text-white"
                  placeholder="https://calendly.com/your-link"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Numbers */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPhone className="text-teal-500" /> Contact Numbers
                </h3>
                {errors.contactNumbers && <p className="text-red-500 text-sm mb-3">{errors.contactNumbers}</p>}
                <div className="space-y-3">
                  <input
                    type="tel"
                    value={contactInfo.contactNumbers.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, contactNumbers: { ...prev.contactNumbers, phone: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                    placeholder="Phone: +92 300 1234567"
                  />
                  <input
                    type="tel"
                    value={contactInfo.contactNumbers.whatsapp}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, contactNumbers: { ...prev.contactNumbers, whatsapp: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                    placeholder="WhatsApp: +92 300 7654321"
                  />
                  <input
                    type="tel"
                    value={contactInfo.contactNumbers.office}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, contactNumbers: { ...prev.contactNumbers, office: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                    placeholder="Office: +92 42 1234567"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiGlobe className="text-teal-500" /> Social Media
                </h3>
                <div className="space-y-3">
                  {socialMediaPlatforms.map(({ key, icon: Icon, label, color, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                        <Icon className={color} /> {label}
                      </label>
                      <input
                        type="url"
                        value={contactInfo.socialMedia[key as keyof SocialMedia]}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, [key]: e.target.value } }))}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiMapPin className="text-teal-500" /> Our Campus
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{contactInfo.address || 'Address not provided'}</p>
                {contactInfo.mapLink && (
                  <a href={contactInfo.mapLink} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline text-sm flex items-center gap-1">
                    <FiMap className="w-4 h-4" /> View on Map
                  </a>
                )}
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiMail className="text-teal-500" /> Email Address
                </h3>
                <a href={`mailto:${contactInfo.email}`} className="text-gray-700 dark:text-gray-300 hover:text-teal-600">
                  {contactInfo.email || 'Not provided'}
                </a>
              </div>

              {contactInfo.website && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiGlobe className="text-teal-500" /> Website
                  </h3>
                  <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-teal-600">
                    {contactInfo.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiClock className="text-teal-500" /> Working Hours
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>Weekdays: {contactInfo.workingHours.weekdays}</p>
                  <p>Saturday: {contactInfo.workingHours.saturday}</p>
                  <p>Sunday: {contactInfo.workingHours.sunday}</p>
                </div>
              </div>

              {contactInfo.appointmentLink && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <a href={contactInfo.appointmentLink} target="_blank" rel="noopener noreferrer" className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                    <FiCalendar className="w-5 h-5" /> Book Appointment
                  </a>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiPhone className="text-teal-500" /> Contact Numbers
                </h3>
                <div className="space-y-3">
                  {contactInfo.contactNumbers.phone && (
                    <div><p className="text-sm text-gray-500">Phone</p><a href={`tel:${contactInfo.contactNumbers.phone}`} className="text-gray-700 dark:text-gray-300">{contactInfo.contactNumbers.phone}</a></div>
                  )}
                  {contactInfo.contactNumbers.whatsapp && (
                    <div><p className="text-sm text-gray-500">WhatsApp</p><a href={`https://wa.me/${contactInfo.contactNumbers.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300">{contactInfo.contactNumbers.whatsapp}</a></div>
                  )}
                  {contactInfo.contactNumbers.office && (
                    <div><p className="text-sm text-gray-500">Office</p><a href={`tel:${contactInfo.contactNumbers.office}`} className="text-gray-700 dark:text-gray-300">{contactInfo.contactNumbers.office}</a></div>
                  )}
                </div>
              </div>

              {Object.values(contactInfo.socialMedia).some(v => v) && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiGlobe className="text-teal-500" /> Social Media
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {contactInfo.socialMedia.facebook && <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FiFacebook /></a>}
                    {contactInfo.socialMedia.twitter && <a href={contactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"><FiTwitter /></a>}
                    {contactInfo.socialMedia.linkedin && <a href={contactInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"><FiLinkedin /></a>}
                    {contactInfo.socialMedia.instagram && <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"><FiInstagram /></a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="text-sm text-gray-600">Make your contact information easily accessible</div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleCopyContactInfo} className="flex items-center gap-2">
                  <FiCopy className="w-4 h-4" /> {copySuccess ? 'Copied!' : 'Copy Contact Info'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ContactSection;