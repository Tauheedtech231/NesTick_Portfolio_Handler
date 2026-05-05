/* eslint-disable @next/next/no-img-element */
// app/Portfolio_Handler/design-management/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Tag, 
  DollarSign,
  Link as LinkIcon,
  Figma,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Brush,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  FileText,
  FileArchive,
 
  Share2,
  AlertCircle,
  Maximize2,
  BookOpen,
  Circle,
  FileCheck,
  X
} from 'lucide-react';
import { MainLayout } from '../../components/layout/main-layout';
import Image from 'next/image';

interface Design {
  id: number;
  title: string;
  description: string;
  preview_image: string;
  category: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  designer_id: number;
  designer_name: string;
  designer_email: string;
  created_at: string;
  rejection_reason: string | null;
  figma_url: string;
  live_url: string;
  tags: string[];
  white_paper: string | null;
  white_paper_filename: string | null;
  instruction_doc: string | null;
  instruction_filename: string | null;
}

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ data: string; filename: string; type: string } | null>(null);

  useEffect(() => {
    fetchDesignDetail();
  }, [params.id]);

  const fetchDesignDetail = async () => {
    try {
      const response = await fetch(`/api/admin/designs/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setDesign(data.design);
      } else {
        setError(data.error || 'Design not found');
      }
    } catch (error) {
      console.error('Error fetching design:', error);
      setError('Failed to fetch design details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <span className="cursor-default px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> Approved</span>;
      case 'pending':
        return <span className="cursor-default px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-700 dark:text-yellow-400 text-sm flex items-center gap-2"><Clock size={16} /> Pending</span>;
      case 'rejected':
        return <span className="cursor-default px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-400 text-sm flex items-center gap-2"><XCircle size={16} /> Rejected</span>;
      default: return null;
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (base64Data: string, filename: string, fileType: string = 'application/pdf') => {
    if (!base64Data) return;
    
    try {
      let base64Content = base64Data;
      if (base64Data.includes(',')) {
        base64Content = base64Data.split(',')[1];
      }
      
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const viewDocument = (base64Data: string, filename: string, fileType: string = 'application/pdf') => {
    setPreviewDoc({ data: base64Data, filename, type: fileType });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4 cursor-wait" />
            <p className="text-gray-500 dark:text-gray-400">Loading design details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !design) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <Brush size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">{error || 'Design not found'}</p>
          <button
            onClick={() => router.push('/Portfolio_Handler/design-management')}
            className="cursor-pointer mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Back to Designs
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="cursor-pointer group mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-all"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Designs</span>
        </button>

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN - Image, Description & Documents */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                {design.preview_image ? (
                  <>
                    <div className="relative aspect-video w-full">
                      <Image
                        src={design.preview_image}
                        alt={design.title}
                        fill
                        className={`object-contain transition-opacity duration-300 cursor-pointer ${
                          imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onClick={() => setIsImageModalOpen(true)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute bottom-3 right-3">
                      <button
                        onClick={() => setIsImageModalOpen(true)}
                        className="cursor-pointer p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg text-white transition-all"
                      >
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={64} strokeWidth={1} />
                    <p className="mt-2 text-sm">No preview available</p>
                  </div>
                )}
              </div>

              {/* Title & Status */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {design.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      By {design.designer_name} • #{design.id}
                    </p>
                  </div>
                  {getStatusBadge(design.status)}
                </div>
              </div>

              {/* Description */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={18} /> Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {design.description}
                </p>
              </div>

              {/* Tags */}
              {design.tags && design.tags.length > 0 && (
                <div className="px-5 pb-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Tag size={18} /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {design.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="cursor-default px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* DOCUMENTS SECTION - Bullet Point List with View & Download */}
              {(design.white_paper || design.instruction_doc) && (
                <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileArchive size={18} /> Attached Documents
                  </h3>
                  
                  <div className="space-y-3">
                    {/* White Paper Document */}
                    {design.white_paper && (
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                              <FileText size={20} className="text-purple-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {design.white_paper_filename || 'White Paper.pdf'}
                            </p>
                            <p className="text-xs text-gray-500">Technical Documentation</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                         
                          <button
                            onClick={() => downloadFile(design.white_paper!, design.white_paper_filename || 'white_paper.pdf', 'application/pdf')}
                            className="cursor-pointer p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Instruction Document */}
                    {design.instruction_doc && (
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <FileArchive size={20} className="text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {design.instruction_filename || 'Instructions.pdf'}
                            </p>
                            <p className="text-xs text-gray-500">Instruction Manual / Guide</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                         
                          <button
                            onClick={() => downloadFile(design.instruction_doc!, design.instruction_filename || 'instructions.pdf', 'application/pdf')}
                            className="cursor-pointer p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

               
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Details & Links */}
          <div className="space-y-6">
            {/* Design Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Design Details</h2>
              </div>
              
              <div className="p-5 space-y-4">
                {/* Price */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign size={18} />
                    <span>Price</span>
                  </div>
                  <p className="text-xl font-bold text-purple-600">${design.price.toLocaleString()}</p>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Tag size={18} />
                    <span>Category</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium capitalize">{design.category}</p>
                </div>

                {/* Designer */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User size={18} />
                    <span>Designer</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{design.designer_name}</p>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail size={18} />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${design.designer_email}`} className="text-purple-600 hover:underline text-sm truncate max-w-[160px]">
                      {design.designer_email}
                    </a>
                    <button onClick={() => copyToClipboard(design.designer_email)} className="cursor-pointer p-1 hover:bg-gray-100 rounded transition-all">
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={18} />
                    <span>Submitted</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(design.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Links Section */}
            {(design.figma_url || design.live_url) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
              >
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Links & Resources</h2>
                </div>
                <div className="p-5 space-y-3">
                  {design.figma_url && (
                    <a href={design.figma_url} target="_blank" rel="noopener noreferrer" 
                       className="cursor-pointer flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 transition-all group">
                      <span className="flex items-center gap-3">
                        <Figma size={20} className="text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">View in Figma</span>
                      </span>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-purple-500" />
                    </a>
                  )}
                  {design.live_url && (
                    <a href={design.live_url} target="_blank" rel="noopener noreferrer"
                       className="cursor-pointer flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 transition-all group">
                      <span className="flex items-center gap-3">
                        <LinkIcon size={20} className="text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">Live Demo</span>
                      </span>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Rejection Reason */}
            {design.status === 'rejected' && design.rejection_reason && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-5"
              >
                <div className="flex items-start gap-3">
                  <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Rejection Reason</h3>
                    <p className="text-sm text-red-600 dark:text-red-300">{design.rejection_reason}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && design.preview_image && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-[95vw] max-h-[95vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="cursor-pointer absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
              >
                ✕ Close
              </button>
              <img src={design.preview_image} alt={design.title} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{previewDoc.filename}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadFile(previewDoc.data, previewDoc.filename, previewDoc.type)}
                    className="cursor-pointer p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="cursor-pointer p-2 text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="p-4 h-[70vh] overflow-auto">
                <iframe
                  src={`data:application/pdf;base64,${previewDoc.data.split(',')[1] || previewDoc.data}`}
                  className="w-full h-full rounded-lg"
                  title={previewDoc.filename}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}