'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Save,
  X,
  Filter,
  Download,
  RefreshCw,
  ExternalLink,
  FileText
} from 'lucide-react';

import { MainLayout } from '../components/layout/main-layout'; 

// Define types
interface College {
  id: number;
  name: string;
  email: string;
  website: string;
  city: string;
  country: string;
  phone: string;
  template_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  template_name?: string; // Added for template name display
}

interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  live_url: string;
  type: string;
  created_at: string;
}
/* eslint-disable */

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    city: '',
    country: '',
    phone: '',
    template_id: '',
    is_active: true
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch colleges
      const collegesRes = await fetch('/api/colleges');
      if (!collegesRes.ok) throw new Error('Failed to fetch colleges');
      const collegesData = await collegesRes.json();
      setColleges(collegesData);
      
      // Fetch templates for dropdown
      const templatesRes = await fetch('/api/templates');
      console.log('Templates response:', templatesRes);
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        console.log('Templates data:', templatesData);
        
        // Handle both response formats: {success: true, templates: [...]} or just [...]
        if (templatesData.success && templatesData.templates) {
          setTemplates(templatesData.templates);
        } else if (Array.isArray(templatesData)) {
          setTemplates(templatesData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // Filter colleges based on search and status
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = 
      college.name.toLowerCase().includes(search.toLowerCase()) ||
      college.email.toLowerCase().includes(search.toLowerCase()) ||
      college.city.toLowerCase().includes(search.toLowerCase()) ||
      college.country.toLowerCase().includes(search.toLowerCase()) ||
      college.phone.includes(search);
    
    const matchesStatus = 
      status === 'all' || 
      (status === 'active' && college.is_active) || 
      (status === 'inactive' && !college.is_active);
    
    return matchesSearch && matchesStatus;
  });

  // Get template name by ID
  const getTemplateName = (templateId: number | null) => {
    if (!templateId) return 'No Template';
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : `Template #${templateId}`;
  };

  // Get template by ID
  const getTemplateById = (templateId: number | null) => {
    if (!templateId) return null;
    return templates.find(t => t.id === templateId) || null;
  };

  // Open modal for adding new college
  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      website: '',
      city: '',
      country: '',
      phone: '',
      template_id: '',
      is_active: true
    });
    setErrors({});
    setModalType('add');
    setShowModal(true);
  };

  // Open modal for editing college
  const openEditModal = (college: College) => {
    setSelectedCollege(college);
    setFormData({
      name: college.name,
      email: college.email,
      website: college.website,
      city: college.city,
      country: college.country,
      phone: college.phone,
      template_id: college.template_id?.toString() || '',
      is_active: college.is_active
    });
    setErrors({});
    setModalType('edit');
    setShowModal(true);
  };

  // Open template preview
  const openTemplatePreview = (templateId: number | null) => {
    if (!templateId) return;
    const template = getTemplateById(templateId);
    if (template) {
      setPreviewTemplate(template);
    }
  };

  // Close template preview
  const closeTemplatePreview = () => {
    setPreviewTemplate(null);
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Invalid website URL (must start with http:// or https://)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const url = modalType === 'add' 
        ? '/api/colleges' 
        : `/api/colleges/${selectedCollege?.id}`;
      
      const method = modalType === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          template_id: formData.template_id ? parseInt(formData.template_id) : null
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Operation failed');
      }
      
      setShowModal(false);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
      alert(modalType === 'add' ? 'College added successfully!' : 'College updated successfully!');
    } catch (error) {
      console.error('Error saving college:', error);
      alert(error instanceof Error ? error.message : 'Failed to save college. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/colleges/${deleteId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete college');
      }
      
      setShowDeleteModal(false);
      setDeleteId(null);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
      alert('College deleted successfully!');
    } catch (error) {
      console.error('Error deleting college:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete college. Please try again.');
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/colleges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Export to CSV
  const handleExport = async () => {
    try {
      setExportLoading(true);
      
      const csvData = filteredColleges.map(college => ({
        ID: college.id,
        Name: college.name,
        Email: college.email,
        Website: college.website,
        City: college.city,
        Country: college.country,
        Phone: college.phone,
        'Template Name': getTemplateName(college.template_id),
        Status: college.is_active ? 'Active' : 'Inactive',
        'Created At': new Date(college.created_at).toLocaleDateString(),
        'Updated At': new Date(college.updated_at).toLocaleDateString()
      }));

      const headers = Object.keys(csvData[0]);
      const csv = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => 
          `"${row[header as keyof typeof row]?.toString().replace(/"/g, '""')}"`
        ).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `colleges-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data.');
    } finally {
      setExportLoading(false);
    }
  };

  // Stats
  const stats = {
    total: colleges.length,
    active: colleges.filter(c => c.is_active).length,
    inactive: colleges.filter(c => !c.is_active).length,
    noTemplate: colleges.filter(c => !c.template_id).length
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="min-h-screen bg-white dark:bg-gray-900 p-6 space-y-6 transition-colors duration-300"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              College Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all colleges and their details
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              disabled={exportLoading || filteredColleges.length === 0}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl 
                         bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                         shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              <span>{exportLoading ? 'Exporting...' : 'Export CSV'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl 
                         bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                         shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 
                         transition-all duration-300"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAddModal}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl 
                         bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-[#0B0F19] dark:bg-gray-100  dark:text-gray-900 
                         shadow-sm hover:opacity-90 transition-all duration-300"
            >
              <Plus size={18} />
              <span>Add College</span>
            </motion.button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Colleges</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-200 dark:border-green-700"
          >
            <p className="text-sm text-green-600 dark:text-green-400">Active</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.active}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-700"
          >
            <p className="text-sm text-red-600 dark:text-red-400">Inactive</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.inactive}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-700"
          >
            <p className="text-sm text-yellow-600 dark:text-yellow-400">No Template</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.noTemplate}</p>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search colleges by name, email, city, country, or phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-gray-500 focus:border-transparent 
                           transition-colors duration-300"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <Filter size={18} className="text-gray-500" />
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="  outline-none w-full"
              >
                <option value="all" className='text-[#0B0F19]'>All Status</option>
                <option value="active" className='text-[#0B0F19]'>Active</option>
                <option value="inactive" className='text-[#0B0F19]'>Inactive</option>
              </select>
            </div>
          </div>
        </section>

        {/* Colleges Table */}
        {!loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Contact</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Template</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredColleges.map((college, index) => (
                    <motion.tr
                      key={college.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Building2 size={20} className="text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{college.name}</p>
                            {college.website && (
                              <a 
                                href={college.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <Globe size={12} />
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-500" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">{college.email}</p>
                          </div>
                          {college.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-500" />
                              <p className="text-sm text-gray-700 dark:text-gray-300">{college.phone}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{college.city}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{college.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {getTemplateName(college.template_id)}
                          </span>
                          {college.template_id && (
                            <button
                              onClick={() => openTemplatePreview(college.template_id)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <FileText size={10} />
                              View Details
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(college.id, college.is_active)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            college.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {college.is_active ? (
                            <>
                              <CheckCircle size={12} className="mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} className="mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditModal(college)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 
                                     hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openDeleteModal(college.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 
                                     hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              
              {filteredColleges.length === 0 && (
                <div className="text-center py-12">
                  <Building2 size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {search || status !== 'all' ? 'No colleges match your search criteria' : 'No colleges found. Add your first college!'}
                  </p>
                  {!search && status === 'all' && (
                    <button
                      onClick={openAddModal}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-[#0B0F19]   rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Add College
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading colleges...</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {modalType === 'add' ? 'Add New College' : 'Edit College'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      College Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.name 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-gray-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-gray-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.website 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-gray-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent`}
                      placeholder="https://example.com"
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Template
                    </label>
                    <select
                      name="template_id"
                      value={formData.template_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    {formData.template_id && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Selected: {templates.find(t => t.id === parseInt(formData.template_id))?.name}
                        </span>
                        <a
                          href={templates.find(t => t.id === parseInt(formData.template_id))?.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={10} />
                          Preview
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Active College
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-[#0B0F19] dark:bg-gray-100  dark:text-gray-900 hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <Save size={18} />
                      {modalType === 'add' ? 'Add College' : 'Update College'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Template Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {previewTemplate.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{previewTemplate.type}</p>
                  </div>
                  <button
                    onClick={closeTemplatePreview}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {previewTemplate.image && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
  <Image
    src={previewTemplate.image}
    alt={previewTemplate.name}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 100vw"
  />
</div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{previewTemplate.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Type</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {previewTemplate.type}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Created</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(previewTemplate.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {previewTemplate.live_url && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href={previewTemplate.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink size={16} />
                        View Live Demo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <Trash2 className="text-red-600 dark:text-red-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete College</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone.</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this college? All associated data will be permanently removed.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Delete College
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
}