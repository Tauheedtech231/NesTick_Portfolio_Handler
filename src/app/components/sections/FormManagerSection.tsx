/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/FormManagerSection.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { 
  FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiToggleLeft, FiToggleRight, FiEye, FiEyeOff,
  FiList, FiUser, FiCalendar, FiMail, FiPhone, FiFile,
  FiInfo, FiAlertCircle, FiLoader
} from 'react-icons/fi';

interface FormManagerSectionProps {
  college: College;
  templateId?: number;
}

interface FormField {
  id: number;
  field_key: string;
  field_label: string;
  field_type: string;
  field_placeholder: string;
  field_options: string[];
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  section: string;
}

interface Application {
  id: number;
  application_id: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  form_data: any;
  status: string;
  applied_at: string;
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'tel', label: 'Phone' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'File Upload' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
];

const sections = [
  { value: 'personal_info', label: 'Personal Information' },
  { value: 'academic_info', label: 'Academic Information' },
  { value: 'course_selection', label: 'Course Selection' },
  { value: 'documents', label: 'Documents' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'other', label: 'Other' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  fee_pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'fee_pending', label: 'Fee Pending' },
];

export function FormManagerSection({ college, templateId }: FormManagerSectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState<FormField[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'fields' | 'applications'>('fields');
  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showSuccess, setShowSuccess] = useState<string>('');
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [loadingAction, setLoadingAction] = useState<{ type: string; id?: number } | null>(null);
  const [newField, setNewField] = useState<Partial<FormField>>({
    field_key: '',
    field_label: '',
    field_type: 'text',
    field_placeholder: '',
    field_options: [],
    is_required: false,
    is_active: true,
    sort_order: 0,
    section: 'personal_info'
  });

  const getCollegeId = () => parseInt((college as any).id);
  const getTemplateId = () => templateId || (college as any).template_id || 1;

  // Load data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const collegeId = getCollegeId();
      
      const fieldsRes = await fetch(`/api/form?collegeId=${collegeId}&type=fields`);
      const fieldsData = await fieldsRes.json();
      if (fieldsData.success) setFields(fieldsData.data);

      const appsRes = await fetch(`/api/form?collegeId=${collegeId}&type=applications`);
      const appsData = await appsRes.json();
      if (appsData.success) setApplications(appsData.data);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // API call helper with loading state
  const callAPI = async (action: string, data: any = {}) => {
    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          collegeId: getCollegeId(),
          templateId: getTemplateId(),
          ...data
        })
      });
      const result = await response.json();
      if (result.success) {
        await loadData();
        setShowSuccess(result.message);
        setTimeout(() => setShowSuccess(''), 3000);
        return result;
      } else {
        alert(result.message || 'Something went wrong');
        return null;
      }
    } catch (error) {
      alert('Network error');
      return null;
    }
  };

  // Add field with loading
  const handleAddField = async () => {
    if (!newField.field_key || !newField.field_label) {
      alert('Field Key and Label are required');
      return;
    }

    // Only allow text type for now
    if (newField.field_type !== 'text') {
      alert('Currently only Text type is supported for new fields');
      return;
    }

    setLoadingAction({ type: 'add' });
    const result = await callAPI('add_field', {
      fieldKey: newField.field_key,
      fieldLabel: newField.field_label,
      fieldType: 'text', // Force text type
      fieldPlaceholder: newField.field_placeholder || '',
      fieldOptions: [],
      isRequired: newField.is_required || false,
      isActive: newField.is_active !== false,
      sortOrder: newField.sort_order || fields.length + 1,
      section: newField.section || 'personal_info'
    });

    if (result) {
      setShowAddField(false);
      setNewField({ 
        field_key: '', 
        field_label: '', 
        field_type: 'text', 
        field_placeholder: '', 
        field_options: [], 
        is_required: false, 
        is_active: true, 
        sort_order: 0, 
        section: 'personal_info' 
      });
    }
    setLoadingAction(null);
  };

  // Toggle field with loading
  const handleToggle = async (fieldId: number, currentStatus: boolean) => {
    setLoadingAction({ type: 'toggle', id: fieldId });
    await callAPI('toggle_field', { fieldId, isActive: !currentStatus });
    setLoadingAction(null);
  };

  // Delete field with loading
  const handleDelete = async (fieldId: number) => {
    if (confirm('Are you sure you want to delete this field?')) {
      setLoadingAction({ type: 'delete', id: fieldId });
      await callAPI('delete_field', { fieldId });
      setLoadingAction(null);
    }
  };

  // Update application status with loading
  const handleStatusUpdate = async (applicationId: string, status: string) => {
    setLoadingAction({ type: 'status', id: parseInt(applicationId) });
    await callAPI('update_application_status', { applicationId, status });
    setLoadingAction(null);
  };

  // Group fields by section
  const groupedFields = fields.reduce((acc, field) => {
    const section = field.section || 'other';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {} as Record<string, FormField[]>);

  // Loading state for field actions
  const isFieldLoading = (fieldId?: number) => {
    if (!loadingAction) return false;
    if (fieldId && loadingAction.id !== fieldId) return false;
    return ['toggle', 'delete'].includes(loadingAction.type);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <FiLoader className="w-12 h-12 text-teal-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading form manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-right-4 duration-300">
          <FiCheck className="w-5 h-5" />
          <span>{showSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Form Manager</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage dynamic form fields and applications</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getTemplateId()}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
          </div>
        </div>
        <Button 
          onClick={loadData} 
          variant="outline" 
          className="gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          disabled={isLoading}
        >
          <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> 
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('fields')}
          className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg ${
            activeTab === 'fields'
              ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-900/20'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiList className="inline mr-2" /> Form Fields ({fields.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg ${
            activeTab === 'applications'
              ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-900/20'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiUser className="inline mr-2" /> Applications ({applications.length})
        </button>
      </div>

      {/* ===== FIELDS TAB ===== */}
      {activeTab === 'fields' && (
        <div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Form Fields</h3>
            <Button 
              onClick={() => setShowAddField(!showAddField)} 
              className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            >
              <FiPlus className="w-4 h-4 mr-2" /> Add Field
            </Button>
          </div>

          {/* Add Field Form - Only Text Type */}
          {showAddField && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Add New Text Field</h4>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  Text Type Only
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Field Key *</label>
                  <input
                    type="text"
                    placeholder="e.g. fatherName"
                    value={newField.field_key}
                    onChange={(e) => setNewField({ ...newField, field_key: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200 cursor-text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Field Label *</label>
                  <input
                    type="text"
                    placeholder="e.g. Father's Name"
                    value={newField.field_label}
                    onChange={(e) => setNewField({ ...newField, field_label: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200 cursor-text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Placeholder (optional)</label>
                  <input
                    type="text"
                    placeholder="Enter placeholder text"
                    value={newField.field_placeholder || ''}
                    onChange={(e) => setNewField({ ...newField, field_placeholder: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200 cursor-text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Section</label>
                  <select
                    value={newField.section}
                    onChange={(e) => setNewField({ ...newField, section: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
                  >
                    {sections.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-teal-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={newField.is_required}
                      onChange={(e) => setNewField({ ...newField, is_required: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-teal-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-teal-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={newField.is_active}
                      onChange={(e) => setNewField({ ...newField, is_active: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-teal-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                  <div className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    <FiInfo className="inline mr-1" /> Only text fields are supported
                  </div>
                </div>
                <div className="md:col-span-2 flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    onClick={handleAddField} 
                    className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loadingAction?.type === 'add' || !newField.field_key || !newField.field_label}
                  >
                    {loadingAction?.type === 'add' ? (
                      <><FiLoader className="w-4 h-4 animate-spin mr-2" /> Adding...</>
                    ) : (
                      <><FiPlus className="w-4 h-4 mr-2" /> Add Field</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddField(false)} 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Fields List - Grouped by Section */}
          <div className="space-y-6">
            {Object.entries(groupedFields).map(([section, sectionFields]) => {
              const sectionLabel = sections.find(s => s.value === section)?.label || section.replace('_', ' ').toUpperCase();
              return (
                <div key={section} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                    <span>{sectionLabel}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {sectionFields.length} fields
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Key</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Label</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Required</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sectionFields.map((field) => {
                          const isActionLoading = loadingAction?.id === field.id;
                          const isDeleting = loadingAction?.type === 'delete' && loadingAction.id === field.id;
                          const isToggling = loadingAction?.type === 'toggle' && loadingAction.id === field.id;
                          
                          return (
                            <tr key={field.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                              <td className="px-4 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">{field.field_key}</td>
                              <td className="px-4 py-2 text-gray-900 dark:text-white">{field.field_label}</td>
                              <td className="px-4 py-2">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-mono">
                                  {field.field_type}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                {field.is_required ? (
                                  <span className="text-red-500 text-xs font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">Required</span>
                                ) : (
                                  <span className="text-gray-400 text-xs">Optional</span>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => handleToggle(field.id, field.is_active)}
                                  className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isToggling || isDeleting}
                                >
                                  {isToggling ? (
                                    <div className="flex items-center gap-2">
                                      <FiLoader className="w-4 h-4 animate-spin text-teal-500" />
                                      <span className="text-xs text-gray-400">Updating...</span>
                                    </div>
                                  ) : field.is_active ? (
                                    <><FiToggleRight className="w-5 h-5 text-teal-600" /> <span className="text-xs text-teal-600 font-medium">Active</span></>
                                  ) : (
                                    <><FiToggleLeft className="w-5 h-5 text-gray-400" /> <span className="text-xs text-gray-400">Inactive</span></>
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleDelete(field.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    disabled={isDeleting || isToggling}
                                  >
                                    {isDeleting ? (
                                      <FiLoader className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <FiTrash2 className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FiInfo className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No form fields found. Add your first field!</p>
            </div>
          )}
        </div>
      )}

      {/* ===== APPLICATIONS TAB ===== */}
      {activeTab === 'applications' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Applications</h3>
          
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Applied</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {applications.map((app) => {
                  const isActionLoading = loadingAction?.id === app.id;
                  const isStatusUpdating = loadingAction?.type === 'status' && loadingAction.id === app.id;
                  
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                      <td className="px-4 py-3 font-mono text-xs text-teal-600 dark:text-teal-400 font-medium">{app.application_id}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{app.student_name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{app.student_email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || statusColors.pending}`}>
                          {app.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app.application_id, e.target.value)}
                            className="px-2 py-1 border rounded-lg text-xs dark:bg-gray-800 dark:text-white cursor-pointer hover:border-teal-500 transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isStatusUpdating}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setViewingApp(app)}
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          {isStatusUpdating && (
                            <div className="flex items-center gap-1 text-teal-600">
                              <FiLoader className="w-3 h-3 animate-spin" />
                              <span className="text-xs">Updating...</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {applications.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FiUser className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No applications submitted yet.</p>
            </div>
          )}
        </div>
      )}

      {/* View Application Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingApp(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiUser className="text-teal-600" />
                Application Details
              </h3>
              <button 
                onClick={() => setViewingApp(null)} 
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Application ID</p>
                  <p className="font-mono text-teal-600 dark:text-teal-400 font-medium">{viewingApp.application_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${statusColors[viewingApp.status]}`}>
                    {viewingApp.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Student Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{viewingApp.student_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-700 dark:text-gray-300">{viewingApp.student_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-700 dark:text-gray-300">{viewingApp.student_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Applied At</p>
                    <p className="text-gray-700 dark:text-gray-300">{new Date(viewingApp.applied_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <h4 className="font-semibold mb-2 text-sm text-gray-900 dark:text-white">Form Data</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-xs overflow-auto max-h-60">
                  <pre className="text-gray-800 dark:text-gray-200 font-mono">
                    {JSON.stringify(viewingApp.form_data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end sticky bottom-0 bg-white dark:bg-gray-900 py-2">
              <Button 
                onClick={() => setViewingApp(null)} 
                variant="outline" 
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormManagerSection;