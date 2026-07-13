/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiBarChart2, FiTrendingUp, FiUsers, FiBookOpen,
  FiAward, FiStar, FiTarget, FiClock, FiImage
} from 'react-icons/fi';

interface StatsSectionProps {
  college: College;
  templateId?: number;
}

interface StatItem {
  id: number;
  label: string;
  value: string;
  target: number;
  suffix: string;
  icon?: string;
}

interface StatsFormData {
  title: string;
  subtitle: string;
  backgroundImage: string;
  stats: StatItem[];
  achievementsBadge: string;
}

const defaultStats: StatItem[] = [
  { id: 1, label: 'Years of Excellence', value: '25+', target: 25, suffix: '+', icon: 'FiClock' },
  { id: 2, label: 'Academic Programs', value: '15+', target: 15, suffix: '+', icon: 'FiBookOpen' },
  { id: 3, label: 'Faculty Members', value: '40+', target: 40, suffix: '+', icon: 'FiUsers' },
  { id: 4, label: 'Success Rate', value: '97%', target: 97, suffix: '%', icon: 'FiAward' }
];

const defaultFormData: StatsFormData = {
  title: 'Why Choose',
  subtitle: 'Excellence in education, innovation, and student success',
  backgroundImage: '',
  achievementsBadge: 'Our Achievements',
  stats: defaultStats
};

export function StatsSection({ college, templateId }: StatsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<StatsFormData>(defaultFormData);
  const [lastUpdated, setLastUpdated] = useState('');

  const getActiveTemplateId = () => {
    return templateId || (college as any).template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt((college as any).id);
  };

  // Load from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Stats&college_id=${collegeId}&_=${timestamp}`;
      
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
              stats: dbContent.stats || defaultFormData.stats
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load stats data:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [templateId, college.template_id, college.id]);

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
          section_name: "Stats",
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

  // Stat handlers
  const addStat = () => {
    const newId = Math.max(...formData.stats.map(s => s.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, {
        id: newId,
        label: 'New Stat',
        value: '0',
        target: 0,
        suffix: '+',
        icon: 'FiStar'
      }]
    }));
  };

  const updateStat = (index: number, field: string, value: string | number) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  const removeStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const handleBackgroundImageChange = (fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      setFormData(prev => ({ ...prev, backgroundImage: fileOrString }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, backgroundImage: reader.result as string }));
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
          <p className="text-gray-500 dark:text-gray-400">Loading stats data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <FiCheck className="w-5 h-5" />
            <div>
              <p className="font-medium">Stats Saved Successfully!</p>
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stats Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage statistics and achievements</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Stats
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
                  Modify stats content. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Settings */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section Settings</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Achievements Badge Text</label>
              <input
                type="text"
                value={formData.achievementsBadge}
                onChange={(e) => setFormData(prev => ({ ...prev, achievementsBadge: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background Image</label>
              <UploadImage
                value={formData.backgroundImage}
                onChange={handleBackgroundImageChange}
                onRemove={() => handleBackgroundImageChange('')}
                aspectRatio="banner"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h3>
            {isEditing && (
              <Button size="sm" onClick={addStat} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Stat
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {formData.stats.map((stat, index) => (
              <div key={stat.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium text-sm">Stat #{index + 1}</span>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeStat(index)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Target Number</label>
                    <input
                      type="number"
                      value={stat.target}
                      onChange={(e) => updateStat(index, 'target', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Suffix (+, %, K, etc.)</label>
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default StatsSection;