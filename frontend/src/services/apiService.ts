import type { BlogPost, ResumeAnalysis, GeneratedImage } from '../types';
import apiService from "./api"



export const api = {
  // Blog Generator
  generateBlog: async (topic: string, tone: string, length: number): Promise<BlogPost> => {
    // Simulate AI blog generation
    const res  = await apiService.post('/blog', { topic, tone, length });
    
    return  res.data.blog;
  },

  // Resume Analyzer
  analyzeResume: async (file: File): Promise<ResumeAnalysis> => {
    // Simulate resume analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      id: Date.now().toString(),
      fileName: file.name,
      atsScore: Math.floor(Math.random() * 40) + 60, // 60-100
      issues: [
        'Missing keywords relevant to the job description',
        'Inconsistent date formatting',
        'Contact information could be more prominent',
      ],
      suggestions: [
        'Add more industry-specific keywords',
        'Use a consistent date format (MM/YYYY)',
        'Move contact information to the top',
        'Use bullet points for better readability',
      ],
      createdAt: new Date().toISOString(),
      userId: '1',
    };
  },

  // Image Generator
  generateImages: async (prompt: string, style: string, resolution: string, count: number): Promise<GeneratedImage[]> => {
    // Simulate AI image generation
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const images: GeneratedImage[] = [];
    for (let i = 0; i < count; i++) {
      images.push({
        id: `${Date.now()}-${i}`,
        prompt,
        style,
        resolution,
        imageUrl: `https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=${resolution.split('x')[0]}`,
        createdAt: new Date().toISOString(),
        userId: '1',
      });
    }
    
    return images;
  },

  // User data
  getUserBlogs: async (): Promise<BlogPost[]> => {
    const stored = localStorage.getItem('userBlogs');
    return stored ? JSON.parse(stored) : [];
  },

  getUserResumes: async (): Promise<ResumeAnalysis[]> => {
    const stored = localStorage.getItem('userResumes');
    return stored ? JSON.parse(stored) : [];
  },

  getUserImages: async (): Promise<GeneratedImage[]> => {
    const stored = localStorage.getItem('userImages');
    return stored ? JSON.parse(stored) : [];
  },

  getBlogs: async (params = {}) => {
    const res = await apiService.get('/blog', { params });
    return res.data;
  },
};

export const publishBlog = async (id: string, data: any) => {
  const res = await apiService.put(`/blog/${id}/publish`, data);
  return res.data;
};

export const getBlog = async (id: string) => {
  const res = await apiService.get(`/blog/${id}`);
  return res.data;
};

export const getBlogs = async (params = {}) => {
  const res = await apiService.get('/blog', { params });
  return res.data;
};

export const getTemplates = async (params = {}) => {
  const res = await apiService.get('/templates', { params });
  return res.data;
};

export const deleteTemplate = async (id: string) => {
  const res = await apiService.delete(`/templates/${id}`);
  return res.data;
};

export const updateTemplate = async (id: string, data: any) => {
  const res = await apiService.put(`/templates/${id}`, data);
  return res.data;
};

export const createTemplate = async (data: any) => {
  const res = await apiService.post('/templates', data);
  return res.data;
};

export const getBlogByPublicPath = async (author: string, topic: string) => {
  const res = await apiService.get(`/blog/public/${author}/${topic}`);
  return res.data;
};

export default api;