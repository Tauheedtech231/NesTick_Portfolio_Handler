// app/Portfolio_Handler/designers/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase,
  Code2,
  Link as LinkIcon,
  ExternalLink,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Palette,
  Figma,
  Eye,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { MainLayout } from '../../components/layout/main-layout';
import Image from 'next/image';

interface Designer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  specialization: string;
  experience: string;
  portfolio: string;
  cv_filename: string;
  cv_url: string;
  bio: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Design {
  id: number;
  title: string;
  description: string;
  preview_image: string;
  category: string;
  price: number;
  status: string;
  figma_url: string;
  live_url: string;
  created_at: string;
}

export default function DesignerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredDesign, setHoveredDesign] = useState<number | null>(null);

  useEffect(() => {
    fetchDesignerDetails();
  }, [params.id]);

  const fetchDesignerDetails = async () => {
    try {
      const [designerRes, designsRes] = await Promise.all([
        fetch(`/api/designers/${params.id}`),
        fetch(`/api/designers/${params.id}/designs`)
      ]);
      
      const designerData = await designerRes.json();
      const designsData = await designsRes.json();
      
      if (designerData.success) {
        setDesigner(designerData.data);
      } else {
        setError(designerData.error || 'Designer not found');
      }
      
      if (designsData.success) {
        setDesigns(designsData.designs || []);
      }
    } catch (error) {
      console.error('Error fetching designer details:', error);
      setError('Failed to fetch designer details');
    } finally {
      setLoading(false);
    }
  };

  const downloadCV = () => {
    if (designer?.cv_url) {
      window.open(designer.cv_url, '_blank');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> Approved</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm flex items-center gap-2"><Clock size={16} /> Pending</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm flex items-center gap-2"><XCircle size={16} /> Rejected</span>;
      default: return null;
    }
  };

  const handleViewDesign = (designId: number) => {
    router.push(`/Portfolio_Handler/design-management/${designId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={48} className="animate-spin text-purple-500" />
        </div>
      </MainLayout>
    );
  }

  if (error || !designer) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <User size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-500">{error || 'Designer not found'}</p>
          <button
            onClick={() => router.push('/Portfolio_Handler/designers')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
          >
            Back to Designers
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Designers
          </button>

          {/* Designer Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <User size={32} className="text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{designer.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{designer.email}</p>
                  </div>
                </div>
                {getStatusBadge(designer.status)}
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-gray-900 dark:text-white">{designer.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="text-gray-900 dark:text-white">{designer.company || 'Freelancer'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Code2 size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Specialization</p>
                    <p className="text-gray-900 dark:text-white">{designer.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-gray-900 dark:text-white">{designer.experience} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Registered On</p>
                    <p className="text-gray-900 dark:text-white">{new Date(designer.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {designer.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-gray-900 dark:text-white">{designer.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              {designer.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                  <p className="text-gray-600 dark:text-gray-300">{designer.bio}</p>
                </div>
              )}

              {/* Portfolio & CV Links */}
              <div className="flex flex-wrap gap-4">
                {designer.portfolio && (
                  <a
                    href={designer.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                  >
                    <LinkIcon size={16} /> View Portfolio <ExternalLink size={14} />
                  </a>
                )}
                {designer.cv_url && (
                  <button
                    onClick={downloadCV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <Download size={16} /> Download CV
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Designs Section - Grid with Hover Effect */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Palette size={20} className="text-purple-500" />
                Designs by {designer.name} ({designs.length})
              </h2>
            </div>

            {designs.length === 0 ? (
              <div className="text-center py-12">
                <Palette size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No designs uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
                {designs.map((design) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={() => setHoveredDesign(design.id)}
                    onMouseLeave={() => setHoveredDesign(null)}
                    onClick={() => handleViewDesign(design.id)}
                    className="relative group cursor-pointer"
                  >
                    {/* Design Card */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      {/* Design Preview Image */}
                      <div className="relative aspect-square bg-gray-200 dark:bg-gray-600">
                        {design.preview_image ? (
                          <img 
                            src={design.preview_image} 
                            alt={design.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Palette size={32} className="text-gray-400" />
                          </div>
                        )}
                        
                        {/* Hover Overlay with View Icon */}
                        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                          hoveredDesign === design.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Eye size={20} className="text-white" />
                            </div>
                            <span className="text-white text-xs font-medium">View Details</span>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                            design.status === 'approved' ? 'bg-green-500 text-white' :
                            design.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {design.status === 'approved' ? 'Approved' : design.status === 'pending' ? 'Pending' : 'Rejected'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Design Title */}
                      <div className="p-2 text-center">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {design.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                          ${design.price}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Responsive Styles */}
      <style jsx>{`
        @media (max-width: 480px) {
          .grid {
            gap: 0.75rem;
          }
        }
      `}</style>
    </MainLayout>
  );
}