// app/types/landing.ts

export interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
}

export interface BuyNowFormData {
  name: string;
  college: string;
  email: string;
  phone: string;
  designation: string;
  studentCount: string;
  selectedPlan: string;
  templateName: string;
  requirements: string;
  timeline: string;
  hearAbout: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}