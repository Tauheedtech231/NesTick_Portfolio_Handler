/* eslint-disable @typescript-eslint/no-explicit-any */
// app/designer/approved-docs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Upload, 
  Image as ImageIcon,
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  Download,
  X,
  FileArchive,
  Image
} from 'lucide-react';

interface ApprovedDesign {
  id: number;
  title: string;
  preview_image: string;
  status: string;
  white_paper: string | null;
  white_paper_filename: string | null;
  instruction_doc: string | null;
  instruction_filename: string | null;
  approved_at: string;
  has_white_paper?: boolean;
  has_instruction_doc?: boolean;
}

export default function ApprovedDocsPage() {
  const router = useRouter();
  const [approvedDesigns, setApprovedDesigns] = useState<ApprovedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<ApprovedDesign | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [designerId, setDesignerId] = useState<number | null>(null);
  const [expandedDesign, setExpandedDesign] = useState<number | null>(null);

  // States for upload form
  const [whitePaperFile, setWhitePaperFile] = useState<File | null>(null);
  const [whitePaperName, setWhitePaperName] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designFileName, setDesignFileName] = useState('');
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [existingPreviewImage, setExistingPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('designer_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        setDesignerId(authData.user?.id);
      } catch (e) {
        console.error('Error parsing auth');
      }
    }
  }, []);

  useEffect(() => {
    if (designerId) {
      fetchApprovedDesigns();
    }
  }, [designerId]);

  const fetchApprovedDesigns = async () => {
    try {
      const response = await fetch(`/api/designers/approved-designs?designer_id=${designerId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setApprovedDesigns(data.designs);
      }
    } catch (error) {
      console.error('Error fetching approved designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleWhitePaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload PDF or DOC/DOCX files only');
        return;
      }
      setWhitePaperFile(file);
      setWhitePaperName(file.name);
    }
  };

  const handleDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload PDF, DOC, DOCX, or ZIP files only');
        return;
      }
      setDesignFile(file);
      setDesignFileName(file.name);
    }
  };

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setPreviewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openUploadModal = (design: ApprovedDesign) => {
    setSelectedDesign(design);
    setExistingPreviewImage(design.preview_image);
    setPreviewImageUrl(design.preview_image);
    setShowUploadModal(true);
    setWhitePaperFile(null);
    setWhitePaperName('');
    setDesignFile(null);
    setDesignFileName('');
    setPreviewImageFile(null);
    setUploadError('');
  };

  const handleUploadDocs = async (designId: number) => {
    if (!whitePaperFile && !designFile && !previewImageFile) {
      setUploadError('Please select at least one file to upload');
      return;
    }

    setUploading(designId);
    setUploadError('');

    try {
      let whitePaperBase64 = null;
      let designFileBase64 = null;
      let previewImageBase64 = null;
      
      if (whitePaperFile) {
        whitePaperBase64 = await fileToBase64(whitePaperFile);
      }
      
      if (designFile) {
        designFileBase64 = await fileToBase64(designFile);
      }
      
      if (previewImageFile) {
        previewImageBase64 = await fileToBase64(previewImageFile);
      }

      const response = await fetch('/api/designers/upload-approved-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          design_id: designId,
          designer_id: designerId,
          white_paper: whitePaperBase64,
          white_paper_filename: whitePaperFile?.name || null,
          design_file: designFileBase64,
          design_filename: designFile?.name || null,
          preview_image: previewImageBase64
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Documents uploaded successfully!');
        setShowUploadModal(false);
        setWhitePaperFile(null);
        setWhitePaperName('');
        setDesignFile(null);
        setDesignFileName('');
        setPreviewImageFile(null);
        setPreviewImageUrl(null);
        fetchApprovedDesigns();
      } else {
        setUploadError(data.error || 'Failed to upload documents');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Network error. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const toggleExpand = (designId: number) => {
    setExpandedDesign(expandedDesign === designId ? null : designId);
  };

  // ✅ Check if both documents are already uploaded
  const hasAllDocs = (design: ApprovedDesign) => {
    return !!(design.white_paper && design.instruction_doc);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approved Designs Documents</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload white paper, design files, and update preview images for your approved designs
        </p>
      </div>

      {/* Designs List */}
      {approvedDesigns.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <CheckCircle size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Approved Designs Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Your designs will appear here once they are approved by the admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedDesigns.map((design) => (
            <div 
              key={design.id} 
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Preview Image */}
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative cursor-pointer" onClick={() => toggleExpand(design.id)}>
                {design.preview_image ? (
                  <img 
                    src={design.preview_image} 
                    alt={design.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/50 rounded-lg px-2 py-1 text-xs text-white">
                  Click to expand
                </div>
              </div>

              {/* Design Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{design.title}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Approved on: {design.approved_at ? new Date(design.approved_at).toLocaleDateString() : 'Recently'}
                </p>

                {/* Document Status */}
                <div className="space-y-2 mb-4">
                  {design.white_paper ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle size={16} />
                      <span>White paper uploaded</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm">
                      <AlertCircle size={16} />
                      <span>White paper pending</span>
                    </div>
                  )}
                  {design.instruction_doc ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle size={16} />
                      <span>Design file uploaded</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm">
                      <AlertCircle size={16} />
                      <span>Design file pending</span>
                    </div>
                  )}
                </div>

                {/* Upload Button - ✅ Disabled if both docs already uploaded */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openUploadModal(design)}
                    disabled={hasAllDocs(design)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      hasAllDocs(design)
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    title={hasAllDocs(design) ? 'All documents already uploaded' : 'Upload / Update documents'}
                  >
                    <Upload size={16} />
                    {hasAllDocs(design) ? 'All Documents Uploaded' : 'Upload / Update Documents'}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedDesign === design.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Uploaded Documents</h4>
                    {design.white_paper && (
                      <div className="mb-2">
                        <a 
                          href={design.white_paper}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          <FileText size={14} />
                          {design.white_paper_filename || 'White Paper'}
                        </a>
                      </div>
                    )}
                    {design.instruction_doc && (
                      <div>
                        <a 
                          href={design.instruction_doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          <FileArchive size={14} />
                          {design.instruction_filename || 'Design File'}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal - ✅ With scrollable content */}
      {showUploadModal && selectedDesign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Upload Documents for: {selectedDesign.title}
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {uploadError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                </div>
              )}

              {/* 1. Current Preview Image Display */}
              {existingPreviewImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Preview Image
                  </label>
                  <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700/30">
                    <img 
                      src={existingPreviewImage} 
                      alt="Current preview" 
                      className="max-h-32 mx-auto rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* 2. Update Preview Image (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Image size={16} className="inline mr-1" /> Update Preview Image (Optional)
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('previewImageUpload')?.click()}
                >
                  <input
                    id="previewImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handlePreviewImageChange}
                    className="hidden"
                  />
                  {previewImageUrl && previewImageFile ? (
                    <div className="relative">
                      <img src={previewImageUrl} alt="New Preview" className="max-h-32 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPreviewImageFile(null); setPreviewImageUrl(existingPreviewImage); }}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload new preview image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF (max 5MB)</p>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
              </div>

              {/* 3. White Paper Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText size={16} className="inline mr-1" /> White Paper / Technical Documentation
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('whitePaperUpload')?.click()}
                >
                  <input
                    id="whitePaperUpload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleWhitePaperChange}
                    className="hidden"
                  />
                  {whitePaperName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{whitePaperName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setWhitePaperFile(null); setWhitePaperName(''); }}
                        className="p-1 hover:bg-red-500/20 rounded cursor-pointer"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FileText size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload white paper</p>
                      <p className="text-xs text-gray-400">PDF, DOC, DOCX (max 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* 4. Design File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileArchive size={16} className="inline mr-1" /> Design File (ZIP/PDF/DOC)
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('designFileUpload')?.click()}
                >
                  <input
                    id="designFileUpload"
                    type="file"
                    accept=".pdf,.doc,.docx,.zip"
                    onChange={handleDesignFileChange}
                    className="hidden"
                  />
                  {designFileName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileArchive size={20} className="text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{designFileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDesignFile(null); setDesignFileName(''); }}
                        className="p-1 hover:bg-red-500/20 rounded cursor-pointer"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FileArchive size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload design file</p>
                      <p className="text-xs text-gray-400">ZIP, PDF, DOC, DOCX (max 10MB)</p>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload your design source files, templates, or additional documentation
                </p>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex gap-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 rounded-b-xl">
              <button
                onClick={() => handleUploadDocs(selectedDesign.id)}
                disabled={uploading === selectedDesign.id}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {uploading === selectedDesign.id ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Upload Documents
                  </>
                )}
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}