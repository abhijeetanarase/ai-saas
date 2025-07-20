import { Template } from '../models/templateModel';

const systemTemplates = [
  {
    name: 'Modern Glass',
    description: 'Glassmorphism, rounded, blue accent, sans-serif',
    style: {
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg,#f0f4ff 0%,#f9e6ff 100%)',
      border: '2px solid #2563eb',
      borderRadius: '1.5rem',
      color: '#18181b',
    },
    previewImage: '',
  },
  {
    name: 'Classic News',
    description: 'Serif, white background, subtle border',
    style: {
      fontFamily: 'Merriweather, serif',
      background: '#fff',
      border: '1px solid #d1d5db',
      borderRadius: '1.5rem',
      color: '#22223b',
    },
    previewImage: '',
  },
  {
    name: 'Minimal Dark',
    description: 'Dark, mono font, no border',
    style: {
      fontFamily: 'Inconsolata, monospace',
      background: 'linear-gradient(135deg,#232526 0%,#414345 100%)',
      border: 'none',
      borderRadius: '1.5rem',
      color: '#f8fafc',
    },
    previewImage: '',
  },
  // --- 10 more visually distinct templates ---
  {
    name: 'Sunset Card',
    description: 'Warm gradient, rounded, bold headline',
    style: {
      fontFamily: 'Poppins, sans-serif',
      background: 'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)',
      border: '2px solid #f59e42',
      borderRadius: '2rem',
      color: '#3d2c29',
    },
    previewImage: '',
  },
  {
    name: 'Emerald Note',
    description: 'Green gradient, soft border, clean sans',
    style: {
      fontFamily: 'Nunito, sans-serif',
      background: 'linear-gradient(135deg,#a8ff78 0%,#78ffd6 100%)',
      border: '2px solid #34d399',
      borderRadius: '1.25rem',
      color: '#065f46',
    },
    previewImage: '',
  },
  {
    name: 'Royal Purple',
    description: 'Purple gradient, elegant serif, white text',
    style: {
      fontFamily: 'Playfair Display, serif',
      background: 'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)',
      border: '2px solid #a78bfa',
      borderRadius: '1.5rem',
      color: '#fff',
    },
    previewImage: '',
  },
  {
    name: 'Oceanic',
    description: 'Blue-green, modern, clean sans-serif',
    style: {
      fontFamily: 'Montserrat, sans-serif',
      background: 'linear-gradient(135deg,#43cea2 0%,#185a9d 100%)',
      border: '2px solid #2563eb',
      borderRadius: '1.5rem',
      color: '#f8fafc',
    },
    previewImage: '',
  },
  {
    name: 'Paper Sheet',
    description: 'Paper white, subtle shadow, classic',
    style: {
      fontFamily: 'Georgia, serif',
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      color: '#22223b',
    },
    previewImage: '',
  },
  {
    name: 'Cyber Night',
    description: 'Dark, neon border, futuristic mono',
    style: {
      fontFamily: 'Fira Mono, monospace',
      background: 'linear-gradient(135deg,#232526 0%,#0f2027 100%)',
      border: '2px solid #0ff',
      borderRadius: '1.5rem',
      color: '#e0e0e0',
    },
    previewImage: '',
  },
  {
    name: 'Peachy',
    description: 'Peach gradient, soft border, playful',
    style: {
      fontFamily: 'Quicksand, sans-serif',
      background: 'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)',
      border: '2px solid #fbbf24',
      borderRadius: '2rem',
      color: '#78350f',
    },
    previewImage: '',
  },
  {
    name: 'Slate Minimal',
    description: 'Slate gray, minimal, mono font',
    style: {
      fontFamily: 'Source Code Pro, monospace',
      background: '#f1f5f9',
      border: '1px solid #64748b',
      borderRadius: '1rem',
      color: '#334155',
    },
    previewImage: '',
  },
  {
    name: 'Sunrise',
    description: 'Bright yellow-orange, rounded, bold',
    style: {
      fontFamily: 'Lato, sans-serif',
      background: 'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)',
      border: '2px solid #f59e42',
      borderRadius: '2rem',
      color: '#78350f',
    },
    previewImage: '',
  },
  {
    name: 'Aqua Card',
    description: 'Aqua gradient, clean, modern',
    style: {
      fontFamily: 'Open Sans, sans-serif',
      background: 'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
      border: '2px solid #06b6d4',
      borderRadius: '1.5rem',
      color: '#134e4a',
    },
    previewImage: '',
  },
  {
    name: 'Rose Elegant',
    description: 'Rose gradient, elegant serif, white text',
    style: {
      fontFamily: 'PT Serif, serif',
      background: 'linear-gradient(135deg,#f857a6 0%,#ff5858 100%)',
      border: '2px solid #f472b6',
      borderRadius: '1.5rem',
      color: '#fff',
    },
    previewImage: '',
  },
];

export async function seedSystemTemplatesIfNeeded() {
  const count = await Template.countDocuments();
  if (count === 0) {
    await Template.insertMany(systemTemplates);
    console.log('Seeded system templates');
  }
} 