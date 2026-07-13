/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiFileText, FiUser, FiCalendar, FiMail, FiPhone,
  FiMapPin, FiBook, FiClock, FiDollarSign, FiUpload, FiImage
} from 'react-icons/fi';

interface AdmissionSectionProps {
  college: College;
  templateId?: number;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  details: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface AdmissionFormData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  steps: Step[];
  faqs: FAQ[];
}

const defaultSteps: Step[] = [
  {
    id: '01',
    title: 'Register / Login',
    subtitle: 'Create your applicant account',
    details: ['Secure account creation', 'Email verification', 'Profile management']
  },
  {
    id: '02',
    title: 'Fill Application',
    subtitle: 'Complete admission form',
    details: ['Personal information', 'Academic history', 'Program preferences']
  },
  {
    id: '03',
    title: 'Upload Documents',
    subtitle: 'Submit certificates & photos',
    details: ['Transcripts', 'CNIC/B-Form', 'Photographs']
  },
  {
    id: '04',
    title: 'Pay Fee',
    subtitle: 'Submit processing fee',
    details: ['Online payment', 'Bank challan', 'Secure transaction']
  },
  {
    id: '05',
    title: 'Track Status',
    subtitle: 'Monitor application online',
    details: ['Real-time updates', 'Status notifications', 'Review feedback']
  },
  {
    id: '06',
    title: 'Admission Letter',
    subtitle: 'Receive official confirmation',
    details: ['Official letter', 'Next steps', 'Welcome package']
  }
];

const defaultFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What documents are required for admission?',
    answer: "You'll need your Matric/O-Level certificate and marksheet, CNIC/B-Form, 4 recent passport-size photographs, and any relevant certificates for scholarships or sports quotas."
  },
  {
    id: 'faq-2',
    question: 'When is the admission deadline?',
    answer: 'Admissions are open throughout the year, but we recommend applying at least 4 weeks before the semester start date to complete all formalities.'
  },
  {
    id: 'faq-3',
    question: 'Can I apply for multiple programs?',
    answer: 'Yes, you can apply for up to 3 programs simultaneously. However, you will need to submit separate application forms and pay individual processing fees.'
  },
  {
    id: 'faq-4',
    question: 'How long does the admission process take?',
    answer: 'The complete admission process typically takes 7-10 working days from application submission to final admission confirmation.'
  }
];

const defaultFormData: AdmissionFormData = {
  heroTitle: 'Admission Guidance',
  heroSubtitle: 'Your complete guide to joining our college. Follow our streamlined process for a smooth admission experience.',
  heroImage: '',
  steps: defaultSteps,
  faqs: defaultFAQs
};

export function AdmissionSection({ college, templateId }: AdmissionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<AdmissionFormData>(defaultFormData);
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
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Admission&college_id=${collegeId}&_=${timestamp}`;
      
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
              steps: dbContent.steps || defaultFormData.steps,
              faqs: dbContent.faqs || defaultFormData.faqs
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load admission data:', error);
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
          section_name: "Admission",
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

  // Step handlers
  const addStep = () => {
    const newId = String(formData.steps.length + 1).padStart(2, '0');
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, {
        id: newId,
        title: 'New Step',
        subtitle: 'Step subtitle',
        details: ['Detail 1', 'Detail 2', 'Detail 3']
      }]
    }));
  };

  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const addStepDetail = (stepIndex: number) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].details.push('New detail');
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const updateStepDetail = (stepIndex: number, detailIndex: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].details[detailIndex] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const removeStepDetail = (stepIndex: number, detailIndex: number) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].details = newSteps[stepIndex].details.filter((_, i) => i !== detailIndex);
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  // FAQ handlers
  const addFAQ = () => {
    const newId = `faq-${formData.faqs.length + 1}`;
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { id: newId, question: 'New Question?', answer: 'New answer here...' }]
    }));
  };

  const updateFAQ = (index: number, field: string, value: string) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: newFAQs }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleHeroImageChange = (fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      setFormData(prev => ({ ...prev, heroImage: fileOrString }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, heroImage: reader.result as string }));
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
          <p className="text-gray-500 dark:text-gray-400">Loading admission data...</p>
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
              <p className="font-medium">Admission Saved Successfully!</p>
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admission Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage admission content</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Admission
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
                  Modify admission content. Changes will be saved to database.
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image</label>
              <UploadImage
                value={formData.heroImage}
                onChange={handleHeroImageChange}
                onRemove={() => handleHeroImageChange('')}
                aspectRatio="banner"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Admission Steps</h3>
            {isEditing && (
              <Button size="sm" onClick={addStep} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Step
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {formData.steps.map((step, stepIndex) => (
              <div key={step.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-teal-600">Step {step.id}</span>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeStep(stepIndex)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Subtitle</label>
                    <input
                      type="text"
                      value={step.subtitle}
                      onChange={(e) => updateStep(stepIndex, 'subtitle', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Details</label>
                    {isEditing && (
                      <Button size="sm" variant="outline" onClick={() => addStepDetail(stepIndex)} className="text-teal-600">
                        <FiPlus className="w-3 h-3 mr-1" /> Add Detail
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => updateStepDetail(stepIndex, detailIndex, e.target.value)}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        />
                        {isEditing && (
                          <Button variant="ghost" size="sm" onClick={() => removeStepDetail(stepIndex, detailIndex)} className="text-red-500">
                            <FiTrash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">FAQs</h3>
            {isEditing && (
              <Button size="sm" onClick={addFAQ} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add FAQ
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {formData.faqs.map((faq, index) => (
              <div key={faq.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium text-sm">FAQ #{index + 1}</span>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeFAQ(index)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Question</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
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

export default AdmissionSection;