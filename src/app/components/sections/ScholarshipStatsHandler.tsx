/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/ScholarshipStatsHandler.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiStar, FiHeart, FiDollarSign, FiAward
} from 'react-icons/fi';

interface ScholarshipStatsHandlerProps {
  college: College;
  templateId?: number;
}

interface StatCard {
  id: string;
  num: string;
  title: string;
  description: string;
  color: string;
  className?: string;
  mobileImage: string;
  desktopImage: string;
}

interface ScholarshipStatsFormData {
  badgeText: string;
  title: string;
  subtitle: string;
  cards: StatCard[];
  buttonText: string;
  buttonLink: string;
}

const defaultCards: StatCard[] = [
  {
    id: 'card1',
    num: '01',
    title: 'Merit Scholarships',
    description: 'Recognizing excellence and academic achievements.',
    color: '#2f56fb',
    className: 'card1',
    mobileImage: '',
    desktopImage: ''
  },
  {
    id: 'card2',
    num: '02',
    title: 'Need-Based Aid',
    description: 'Supporting students who need it the most.',
    color: '#2f56fb',
    className: 'card2',
    mobileImage: '',
    desktopImage: ''
  },
  {
    id: 'card3',
    num: '03',
    title: 'Affordable Education',
    description: 'Making quality education accessible for all.',
    color: '#2f56fb',
    className: 'card3',
    mobileImage: '',
    desktopImage: ''
  }
];

const defaultFormData: ScholarshipStatsFormData = {
  badgeText: 'SCHOLARSHIPS',
  title: 'Scholarships &',
  subtitle: 'We believe that financial constraints should never be a barrier to quality education. Nestick College offers a range of merit-based and need-based scholarships to help talented students achieve their academic dreams.',
  cards: defaultCards,
  buttonText: 'Explore Scholarships',
  buttonLink: '/Scholarships'
};

export function ScholarshipStatsHandler({ college, templateId }: ScholarshipStatsHandlerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<ScholarshipStatsFormData>(defaultFormData);
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
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=ScholarshipStats&college_id=${collegeId}&_=${timestamp}`;
      
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
              cards: dbContent.cards || defaultFormData.cards
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load scholarship stats data:', error);
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
          section_name: "ScholarshipStats",
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

  // ✅ Card handlers
  const addCard = () => {
    const newId = `card${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      cards: [...prev.cards, {
        id: newId,
        num: String(prev.cards.length + 1).padStart(2, '0'),
        title: 'New Scholarship',
        description: 'Description here...',
        color: '#2f56fb',
        className: `card${prev.cards.length + 1}`,
        mobileImage: '',
        desktopImage: ''
      }]
    }));
  };

  const updateCard = (index: number, field: string, value: string) => {
    const newCards = [...formData.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setFormData(prev => ({ ...prev, cards: newCards }));
  };

  const removeCard = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  // ✅ Image handlers - only upload, no URL paste
  const handleImageChange = (index: number, key: 'mobileImage' | 'desktopImage', fileOrString: File | string) => {
    // If it's a string (URL), ignore it - we only allow upload
    if (typeof fileOrString === 'string') {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const newCards = [...formData.cards];
      newCards[index] = { ...newCards[index], [key]: reader.result as string };
      setFormData(prev => ({ ...prev, cards: newCards }));
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
          <p className="text-gray-500 dark:text-gray-400">Loading scholarship stats data...</p>
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
              <p className="font-medium">Scholarship Stats Saved Successfully!</p>
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scholarship Stats Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage scholarship stats content</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2 cursor-pointer"
              onClick={() => loadFromDatabase(true)}
            >
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Stats
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="cursor-pointer">
                  <FiX className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
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
                  Upload images directly from your computer. URL paste is not allowed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section Settings */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section Settings</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Badge Text</label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Subtitle</label>
              <textarea
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text"
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stat Cards</h3>
            {isEditing && (
              <Button size="sm" onClick={addCard} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
                <FiPlus className="w-3 h-3 mr-1" /> Add Card
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {formData.cards.map((card, index) => (
              <div key={card.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Card #{index + 1}</span>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeCard(index)} className="text-red-500 cursor-pointer">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Number</label>
                    <input
                      type="text"
                      value={card.num}
                      onChange={(e) => updateCard(index, 'num', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 cursor-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Color</label>
                    <input
                      type="text"
                      value={card.color}
                      onChange={(e) => updateCard(index, 'color', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 cursor-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard(index, 'title', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 cursor-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Description</label>
                    <input
                      type="text"
                      value={card.description}
                      onChange={(e) => updateCard(index, 'description', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 cursor-text"
                    />
                  </div>
                </div>

                {/* Mobile Image */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">
                    Mobile Image <span className="text-xs text-gray-400">(Upload only)</span>
                  </label>
                  <UploadImage
                    value={card.mobileImage || ''}
                    onChange={(file) => handleImageChange(index, 'mobileImage', file)}
                    onRemove={() => {
                      const newCards = [...formData.cards];
                      newCards[index] = { ...newCards[index], mobileImage: '' };
                      setFormData(prev => ({ ...prev, cards: newCards }));
                    }}
                    aspectRatio="square"
                    disabled={!isEditing}
                  />
                </div>

                {/* Desktop Image */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">
                    Desktop Image <span className="text-xs text-gray-400">(Upload only)</span>
                  </label>
                  <UploadImage
                    value={card.desktopImage || ''}
                    onChange={(file) => handleImageChange(index, 'desktopImage', file)}
                    onRemove={() => {
                      const newCards = [...formData.cards];
                      newCards[index] = { ...newCards[index], desktopImage: '' };
                      setFormData(prev => ({ ...prev, cards: newCards }));
                    }}
                    aspectRatio="square"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            ))}
          </div>

          {formData.cards.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No cards added yet. Click "Add Card" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ScholarshipStatsHandler;