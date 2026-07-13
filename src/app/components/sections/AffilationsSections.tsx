/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiLink, FiAward, FiStar, FiGlobe
} from 'react-icons/fi';

interface AffiliationsSectionProps {
  college: College;
  templateId?: number;
}

interface Affiliation {
  id: number;
  name: string;
  note: string;
  logo?: string;
}

interface AffiliationsFormData {
  title: string;
  description: string;
  affiliations: Affiliation[];
}

const defaultAffiliations: Affiliation[] = [
  { id: 1, name: 'Higher Education Commission', note: 'Recognized by HEC Pakistan' },
  { id: 2, name: 'Pakistan Engineering Council', note: 'Accredited by PEC' },
  { id: 3, name: 'Pakistan Medical Commission', note: 'Approved by PMC' },
  { id: 4, name: 'University of the Punjab', note: 'Affiliated with PU' },
  { id: 5, name: 'National Accreditation Council', note: 'Accredited by NAC' },
  { id: 6, name: 'British Council', note: 'British Council Partner' }
];

const defaultFormData: AffiliationsFormData = {
  title: 'Our Affiliations',
  description: 'Proudly affiliated with leading educational bodies and institutions worldwide, ensuring quality and recognition for our students.',
  affiliations: defaultAffiliations
};

export function AffiliationsSection({ college, templateId }: AffiliationsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<AffiliationsFormData>(defaultFormData);
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
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Affiliations&college_id=${collegeId}&_=${timestamp}`;
      
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
              affiliations: dbContent.affiliations || defaultFormData.affiliations
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load affiliations data:', error);
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
          section_name: "Affiliations",
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

  // Affiliation handlers
  const addAffiliation = () => {
    const newId = Math.max(...formData.affiliations.map(a => a.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      affiliations: [...prev.affiliations, {
        id: newId,
        name: 'New Affiliation',
        note: 'Affiliation description'
      }]
    }));
  };

  const updateAffiliation = (index: number, field: string, value: string) => {
    const newAffiliations = [...formData.affiliations];
    newAffiliations[index] = { ...newAffiliations[index], [field]: value };
    setFormData(prev => ({ ...prev, affiliations: newAffiliations }));
  };

  const removeAffiliation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading affiliations data...</p>
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
              <p className="font-medium">Affiliations Saved Successfully!</p>
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Affiliations Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage affiliations and accreditations</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Affiliations
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
                  Modify affiliations content. Changes will be saved to database.
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Affiliations List */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Affiliations</h3>
            {isEditing && (
              <Button size="sm" onClick={addAffiliation} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Affiliation
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {formData.affiliations.map((affiliation, index) => (
              <div key={affiliation.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium text-sm">Affiliation #{index + 1}</span>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeAffiliation(index)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <input
                      type="text"
                      value={affiliation.name}
                      onChange={(e) => updateAffiliation(index, 'name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Note</label>
                    <input
                      type="text"
                      value={affiliation.note}
                      onChange={(e) => updateAffiliation(index, 'note', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.affiliations.length === 0 && (
            <div className="text-center py-8">
              <FiLink className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No affiliations added yet. Click "Add Affiliation" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AffiliationsSection;