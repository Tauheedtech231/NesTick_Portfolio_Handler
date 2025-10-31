// types/theme.ts
export interface Theme {
  id: string;
  name: string;
  description: string;
  image: string; // base64 string
  zipFile: string;
  liveUrl?: string;
  createdAt: string;
}

export interface ThemeFormData {
  name: string;
  description: string;
  image: File | null;
  zipFile: File | null;
  liveUrl: string;
}
export interface College {
  id: string;
  name: string;
  representativeName: string;
  logo: string;
  status: 'active' | 'inactive';
  theme: 'modern' | 'minimal' | 'classic' | 'elegant' | 'bold';
createdAt?: string | Date;   // ✅ allow both
  updatedAt?: string | Date; 

  // ✅ Optional nested structure
 modules?: {
  about?: boolean;
  faculty?: boolean;
  events?: boolean;
  gallery?: boolean;
  achievements?: boolean;
  [key: string]: boolean | undefined; // ✅ allows dynamic string keys
};

}


export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetCollege: string; // 'all' or college.id
  createdAt: string | Date;
}



