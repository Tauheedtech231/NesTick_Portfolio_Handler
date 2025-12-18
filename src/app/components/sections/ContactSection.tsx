'use client';

import React, { useState, useEffect } from 'react';
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
  FiCopy,
  FiClock,
  FiCalendar,
  FiMap,
  FiMessageSquare,
  FiCheck
} from 'react-icons/fi';
import { validateEmail, validateUrl } from '@/lib/utils';

interface ContactSectionProps {
  college: College;
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

interface ExtendedContactInfo extends ContactInfo {
  mapLink?: string;
  workingHours?: WorkingHours;
  contactNumbers?: ContactNumbers;
  appointmentLink?: string;
}

export function ContactSection({ college }: ContactSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState<ExtendedContactInfo>({
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
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ✅ Load contact data from database with template_id = 2
  useEffect(() => {
    const loadContactData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/sections?template_id=2&section_name=Contacts`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched contact data:', data);
          
          if (data.sections && data.sections.length > 0) {
            const dbContent = data.sections[0].content;
            if (dbContent && dbContent.contactInfo) {
              setContactInfo({
                email: dbContent.contactInfo.email || '',
                phone: dbContent.contactInfo.phone || '',
                address: dbContent.contactInfo.address || '',
                website: dbContent.contactInfo.website || '',
                mapLink: dbContent.contactInfo.mapLink || '',
                appointmentLink: dbContent.contactInfo.appointmentLink || '',
                socialMedia: {
                  facebook: dbContent.contactInfo.socialMedia?.facebook || '',
                  twitter: dbContent.contactInfo.socialMedia?.twitter || '',
                  linkedin: dbContent.contactInfo.socialMedia?.linkedin || '',
                  instagram: dbContent.contactInfo.socialMedia?.instagram || ''
                },
                workingHours: dbContent.contactInfo.workingHours || {
                  weekdays: '9:00 AM - 6:00 PM',
                  saturday: '9:00 AM - 2:00 PM',
                  sunday: 'Closed'
                },
                contactNumbers: dbContent.contactInfo.contactNumbers || {
                  phone: '',
                  whatsapp: '',
                  office: ''
                }
              });
            }
          }
        } else {
          console.error('Failed to fetch contact data');
        }
      } catch (error) {
        console.error('Error loading contact data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContactData();
  }, []);

  // Handle success popup display
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const updateContact = (patch: Partial<ExtendedContactInfo>) => {
    setContactInfo(prev => ({
      ...prev,
      ...patch,
    }));
  };

  const updateWorkingHours = (field: keyof WorkingHours, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours!,
        [field]: value
      }
    }));
  };

  const updateContactNumbers = (field: keyof ContactNumbers, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      contactNumbers: {
        ...prev.contactNumbers!,
        [field]: value
      }
    }));
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

    if (contactInfo.mapLink && !validateUrl(contactInfo.mapLink)) {
      newErrors.mapLink = 'Please enter a valid map URL';
    }

    if (contactInfo.appointmentLink && !validateUrl(contactInfo.appointmentLink)) {
      newErrors.appointmentLink = 'Please enter a valid URL';
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

    // Working hours validation
    if (!contactInfo.workingHours?.weekdays?.trim()) {
      newErrors.weekdays = 'Weekdays working hours required';
    }

    if (!contactInfo.workingHours?.saturday?.trim()) {
      newErrors.saturday = 'Saturday working hours required';
    }

    if (!contactInfo.workingHours?.sunday?.trim()) {
      newErrors.sunday = 'Sunday status required';
    }

    // Contact numbers validation (at least one is required)
    const hasContactNumber = contactInfo.contactNumbers && (
      contactInfo.contactNumbers.phone ||
      contactInfo.contactNumbers.whatsapp ||
      contactInfo.contactNumbers.office
    );
    
    if (!hasContactNumber) {
      newErrors.contactNumbers = 'At least one contact number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare content for database with template_id = 2
      const dbContent = {
        contactInfo: {
          email: contactInfo.email || '',
          phone: contactInfo.phone || '',
          address: contactInfo.address || '',
          website: contactInfo.website || '',
          mapLink: contactInfo.mapLink || '',
          appointmentLink: contactInfo.appointmentLink || '',
          socialMedia: {
            facebook: contactInfo.socialMedia?.facebook || '',
            twitter: contactInfo.socialMedia?.twitter || '',
            linkedin: contactInfo.socialMedia?.linkedin || '',
            instagram: contactInfo.socialMedia?.instagram || ''
          },
          workingHours: {
            weekdays: contactInfo.workingHours?.weekdays || '',
            saturday: contactInfo.workingHours?.saturday || '',
            sunday: contactInfo.workingHours?.sunday || ''
          },
          contactNumbers: {
            phone: contactInfo.contactNumbers?.phone || '',
            whatsapp: contactInfo.contactNumbers?.whatsapp || '',
            office: contactInfo.contactNumbers?.office || ''
          }
        }
      };

      console.log('Saving contact data:', dbContent);

      // Save to database with template_id = 2
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: 2,
          section_name: "Contacts",
          content: dbContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      const result = await response.json();
      console.log('Saved contact info to database:', result);
      
      // Show success popup
      setShowSuccessPopup(true);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = async () => {
    // Reload from database
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/sections?template_id=2&section_name=Contacts`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          if (dbContent && dbContent.contactInfo) {
            setContactInfo({
              email: dbContent.contactInfo.email || '',
              phone: dbContent.contactInfo.phone || '',
              address: dbContent.contactInfo.address || '',
              website: dbContent.contactInfo.website || '',
              mapLink: dbContent.contactInfo.mapLink || '',
              appointmentLink: dbContent.contactInfo.appointmentLink || '',
              socialMedia: {
                facebook: dbContent.contactInfo.socialMedia?.facebook || '',
                twitter: dbContent.contactInfo.socialMedia?.twitter || '',
                linkedin: dbContent.contactInfo.socialMedia?.linkedin || '',
                instagram: dbContent.contactInfo.socialMedia?.instagram || ''
              },
              workingHours: dbContent.contactInfo.workingHours || {
                weekdays: '9:00 AM - 6:00 PM',
                saturday: '9:00 AM - 2:00 PM',
                sunday: 'Closed'
              },
              contactNumbers: dbContent.contactInfo.contactNumbers || {
                phone: '',
                whatsapp: '',
                office: ''
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error reloading contact data:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setErrors({});
    }
  };

  const updateContactField = (field: keyof ExtendedContactInfo, value: string) => {
    updateContact({ [field]: value } as Partial<ExtendedContactInfo>);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateSocialMedia = (platform: string, value: string) => {
    const nextSocial = {
      ...(contactInfo.socialMedia || {}),
      [platform]: value,
    };
    updateContact({ socialMedia: nextSocial } as Partial<ExtendedContactInfo>);
    if (errors[platform]) {
      setErrors(prev => ({ ...prev, [platform]: '' }));
    }
  };

  const handleCopyContactInfo = () => {
    const contactText = `
Contact Information:
📧 Email: ${contactInfo.email}
📍 Address: ${contactInfo.address}
📞 Phone: ${contactInfo.contactNumbers?.phone || 'N/A'}
📱 WhatsApp: ${contactInfo.contactNumbers?.whatsapp || 'N/A'}
🏢 Office: ${contactInfo.contactNumbers?.office || 'N/A'}
🌐 Website: ${contactInfo.website || 'N/A'}

Working Hours:
🕒 Weekdays: ${contactInfo.workingHours?.weekdays}
🕒 Saturday: ${contactInfo.workingHours?.saturday}
🕒 Sunday: ${contactInfo.workingHours?.sunday}
    `.trim();
    
    navigator.clipboard.writeText(contactText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading contact information...</span>
        </div>
      </div>
    );
  }

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
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-xl border border-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <FiCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium">Changes Saved Successfully!</p>
              <p className="text-sm text-gray-300">Your Contact section has been updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Reach out to us anytime
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
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                <FiSave className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            {/* Edit Mode - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                {/* Our Campus Section */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FiMapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Our Campus
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Address and map information
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Address */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        <FiMapPin className="w-4 h-4 inline mr-2" />
                        Address *
                      </label>
                      <div>
                        <textarea
                          value={contactInfo.address || ''}
                          onChange={(e) => updateContactField('address', e.target.value)}
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                            errors.address 
                              ? 'border-red-500 dark:border-red-400' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Airport Road, Opposite Honda Point, Lahore, Punjab, Pakistan"
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                        )}
                      </div>
                    </div>

                    {/* Map Link */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        <FiMap className="w-4 h-4 inline mr-2" />
                        Map Link (Optional)
                      </label>
                      <div>
                        <input
                          type="url"
                          value={contactInfo.mapLink || ''}
                          onChange={(e) => updateContactField('mapLink', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.mapLink 
                              ? 'border-red-500 dark:border-red-400' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="https://maps.google.com/?q=Your+Address"
                        />
                        {errors.mapLink && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.mapLink}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Google Maps or any map service link
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        <FiMail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <div>
                        <input
                          type="email"
                          value={contactInfo.email || ''}
                          onChange={(e) => updateContactField('email', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.email 
                              ? 'border-red-500 dark:border-red-400' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="info@mansol.com.pk"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Website */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        <FiGlobe className="w-4 h-4 inline mr-2" />
                        Website (Optional)
                      </label>
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
                          placeholder="https://www.mansol.com.pk"
                        />
                        {errors.website && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <FiClock className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Working Hours
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Set your operational hours
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Weekdays *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.workingHours?.weekdays || ''}
                        onChange={(e) => updateWorkingHours('weekdays', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.weekdays ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="9:00 AM - 6:00 PM"
                      />
                      {errors.weekdays && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.weekdays}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Saturday *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.workingHours?.saturday || ''}
                        onChange={(e) => updateWorkingHours('saturday', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.saturday ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="9:00 AM - 2:00 PM"
                      />
                      {errors.saturday && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.saturday}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Sunday *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.workingHours?.sunday || ''}
                        onChange={(e) => updateWorkingHours('sunday', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.sunday ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Closed"
                      />
                      {errors.sunday && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sunday}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Appointment Link */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Book Appointment
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Link for appointment booking
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Appointment Link (Optional)
                    </label>
                    <div>
                      <input
                        type="url"
                        value={contactInfo.appointmentLink || ''}
                        onChange={(e) => updateContactField('appointmentLink', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.appointmentLink 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="https://calendly.com/your-link"
                      />
                      {errors.appointmentLink && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.appointmentLink}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Link to booking system (Calendly, Google Calendar, etc.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Numbers & Social Media */}
              <div className="space-y-6">
                {/* Contact Numbers */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <FiPhone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Contact Numbers
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add phone numbers for different purposes
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {errors.contactNumbers && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.contactNumbers}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        <FiPhone className="w-4 h-4 inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.contactNumbers?.phone || ''}
                        onChange={(e) => updateContactNumbers('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+92 300 1234567"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        <FiMessageSquare className="w-4 h-4 inline mr-2" />
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.contactNumbers?.whatsapp || ''}
                        onChange={(e) => updateContactNumbers('whatsapp', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+92 300 7654321"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        <FiPhone className="w-4 h-4 inline mr-2" />
                        Office
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.contactNumbers?.office || ''}
                        onChange={(e) => updateContactNumbers('office', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+92 42 1234567"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <FiGlobe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Social Media Links (Optional)
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
                        <div>
                          <input
                            type="url"
                            value={contactInfo.socialMedia?.[key as keyof typeof contactInfo.socialMedia] || ''}
                            onChange={(e) => updateSocialMedia(key, e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                              errors[key] 
                                ? 'border-red-500 dark:border-red-400' 
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder={placeholder}
                          />
                          {errors[key] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[key]}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode - Two Columns Design */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Our Campus */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FiMapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Our Campus
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {contactInfo.address || 'Address not provided'}
                  </p>
                  
                  {contactInfo.mapLink && (
                    <a 
                      href={contactInfo.mapLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <FiMap className="w-4 h-4 mr-2" />
                      View on Map
                    </a>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <FiMail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Email Address
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For general inquiries
                    </p>
                  </div>
                </div>
                
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {contactInfo.email || 'Not provided'}
                </a>
              </div>

              {/* Website */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <FiGlobe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Website
                    </h4>
                  </div>
                </div>
                
                {contactInfo.website ? (
                  <div className="flex items-center justify-between">
                    <a 
                      href={contactInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {contactInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                    <FiExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No website provided</p>
                )}
              </div>

              {/* Working Hours */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FiClock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Working Hours
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Weekdays</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {contactInfo.workingHours?.weekdays || 'Not set'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Saturday</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {contactInfo.workingHours?.saturday || 'Not set'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Sunday</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {contactInfo.workingHours?.sunday || 'Not set'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Appointment Button */}
              {contactInfo.appointmentLink && (
                <div className="pt-4">
                  <a 
                    href={contactInfo.appointmentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <FiCalendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </a>
                </div>
              )}
            </div>

            {/* Right Column - Contact Numbers */}
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <FiPhone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Contact Numbers
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {contactInfo.contactNumbers?.phone && (
                    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3 mb-2">
                        <FiPhone className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                        </div>
                      </div>
                      <a 
                        href={`tel:${contactInfo.contactNumbers.phone}`}
                        className="text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {contactInfo.contactNumbers.phone}
                      </a>
                    </div>
                  )}

                  {contactInfo.contactNumbers?.whatsapp && (
                    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3 mb-2">
                        <FiMessageSquare className="w-5 h-5 text-green-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">WhatsApp</h4>
                        </div>
                      </div>
                      <a 
                        href={`https://wa.me/${contactInfo.contactNumbers.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        {contactInfo.contactNumbers.whatsapp}
                      </a>
                    </div>
                  )}

                  {contactInfo.contactNumbers?.office && (
                    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3 mb-2">
                        <FiPhone className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Office</h4>
                        </div>
                      </div>
                      <a 
                        href={`tel:${contactInfo.contactNumbers.office}`}
                        className="text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {contactInfo.contactNumbers.office}
                      </a>
                    </div>
                  )}

                  {(!contactInfo.contactNumbers?.phone && 
                    !contactInfo.contactNumbers?.whatsapp && 
                    !contactInfo.contactNumbers?.office) && (
                    <div className="text-center py-8">
                      <FiPhone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No contact numbers provided
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media (Hidden in view mode as per design) */}
              {hasSocialMedia && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <FiGlobe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Social Media
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect with us
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {contactInfo.socialMedia?.facebook && (
                      <a 
                        href={contactInfo.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiFacebook className="w-5 h-5" />
                      </a>
                    )}
                    
                    {contactInfo.socialMedia?.twitter && (
                      <a 
                        href={contactInfo.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                      >
                        <FiTwitter className="w-5 h-5" />
                      </a>
                    )}
                    
                    {contactInfo.socialMedia?.linkedin && (
                      <a 
                        href={contactInfo.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        <FiLinkedin className="w-5 h-5" />
                      </a>
                    )}
                    
                    {contactInfo.socialMedia?.instagram && (
                      <a 
                        href={contactInfo.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <FiInstagram className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
    </>
  );
}