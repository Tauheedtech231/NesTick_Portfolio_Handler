/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/NavbarSection.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiCheck, FiRefreshCw,
  FiInfo, FiTrash2, FiUpload
} from 'react-icons/fi';

interface NavbarSectionProps {
  college: College;
  templateId?: number;
}

interface NavbarFormData {
  logo: string;
}

const defaultFormData: NavbarFormData = {
  logo: ''
};

export function NavbarSection({ college, templateId }: NavbarSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<NavbarFormData>(defaultFormData);
  const [lastUpdated, setLastUpdated] = useState('');

  const getActiveTemplateId = () => {
    return templateId || (college as any).template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt((college as any).id);
  };

  // ✅ Load logo from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Navbar&college_id=${collegeId}&_=${timestamp}`;
      
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
          
          if (dbContent && dbContent.logo) {
            setFormData({ logo: dbContent.logo });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load navbar logo:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [templateId, college.template_id, college.id]);

  // ✅ Save logo to database
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
          section_name: "Navbar",
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
        alert('Failed to save logo');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save logo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Handle logo change (upload new)
  const handleLogoChange = (fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      // If it's a string, it means remove was called
      setFormData(prev => ({ ...prev, logo: fileOrString }));
      return;
    }
    // New file upload
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(fileOrString);
  };

  // ✅ Manual remove logo with confirmation
  const handleRemoveLogo = () => {
    if (confirm('Are you sure you want to remove the logo?')) {
      setFormData(prev => ({ ...prev, logo: '' }));
    }
  };

  useEffect(() => {
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-40 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading navbar logo...</p>
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
              <p className="font-medium">Logo Saved Successfully!</p>
              <p className="text-sm text-green-100">Logo updated in database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Navbar Logo</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your navbar logo</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2 cursor-pointer" 
              onClick={() => loadFromDatabase(true)}
            >
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Logo
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="cursor-pointer">
                  <FiX className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
                  <FiSave className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Logo'}
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
                  Upload a new logo or remove existing one.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logo Upload Section */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Logo Image</h3>
            {isEditing && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {formData.logo ? 'Current logo set' : 'No logo set'}
                </span>
              </div>
            )}
          </div>

          {/* Current Logo Display */}
          {formData.logo && (
            <div className="mb-4 flex items-center gap-4 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200">
              <img 
                src={formData.logo} 
                alt="Current Logo" 
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Logo</p>
                <p className="text-xs text-gray-400">Click "Edit Logo" to change</p>
              </div>
            </div>
          )}

          {!formData.logo && (
            <div className="mb-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 text-center">
              <p className="text-sm text-gray-400">No logo uploaded yet</p>
            </div>
          )}

          {/* Upload Section */}
          <div className="flex flex-col items-center justify-center">
            <UploadImage
              value={formData.logo}
              onChange={handleLogoChange}
              onRemove={() => {
                if (confirm('Are you sure you want to remove the logo?')) {
                  setFormData(prev => ({ ...prev, logo: '' }));
                }
              }}
              aspectRatio="square"
              disabled={!isEditing}
            />
            
            {/* ✅ Manual Remove Button - Shows when logo exists and in edit mode */}
            {isEditing && formData.logo && (
              <button
                onClick={handleRemoveLogo}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium shadow-md hover:shadow-lg"
              >
                <FiTrash2 className="w-4 h-4" />
                Remove Logo
              </button>
            )}

            {/* Upload hint when in edit mode */}
            {isEditing && (
              <p className="mt-2 text-xs text-gray-400">
                Click on the upload area above to select a new logo
              </p>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {formData.logo && (
          <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200">
              <img 
                src={formData.logo} 
                alt="Logo Preview" 
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Logo will appear here</p>
                <p className="text-xs text-gray-400">in the navbar</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NavbarSection;