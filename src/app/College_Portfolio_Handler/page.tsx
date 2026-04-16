/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from 'fs';
import path from 'path';
import Dashboard from '../components/Dashboard';
import { CollegeData } from '../lib/gsap';


interface RawData {
  college: {
    id: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    mission: string;
    vision: string;
    logo?: string;
    coverImage?: string;
    contact: {
      email: string;
      phone: string;
      address: string;
      website?: string;
      socialMedia?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
      };
    };
  };
  faculty: Array<{
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    image?: string;
    bio: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    image?: string;
    location: string;
    type: 'event' | 'announcement';
    featured?: boolean;
  }>;
  gallery: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    image?: string;
    category: string;
  }>;
  courses: Array<{
    id: string;
    name: string;
    duration: string;
    department: string;
    description: string;
    image?: string;
    credits: number;
    syllabus?: string;
    feeStructure?: string;
  }>;
}

// src/app/College_Portfolio_Handler/page.tsx

export default async function Page() {
  const jsonPath = path.join(process.cwd(), 'public', 'data', 'portfolioData.json');
  const jsonData = await fs.readFile(jsonPath, 'utf-8');
  const rawData = JSON.parse(jsonData) as RawData;

  // Solution: College object ko 'as any' bana do temporarily
  const collegeData = {
    college: {
      id: rawData.college.id,
      name: rawData.college.name,
      shortDescription: rawData.college.shortDescription,
      longDescription: rawData.college.longDescription,
      mission: rawData.college.mission,
      vision: rawData.college.vision,
      logo: rawData.college.logo,
      coverImage: rawData.college.coverImage,
      contact: rawData.college.contact,
      template_id: null,
    } as any, // ✅ Temporary fix
    faculty: rawData.faculty.map((f, index) => ({
      ...f,
      order: index + 1
    })),
    events: rawData.events.map(e => ({
      ...e,
      featured: e.featured || false
    })),
    gallery: rawData.gallery.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.date,
      image: item.image || '',
      category: item.category === 'photo' ? 'photo' : 'achievement'
    })),
    courses: rawData.courses,
    flexibleSections: []
  } as CollegeData; // 👈 Final type assertion

  return (
    <div className="min-h-screen">
      <Dashboard initialData={collegeData} />
    </div>
  );
}