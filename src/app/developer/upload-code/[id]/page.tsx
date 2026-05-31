/* eslint-disable @typescript-eslint/no-explicit-any */
// app/developer/upload-code/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, 
  X, 
  Loader2, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  FileArchive,
  Code2,
  Layers,
  Save,
  FolderOpen,
  FileText,
  Eye,
  Download,
  RefreshCw,
  Globe
} from 'lucide-react';

interface Section {
  id?: number;
  section_name: string;
  section_key: string;
  file: File | null;
  fileName: string;
  existingFile?: string;
  existingFileName?: string;
  isUploading?: boolean;
}

interface ExistingData {
  templateId?: number;
  templateName?: string;
  templateDescription?: string;
  templateType?: string;
  templateZipPath?: string;
  templateZipFileName?: string;
  whitePaper?: string;
  whitePaperFileName?: string;
  liveUrl?: string;
  sections?: Section[];
}

export default function UploadCodePage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [developerId, setDeveloperId] = useState<number | null>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [existingData, setExistingData] = useState<ExistingData | null>(null);
  
  // White Paper
  const [whitePaperFile, setWhitePaperFile] = useState<File | null>(null);
  const [whitePaperName, setWhitePaperName] = useState('');
  const [existingWhitePaper, setExistingWhitePaper] = useState<string | null>(null);
  
  // Full template ZIP upload
  const [fullTemplateFile, setFullTemplateFile] = useState<File | null>(null);
  const [fullTemplateName, setFullTemplateName] = useState('');
  const [existingTemplateZip, setExistingTemplateZip] = useState<string | null>(null);
  
  // Sections upload
const [sections, setSections] = useState<Section[]>([
  { section_name: 'Navbar', section_key: 'navbar', file: null, fileName: '' },
  { section_name: 'Hero', section_key: 'hero', file: null, fileName: '' },
  { section_name: 'About', section_key: 'about', file: null, fileName: '' },
  { section_name: 'Courses', section_key: 'courses', file: null, fileName: '' },
  { section_name: 'Faculty', section_key: 'faculty', file: null, fileName: '' },
  { section_name: 'Gallery', section_key: 'gallery', file: null, fileName: '' },
  { section_name: 'Events', section_key: 'events', file: null, fileName: '' },
  { section_name: 'Contact', section_key: 'contact', file: null, fileName: '' },
  { section_name: 'Footer', section_key: 'footer', file: null, fileName: '' },
]);
  
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateType, setTemplateType] = useState<'free'|'paid'>('paid');
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('developer_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        setDeveloperId(authData.user?.id);
      } catch (e) {
        console.error('Error parsing auth');
      }
    }
  }, []);

  useEffect(() => {
    if (developerId && assignmentId) {
      fetchAssignment();
      fetchExistingCode();
    }
  }, [developerId, assignmentId]);

  const fetchAssignment = async () => {
    try {
      const response = await fetch(`/api/developer/assignments?developerId=${developerId}&id=${assignmentId}`);
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        const assignmentData = data.data[0];
        if (assignmentData.status !== 'approved') {
          alert('Only approved designs can upload code');
          router.push('/developer/completed-designs');
          return;
        }
        setAssignment(assignmentData);
        setTemplateName(assignmentData.design_title);
        setTemplateDescription(assignmentData.design_description);
        setLiveUrl(assignmentData.submission_url || '');
      } else {
        router.push('/developer/completed-designs');
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
    }
  };

  const fetchExistingCode = async () => {
    try {
      const response = await fetch(`/api/developer/get-template-code?assignmentId=${assignmentId}&developerId=${developerId}`);
      const data = await response.json();
      if (data.success && data.data) {
        setExistingData(data.data);
        
        // Pre-fill template info
        if (data.data.templateName) setTemplateName(data.data.templateName);
        if (data.data.templateDescription) setTemplateDescription(data.data.templateDescription);
        if (data.data.templateType) setTemplateType(data.data.templateType);
        if (data.data.liveUrl) setLiveUrl(data.data.liveUrl);
        
        // Set existing files
        if (data.data.whitePaper) {
          setExistingWhitePaper(data.data.whitePaper);
          setWhitePaperName(data.data.whitePaperFileName || 'whitepaper.pdf');
        }
        
        if (data.data.templateZipPath) {
          setExistingTemplateZip(data.data.templateZipPath);
          setFullTemplateName(data.data.templateZipFileName || 'template.zip');
        }
        
        // Pre-fill sections with existing data
        if (data.data.sections && data.data.sections.length > 0) {
          const updatedSections = sections.map(section => {
            const existing = data.data.sections.find((s: any) => s.section_key === section.section_key);
            if (existing) {
              return {
                ...section,
                id: existing.id,
                existingFile: existing.storage_path,
                existingFileName: existing.file_name,
                fileName: existing.file_name
              };
            }
            return section;
          });
          setSections(updatedSections);
        }
      }
    } catch (error) {
      console.error('Error fetching existing code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhitePaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      setWhitePaperFile(file);
      setWhitePaperName(file.name);
    }
  };

  const handleFullTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      if (!file.name.endsWith('.zip')) {
        setError('Please upload a ZIP file');
        return;
      }
      setFullTemplateFile(file);
      setFullTemplateName(file.name);
    }
  };

  const handleSectionFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      if (!file.name.endsWith('.zip')) {
        setError('Please upload a ZIP file');
        return;
      }
      const updatedSections = [...sections];
      updatedSections[index] = {
        ...updatedSections[index],
        file: file,
        fileName: file.name,
        existingFile: undefined,
        existingFileName: undefined
      };
      setSections(updatedSections);
    }
  };

  const addCustomSection = () => {
    setSections([
      ...sections,
      { section_name: 'New Section', section_key: `section_${sections.length + 1}`, file: null, fileName: '' }
    ]);
  };

  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  const updateSectionName = (index: number, name: string) => {
    const updatedSections = [...sections];
    updatedSections[index].section_name = name;
    updatedSections[index].section_key = name.toLowerCase().replace(/\s+/g, '_');
    setSections(updatedSections);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!templateName.trim()) {
      setError('Template name is required');
      setSubmitting(false);
      return;
    }

    if (!liveUrl.trim()) {
      setError('Live Demo URL is required');
      setSubmitting(false);
      return;
    }

    try {
      let whitePaperBase64 = null;
      if (whitePaperFile) {
        whitePaperBase64 = await fileToBase64(whitePaperFile);
      }

      let fullTemplateBase64 = null;
      if (fullTemplateFile) {
        fullTemplateBase64 = await fileToBase64(fullTemplateFile);
      }

      const sectionsData = [];
      for (const section of sections) {
        if (section.file) {
          const sectionBase64 = await fileToBase64(section.file);
          sectionsData.push({
            id: section.id,
            section_name: section.section_name,
            section_key: section.section_key,
            file: sectionBase64,
            fileName: section.fileName,
            existingFile: section.existingFile
          });
        } else if (section.existingFile) {
          // Keep existing section
          sectionsData.push({
            id: section.id,
            section_name: section.section_name,
            section_key: section.section_key,
            keepExisting: true,
            existingFile: section.existingFile,
            existingFileName: section.existingFileName
          });
        }
      }

      const response = await fetch('/api/developer/upload-template-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: parseInt(assignmentId),
          developerId: developerId,
          templateName: templateName,
          templateDescription: templateDescription,
          templateType: templateType,
          liveUrl: liveUrl,
          whitePaper: whitePaperBase64,
          whitePaperFileName: whitePaperName,
          fullTemplateFile: fullTemplateBase64,
          fullTemplateFileName: fullTemplateName,
          sections: sectionsData,
          existingTemplateId: existingData?.templateId
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess('✅ Template code uploaded successfully! It will be listed in the marketplace.');
        setTimeout(() => {
          router.push('/developer/completed-designs');
        }, 2000);
      } else {
        setError(data.error || 'Failed to upload template code');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeFullTemplate = () => {
    setFullTemplateFile(null);
    setFullTemplateName(existingTemplateZip ? 'template.zip' : '');
  };

  const removeWhitePaper = () => {
    setWhitePaperFile(null);
    setWhitePaperName(existingWhitePaper ? 'whitepaper.pdf' : '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (!assignment) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/developer/completed-designs"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {existingData?.templateId ? 'Update Template Code' : 'Upload Template Code'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {existingData?.templateId ? 'Update your' : 'Upload your'} complete template or individual section code for: <strong>{assignment.design_title}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Live Demo URL - Editable */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe size={18} className="text-purple-500" />
            Live Demo URL <span className="text-red-500 text-sm">*</span>
          </h2>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            required
            placeholder="https://your-deployed-application.com"
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            You can update the live demo URL if your application has moved to a new location
          </p>
        </div>

        {/* Template Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FolderOpen size={18} className="text-purple-500" />
            Template Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Description
              </label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Type
              </label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as 'free'|'paid')}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* White Paper Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText size={18} className="text-purple-500" />
            White Paper / Documentation
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            {whitePaperName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={24} className="text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{whitePaperName}</span>
                  {existingWhitePaper && !whitePaperFile && (
                    <span className="text-xs text-blue-500">(existing)</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeWhitePaper}
                  className="p-1 hover:bg-red-500/20 rounded"
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            ) : (
              <>
                <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 mb-2">Upload white paper / technical documentation</p>
                <p className="text-xs text-gray-400 mb-4">PDF file (max 10MB)</p>
                <label className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                  Choose PDF
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleWhitePaperChange} 
                    className="hidden" 
                  />
                </label>
              </>
            )}
          </div>
          {existingWhitePaper && !whitePaperFile && (
            <div className="mt-2 flex gap-2">
              <a 
                href={existingWhitePaper} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
              >
                <Eye size={12} /> View existing white paper
              </a>
              <a 
                href={existingWhitePaper} 
                download
                className="text-xs text-green-500 hover:underline flex items-center gap-1"
              >
                <Download size={12} /> Download
              </a>
            </div>
          )}
        </div>

        {/* Full Template ZIP Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileArchive size={18} className="text-purple-500" />
            Full Template ZIP (Optional)
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            {fullTemplateName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileArchive size={24} className="text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{fullTemplateName}</span>
                  {existingTemplateZip && !fullTemplateFile && (
                    <span className="text-xs text-blue-500">(existing)</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeFullTemplate}
                  className="p-1 hover:bg-red-500/20 rounded"
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            ) : (
              <>
                <FileArchive size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 mb-2">Upload complete template as ZIP file</p>
                <p className="text-xs text-gray-400 mb-4">ZIP file containing all template files (max 50MB)</p>
                <label className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                  Choose ZIP File
                  <input 
                    type="file" 
                    accept=".zip" 
                    onChange={handleFullTemplateChange} 
                    className="hidden" 
                  />
                </label>
              </>
            )}
          </div>
          {existingTemplateZip && !fullTemplateFile && (
            <div className="mt-2">
              <a 
                href={existingTemplateZip} 
                download
                className="text-xs text-green-500 hover:underline flex items-center gap-1"
              >
                <Download size={12} /> Download existing template
              </a>
            </div>
          )}
        </div>

        {/* Sections Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-purple-500" />
              Section-wise Code (Optional)
            </h2>
            <button
              type="button"
              onClick={addCustomSection}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 text-sm cursor-pointer"
            >
              <Plus size={14} /> Add Section
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {sections.map((section, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Section Name
                    </label>
                    <input
                      type="text"
                      value={section.section_name}
                      onChange={(e) => updateSectionName(index, e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Key: {section.section_key}</p>
                  </div>
              
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center hover:border-purple-500 transition-colors">
                  {section.fileName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileArchive size={16} className="text-green-500" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">{section.fileName}</span>
                        {section.existingFile && !section.file && (
                          <span className="text-xs text-blue-500">(existing)</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...sections];
                          updated[index] = { ...updated[index], file: null, fileName: section.existingFileName || '' };
                          setSections(updated);
                        }}
                        className="p-1 hover:bg-red-500/20 rounded cursor-pointer"
                      >
                        <X size={12} className="text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Code2 size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 mb-2">Upload ZIP for {section.section_name} section</p>
                      <label className="inline-block px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer text-xs">
                        Choose ZIP
                        <input 
                          type="file" 
                          accept=".zip" 
                          onChange={(e) => handleSectionFileChange(index, e)} 
                          className="hidden" 
                        />
                      </label>
                    </>
                  )}
                </div>
                {section.existingFile && !section.file && (
                  <div className="mt-2">
                    <a 
                      href={section.existingFile} 
                      download
                      className="text-xs text-green-500 hover:underline flex items-center gap-1"
                    >
                      <Download size={12} /> Download existing code
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

       

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Save size={18} /> {existingData?.templateId ? 'Update Template Code' : 'Upload Template Code'}
              </>
            )}
          </button>
          <Link
            href="/developer/completed-designs"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center cursor-pointer"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}