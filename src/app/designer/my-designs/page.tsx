/* eslint-disable @typescript-eslint/no-explicit-any */
// app/designer/my-designs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Star,
  MoreVertical,
  Layers,
  Upload,
  AlertCircle,
  X,
  Save
} from 'lucide-react';
import Link from 'next/link';

interface Design {
  id: number;
  title: string;
  description: string;
  preview_image: string;
  category: string;
  status: 'approved' | 'pending' | 'rejected';
  price: number;
  downloads: number;
  likes: number;
  views: number;
  figma_url: string;
  live_url: string;
  tags: string[];
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export default function MyDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  
  // Edit modal state
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    tags: [] as string[],
    figma_url: '',
    live_url: ''
  });
  const [currentTag, setCurrentTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Delete modal state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // View modal state
  const [viewingDesign, setViewingDesign] = useState<Design | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Fetch designs
  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const auth = sessionStorage.getItem('designer_auth');
      if (!auth) return;
      
      const authData = JSON.parse(auth);
      const response = await fetch(`/api/designers/designs?designerId=${authData.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDesigns(data.designs);
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(data.designs.map((d: Design) => d.category))];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default: return null;
    }
  };

  // Handle Edit
  const handleEditClick = (design: Design) => {
    setEditingDesign(design);
    setEditFormData({
      title: design.title,
      description: design.description || '',
      category: design.category,
      price: design.price.toString(),
      tags: design.tags || [],
      figma_url: design.figma_url || '',
      live_url: design.live_url || ''
    });
    setShowEditModal(true);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !editFormData.tags.includes(currentTag.trim())) {
      setEditFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSaveEdit = async () => {
    if (!editingDesign) return;
    
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch(`/api/designers/designs/${editingDesign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFormData.title,
          description: editFormData.description,
          category: editFormData.category,
          price: parseFloat(editFormData.price),
          tags: editFormData.tags,
          figma_url: editFormData.figma_url,
          live_url: editFormData.live_url
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchDesigns();
        setShowEditModal(false);
        setEditingDesign(null);
      } else {
        setError(data.error || 'Failed to update design');
      }
    } catch (error) {
      console.error('Error updating design:', error);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/designers/designs/${deleteId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchDesigns();
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        alert(data.error || 'Failed to delete design');
      }
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Handle View
  const handleViewClick = (design: Design) => {
    setViewingDesign(design);
    setShowViewModal(true);
  };

  const filteredDesigns = designs.filter(design => {
    if (statusFilter !== 'all' && design.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && design.category !== categoryFilter) return false;
    if (searchTerm && !design.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Designs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all your uploaded designs</p>
        </div>
        <Link 
          href="/designer/upload-design"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Upload size={16} /> Upload New Design
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search designs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      {/* Designs Grid */}
      {filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Design Image */}
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                {design.preview_image ? (
                  <img src={design.preview_image} alt={design.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Layers size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                  {getStatusBadge(design.status)}
                </div>
              </div>

              {/* Design Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{design.title}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{design.description}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Download size={12} /> {design.downloads}</span>
                  <span className="flex items-center gap-1"><Star size={12} /> {design.likes}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(design.created_at).toLocaleDateString()}</span>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${design.price}</span>
                    <span className="text-xs text-gray-500 ml-1">one-time</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewClick(design)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Eye size={16} className="text-gray-500" />
                    </button>
                    {design.status === 'pending' && (
                      <button 
                        onClick={() => handleEditClick(design)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit size={16} className="text-gray-500" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteClick(design.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Layers size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No designs found</h3>
          <p className="text-gray-500 dark:text-gray-400">Upload your first design to get started</p>
          <Link href="/designer/upload-design" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload Design
          </Link>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Design</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select
                        value={editFormData.category}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      >
                        <option value="">Select category</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Business">Business</option>
                        <option value="Creative">Creative</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Medical">Medical</option>
                        <option value="Education">Education</option>
                        <option value="Technology">Technology</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (USD)</label>
                      <input
                        type="number"
                        value={editFormData.price}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="Add tags"
                        className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editFormData.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs flex items-center gap-1">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Figma URL</label>
                    <input
                      type="url"
                      value={editFormData.figma_url}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, figma_url: e.target.value }))}
                      placeholder="https://figma.com/file/..."
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={editFormData.live_url}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, live_url: e.target.value }))}
                      placeholder="https://your-demo-link.com"
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Trash2 size={32} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Design</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to delete this design? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && viewingDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{viewingDesign.title}</h2>
                      {getStatusBadge(viewingDesign.status)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Uploaded on {new Date(viewingDesign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                {viewingDesign.preview_image && (
                  <div className="mb-6">
                    <img src={viewingDesign.preview_image} alt={viewingDesign.title} className="w-full max-h-96 object-cover rounded-lg" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
                    <p className="text-gray-900 dark:text-white">{viewingDesign.description || 'No description'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h3>
                      <p className="text-gray-900 dark:text-white">{viewingDesign.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Price</h3>
                      <p className="text-lg font-bold text-blue-600">${viewingDesign.price}</p>
                    </div>
                  </div>

                  {viewingDesign.tags && viewingDesign.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {viewingDesign.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {viewingDesign.figma_url && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Figma URL</h3>
                        <a href={viewingDesign.figma_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                          View in Figma
                        </a>
                      </div>
                    )}
                    {viewingDesign.live_url && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Live Demo</h3>
                        <a href={viewingDesign.live_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                          View Live Demo
                        </a>
                      </div>
                    )}
                  </div>

                  {viewingDesign.status === 'rejected' && viewingDesign.rejection_reason && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                      <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Rejection Reason</h3>
                      <p className="text-sm text-red-600 dark:text-red-300">{viewingDesign.rejection_reason}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {viewingDesign.status === 'pending' && (
                      <button
                        onClick={() => {
                          setShowViewModal(false);
                          handleEditClick(viewingDesign);
                        }}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <Edit size={16} /> Edit Design
                      </button>
                    )}
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}