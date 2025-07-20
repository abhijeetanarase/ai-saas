import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';
import type { BlogPost } from '../../types';
import { ArrowLeft } from 'lucide-react';

export default function BlogViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.get(`/blog/${id}`);
        setBlog(res.data.data);
      } catch (err: any) {
        setError('Failed to fetch blog.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const handleSave = async (content: string) => {
    if (!blog) return;
    await apiService.put(`/blog/${blog._id}`, { content });
    setBlog({ ...blog, content });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-500 dark:text-gray-400">Loading blog...</div>;
  }
  if (error || !blog) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 dark:text-red-400">{error || 'Blog not found.'}</div>;
  }

  // UI variables
  const coverImage = blog.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
  const author = blog.author && typeof blog.author === 'object' ? blog.author : { name: 'Author', image: 'https://ui-avatars.com/api/?name=Author&background=2563eb&color=fff&size=128' };
  const date = blog.publishedAt || blog.updatedAt || blog.createdAt;
  const template = blog.template && blog.template.style ? blog.template : { style: { fontFamily: 'serif', background: '#f8fafc', border: 'none', color: '#18181b' } };
  const accentColor = blog.accentColor || '#2563eb';
  const customCSS = blog.customCSS || '';
  let borderStyles: React.CSSProperties = {};
  if (template.style.border) {
    borderStyles.border = template.style.border;
  } else {
    if (template.style.borderWidth) borderStyles.borderWidth = template.style.borderWidth;
    if (template.style.borderStyle) borderStyles.borderStyle = template.style.borderStyle;
    borderStyles.borderRadius = template.style.borderRadius || '1.5rem';
    borderStyles.borderColor = template.style.borderColor || accentColor;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center">
      {/* Hero Cover Section */}
      <div className="w-full relative">
        <img
          src={coverImage}
          alt="cover"
          className="w-full h-[180px] md:h-[260px] object-cover object-center brightness-90 blur-[1px] shadow-2xl"
          style={{ maxHeight: 260 }}
        />
        {/* Author overlay on cover */}
        <div className="absolute left-6 bottom-6 flex items-center gap-4 bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200 dark:border-gray-800">
          <img src={author.image} alt={author.name} className="h-16 w-16 rounded-full border-2 border-blue-500 object-cover shadow-lg" />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900 dark:text-white drop-shadow">{author.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-300 mt-1">{date ? new Date(date).toLocaleDateString() : ''}</span>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
      </div>
      {/* Article Content Section */}
      <main
        className="w-full max-w-3xl px-4 md:px-8 py-12 md:py-16 mt-0 md:-mt-24 bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl backdrop-blur-xl border border-gray-100 dark:border-gray-800"
        style={{
          ...(template.style || {}),
          ...borderStyles,
          minHeight: 320,
          ...(customCSS ? { boxShadow: '0 0 0 2px ' + accentColor } : {}),
          fontFamily: template.style.fontFamily,
        }}
      >
        <button
          type="button"
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/blogs')}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 shadow transition-all backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Back</span>
        </button>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 dark:text-white drop-shadow-sm tracking-tight leading-tight text-center" style={{ fontFamily: template.style.fontFamily }}>{blog.topic }</h1>
        <div className="flex items-center gap-3 mb-8 justify-center">
          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-gray-700 dark:text-gray-200 text-base">Tone: {blog.tone}</span>
          <span className="text-xs text-gray-400 dark:text-gray-400">&bull;</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Length: ~{blog.length} words</span>
        </div>
        <article className="prose prose-lg max-w-none text-lg text-gray-800 dark:text-gray-100 mx-auto leading-relaxed" style={{ fontFamily: template.style.fontFamily }}>
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
} 