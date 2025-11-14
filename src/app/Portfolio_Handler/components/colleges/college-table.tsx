// components/colleges/college-table.tsx
'use client';
import { College } from '@/app/types';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Eye, EyeOff, Check, X, User, Building, Mail, Phone, Calendar, DollarSign, Tag, Key } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EditCollegeModal } from './edit-college-modal';
import Image from 'next/image';
/* eslint-disable */

interface CollegeTableProps {
  colleges: College[];
  onEdit: (id: string, collegeData: Partial<College>) => void;
  onDelete: (id: string) => void;
  onAddCollege: (college: College) => void;
}

interface RequestedCollege {
  id: string;
  name: string;
  collegeName: string;
  email: string;
  whatsapp: string;
  selectedPlan: string;
  themeName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  themeType?: 'free' | 'paid';
}

type CollegePlan = 'basic' | 'professional' | 'enterprise';

export function CollegeTable({ colleges, onEdit, onDelete, onAddCollege }: CollegeTableProps) {
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [requestedColleges, setRequestedColleges] = useState<RequestedCollege[]>([]);
  const [activeTab, setActiveTab] = useState<'colleges' | 'requests'>('colleges');
  const [availableThemes, setAvailableThemes] = useState<any[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);

  const handleStatusToggle = (id: string, currentStatus: 'active' | 'inactive') => {
    onEdit(id, { status: currentStatus === 'active' ? 'inactive' : 'active' });
  };

  // Generate random password
  const generatePassword = (): string => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Send email with credentials
  const sendCredentialsEmail = async (email: string, password: string, collegeName: string, adminName: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/send-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          collegeName,
          adminName,
          email,
          password,
           
          
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending credentials email:', error);
      return false;
    }
  };

  // Save college admin to localStorage
// Save college admin to localStorage
const saveCollegeAdmin = (email: string, password: string, collegeName: string, adminName: string, collegeId: string) => {
  try {
    // Safely get and parse existing admins
    const existingAdminsStr = localStorage.getItem('college_admin');
    let existingAdmins: any[] = [];
    
    if (existingAdminsStr) {
      try {
        const parsed = JSON.parse(existingAdminsStr);
        // Ensure it's an array
        if (Array.isArray(parsed)) {
          existingAdmins = parsed;
        } else {
          console.warn('college_admin data is not an array, resetting to empty array');
          existingAdmins = [];
        }
      } catch (parseError) {
        console.error('Error parsing college_admin data:', parseError);
        existingAdmins = [];
      }
    }

    const newAdmin = {
      email,
      password,
      collegeName,
      adminName,
      collegeId,
      createdAt: new Date().toISOString()
    };

    // Check if admin already exists
    const existingIndex = existingAdmins.findIndex((admin: any) => admin.email === email);
    if (existingIndex >= 0) {
      existingAdmins[existingIndex] = newAdmin;
    } else {
      existingAdmins.push(newAdmin);
    }

    localStorage.setItem('college_admin', JSON.stringify(existingAdmins));
    console.log('College admin saved to localStorage:', newAdmin);
  } catch (error) {
    console.error('Error saving college admin to localStorage:', error);
    // Initialize with empty array if there's an error
    localStorage.setItem('college_admin', JSON.stringify([{
      email,
      password,
      collegeName,
      adminName,
      collegeId,
      createdAt: new Date().toISOString()
    }]));
  }
};

  // Load available themes from localStorage
  useEffect(() => {
    const loadThemes = () => {
      try {
        const storedThemes = localStorage.getItem('themes');
        if (storedThemes) {
          setAvailableThemes(JSON.parse(storedThemes));
        }
      } catch (error) {
        console.error('Error loading themes:', error);
      }
    };

    loadThemes();
  }, []);

  // Load requested colleges from localStorage
  useEffect(() => {
    const loadRequestedColleges = () => {
      try {
        const stored = localStorage.getItem('requested_college');
        if (stored) {
          const requests = JSON.parse(stored);
          const enhancedRequests = requests.map((req: RequestedCollege) => {
            const theme = availableThemes.find(t => t.name === req.themeName);
            return {
              ...req,
              themeType: theme?.type || 'paid',
              status: req.status || 'pending'
            };
          });
          setRequestedColleges(enhancedRequests);
        }
      } catch (error) {
        console.error('Error loading requested colleges:', error);
      }
    };

    loadRequestedColleges();
    
    const handleStorageChange = () => {
      loadRequestedColleges();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [availableThemes]);

  // Update localStorage when requested colleges change
  useEffect(() => {
    if (requestedColleges.length > 0) {
      localStorage.setItem('requested_college', JSON.stringify(requestedColleges));
    }
  }, [requestedColleges]);

  // Check if college name already exists
  const isDuplicateCollege = (collegeName: string): boolean => {
    return colleges.some(college => 
      college.name.toLowerCase() === collegeName.toLowerCase()
    );
  };

  const handleApproveRequest = async (request: RequestedCollege) => {
    if (isDuplicateCollege(request.collegeName)) {
      alert(`College "${request.collegeName}" is already in the approved list.`);
      return;
    }

    setIsSendingEmail(request.id);

    try {
      // Generate password
      const generatedPassword = generatePassword();

      // Create new college
      const newCollege = {
        id: `college-${Date.now()}`,
        name: request.collegeName,
        logo: '',
        representativeName: request.name,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        email: request.email,
        phone: request.whatsapp,
        plan: request.selectedPlan as CollegePlan,
        theme: request.themeName,
        themeType: request.themeType || 'paid',
      } as unknown as College;

      // Save college admin credentials
      saveCollegeAdmin(request.email, generatedPassword, request.collegeName, request.name, newCollege.id);

      // Send email with credentials
      const emailSent = await sendCredentialsEmail(
        request.email, 
        generatedPassword, 
        request.collegeName, 
        request.name
      );

      if (!emailSent) {
        console.warn('Failed to send credentials email, but college was still approved');
      }

      // Add college to approved list
      onAddCollege(newCollege);

      // Update request status
      setRequestedColleges(prev => 
        prev.map(req => 
          req.id === request.id ? { ...req, status: 'approved' } : req
        )
      );

      console.log('College approved and credentials sent:', {
        college: newCollege,
        email: request.email,
        password: generatedPassword
      });

    } catch (error) {
      console.error('Error approving college:', error);
      alert('Error approving college. Please try again.');
    } finally {
      setIsSendingEmail(null);
    }
  };

  const handleRejectRequest = (id: string) => {
    setRequestedColleges(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'rejected' } : req
      )
    );
  };

  const handleDeleteRequest = (id: string) => {
    setRequestedColleges(prev => prev.filter(req => req.id !== id));
  };

  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Rejected' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planConfig: Record<CollegePlan, { color: string; label: string }> = {
      basic: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Basic' },
      professional: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: 'Professional' },
      enterprise: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'Enterprise' }
    };

    const config = planConfig[plan as CollegePlan] || planConfig.basic;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getThemeTypeBadge = (themeType: 'free' | 'paid' = 'paid') => {
    const typeConfig = {
      free: { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: Tag,
        label: 'Free'
      },
      paid: { 
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        icon: DollarSign,
        label: 'Paid'
      }
    };

    const config = typeConfig[themeType];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const displayedRequests = requestedColleges;

  return (
    <>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('colleges')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
            activeTab === 'colleges'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Approved Colleges ({colleges.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
            activeTab === 'requests'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          College Requests ({requestedColleges.length})
        </button>
      </div>

      {/* Approved Colleges Table */}
      {activeTab === 'colleges' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-colors duration-300 border border-gray-200 dark:border-gray-700">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {['College', 'Representative', 'Status', 'Theme Type', 'Created', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {colleges.map((college, index) => (
                  <motion.tr
                    key={college.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {college.logo && (
                          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3 border border-gray-300 dark:border-gray-600">
                            <Image
                              src={college.logo}
                              alt={college.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {college.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {college.representativeName}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(college.id, college.status)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition border ${
                          college.status === 'active'
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {college.status === 'active' ? (
                          <Eye size={12} className="mr-1" />
                        ) : (
                          <EyeOff size={12} className="mr-1" />
                        )}
                        {college.status}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      {getThemeTypeBadge((college as any).themeType as 'free' | 'paid')}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(college.createdAt ?? '').toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium space-x-3 flex items-center">
                      <button
                        onClick={() => setEditingCollege(college)}
                        className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(college.id)}
                        className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {colleges.map((college, index) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-3">
                  {college.logo && (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                      <Image
                        src={college.logo}
                        alt={college.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {college.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {college.representativeName}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-sm mb-3">
                  <div className="flex space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        college.status === 'active'
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      {college.status}
                    </span>
                    
                    {getThemeTypeBadge((college as any).themeType as 'free' | 'paid')}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {new Date(college.createdAt ?? '').toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingCollege(college)}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(college.id)}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Requested Colleges Table */}
      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-colors duration-300 border border-gray-200 dark:border-gray-700">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {['Requester', 'College', 'Contact', 'Plan', 'Theme', 'Type', 'Submitted', 'Status', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {displayedRequests.map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                          <User size={14} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block">
                            {request.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {request.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building size={14} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {request.collegeName}
                          {request.status === 'approved' && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                              ✓ Approved
                            </span>
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Mail size={12} className="mr-1" />
                          {request.email}
                        </div>
                        <div className="flex items-center">
                          <Phone size={12} className="mr-1" />
                          {request.whatsapp}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getPlanBadge(request.selectedPlan)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {request.themeName}
                    </td>

                    <td className="px-6 py-4">
                      {getThemeTypeBadge(request.themeType)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium flex flex-wrap items-center gap-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request)}
                            disabled={isSendingEmail === request.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 rounded-lg transition text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve Request"
                          >
                            {isSendingEmail === request.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Check size={14} />
                                <span>Approve</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={isSendingEmail === request.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/50 rounded-lg transition text-xs sm:text-sm disabled:opacity-50"
                            title="Reject Request"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {request.status === 'approved' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-xs">
                          <Key size={12} />
                          Credentials Sent
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        disabled={isSendingEmail === request.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition text-xs sm:text-sm disabled:opacity-50"
                        title="Delete Request"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {displayedRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {request.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.collegeName}
                        {request.status === 'approved' && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                            ✓ Approved
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail size={12} className="mr-2" />
                    {request.email}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone size={12} className="mr-2" />
                    {request.whatsapp}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {getPlanBadge(request.selectedPlan)}
                      {getThemeTypeBadge(request.themeType)}
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      <Calendar size={10} className="inline mr-1" />
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {request.themeName}
                  </span>
                  
                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveRequest(request)}
                          disabled={isSendingEmail === request.id}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition disabled:opacity-50"
                          title="Approve"
                        >
                          {isSendingEmail === request.id ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={isSendingEmail === request.id}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition disabled:opacity-50"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                        <Key size={12} className="mr-1" />
                        Sent
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteRequest(request.id)}
                      disabled={isSendingEmail === request.id}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {displayedRequests.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <User size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No college requests found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  College requests will appear here when users submit them through the landing page.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {editingCollege && (
        <EditCollegeModal
          college={editingCollege}
          isOpen={!!editingCollege}
          onClose={() => setEditingCollege(null)}
          onSave={(collegeData) => {
            onEdit(editingCollege.id, collegeData);
            setEditingCollege(null);
          }}
        />
      )}
    </>
  );
}