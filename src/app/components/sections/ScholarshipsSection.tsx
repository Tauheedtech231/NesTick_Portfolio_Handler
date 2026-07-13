/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/ScholarshipsSection.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiSearch, FiXCircle
} from 'react-icons/fi';

interface ScholarshipsSectionProps {
  college: College;
  templateId?: number;
}

interface Scholarship {
  id: number;
  name: string;
  program: string;
  eligibility: string;
  amount: string;
  description: string;
  type: string;
  provider?: string;
  deadline?: string;
  applyLink?: string;
}

interface ScholarshipsFormData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  scholarships: Scholarship[];
}

const defaultScholarships: Scholarship[] = [
  {
    id: 1,
    name: "Merit Excellence Scholarship",
    program: "All Programs",
    eligibility: "95%+ marks in Matriculation with outstanding academic record",
    amount: "100% Tuition Fee",
    description: "A top scholarship for students with high academic performance.",
    type: "merit",
    provider: "Nestick College",
    deadline: "January 15, 2025"
  },
  {
    id: 2,
    name: "Financial Need Scholarship",
    program: "All Programs",
    eligibility: "Family income below ₹500,000 annually",
    amount: "25-75% Tuition Fee",
    description: "A need-based scholarship for financially deserving students.",
    type: "need",
    provider: "Nestick College",
    deadline: "January 15, 2025"
  },
  {
    id: 3,
    name: "Sports Achievement Scholarship",
    program: "All Programs",
    eligibility: "District/Provincial level sports recognition",
    amount: "50-100% Tuition Fee",
    description: "For students with outstanding sports achievements.",
    type: "sports",
    provider: "Nestick College",
    deadline: "January 15, 2025"
  }
];

const defaultFormData: ScholarshipsFormData = {
  heroTitle: 'Scholarships & Financial Aid',
  heroSubtitle: 'Explore available scholarships and financial support opportunities for your education',
  heroImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
  scholarships: defaultScholarships
};

const typeOptions = [
  { value: 'merit', label: 'Merit Based' },
  { value: 'need', label: 'Need Based' },
  { value: 'merit_cum_need', label: 'Merit-cum-Need' },
  { value: 'fully_funded', label: 'Fully Funded' },
  { value: 'partial', label: 'Partial' },
  { value: 'tuition_waiver', label: 'Tuition Waiver' },
  { value: 'sports', label: 'Sports' },
  { value: 'hafiz', label: 'Hafiz-e-Quran' },
  { value: 'minority', label: 'Minority' },
  { value: 'disability', label: 'Disability' },
  { value: 'orphan', label: 'Orphan' },
  { value: 'kinship', label: 'Kinship' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'employee', label: 'Employee' },
  { value: 'research', label: 'Research' },
  { value: 'international', label: 'International' },
  { value: 'exchange', label: 'Exchange' },
  { value: 'endowment', label: 'Endowment' },
  { value: 'talent', label: 'Talent' }
];

export function ScholarshipsSection({ college, templateId }: ScholarshipsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<ScholarshipsFormData>(defaultFormData);
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
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Scholarships&college_id=${collegeId}&_=${timestamp}`;
      
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
              scholarships: dbContent.scholarships || defaultFormData.scholarships
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load scholarships data:', error);
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
          section_name: "Scholarships",
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

  // ✅ Scholarship handlers
  const addScholarship = () => {
    const newId = Math.max(...formData.scholarships.map(s => s.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      scholarships: [...prev.scholarships, {
        id: newId,
        name: 'New Scholarship',
        program: 'All Programs',
        eligibility: 'Eligibility criteria here...',
        amount: '100% Tuition Fee',
        description: 'Description here...',
        type: 'merit',
        provider: 'Nestick College',
        deadline: 'December 31, 2025'
      }]
    }));
  };

  const updateScholarship = (index: number, field: string, value: string) => {
    const newScholarships = [...formData.scholarships];
    newScholarships[index] = { ...newScholarships[index], [field]: value };
    setFormData(prev => ({ ...prev, scholarships: newScholarships }));
  };

  const removeScholarship = (index: number) => {
    setFormData(prev => ({
      ...prev,
      scholarships: prev.scholarships.filter((_, i) => i !== index)
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
          <p className="text-gray-500 dark:text-gray-400">Loading scholarships data...</p>
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
              <p className="font-medium">Scholarships Saved Successfully!</p>
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scholarships Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage scholarships and financial aid content</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Scholarships
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
                  Modify scholarships content. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Settings */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hero Settings</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, heroTitle: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image URL</label>
              <input
                type="text"
                value={formData.heroImage}
                onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Scholarships List */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scholarships</h3>
            {isEditing && (
              <Button size="sm" onClick={addScholarship} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Scholarship
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {formData.scholarships.map((scholarship, index) => (
              <div key={scholarship.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Scholarship #{index + 1}</span>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeScholarship(index)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <input
                      type="text"
                      value={scholarship.name}
                      onChange={(e) => updateScholarship(index, 'name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Program</label>
                    <input
                      type="text"
                      value={scholarship.program}
                      onChange={(e) => updateScholarship(index, 'program', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Provider</label>
                    <input
                      type="text"
                      value={scholarship.provider || ''}
                      onChange={(e) => updateScholarship(index, 'provider', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Amount</label>
                    <input
                      type="text"
                      value={scholarship.amount}
                      onChange={(e) => updateScholarship(index, 'amount', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Deadline</label>
                    <input
                      type="text"
                      value={scholarship.deadline || ''}
                      onChange={(e) => updateScholarship(index, 'deadline', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Type</label>
                    <select
                      value={scholarship.type}
                      onChange={(e) => updateScholarship(index, 'type', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      {typeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Eligibility</label>
                    <textarea
                      value={scholarship.eligibility}
                      onChange={(e) => updateScholarship(index, 'eligibility', e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Description</label>
                    <textarea
                      value={scholarship.description}
                      onChange={(e) => updateScholarship(index, 'description', e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Apply Link (optional)</label>
                    <input
                      type="text"
                      value={scholarship.applyLink || ''}
                      onChange={(e) => updateScholarship(index, 'applyLink', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://..."
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

export default ScholarshipsSection;