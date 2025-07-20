import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogByPublicPath } from '../services/apiService';
import ReactMarkdown from 'react-markdown';

export default function PublicBlogPage() {
  const { author: authorSlug, topic: topicSlug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBlogByPublicPath(authorSlug!, topicSlug!);
        setBlog(res.data);
      } catch {
        setError('Blog not found or unpublished.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [authorSlug, topicSlug]);

  if (loading) return <div className="text-center py-20 text-lg text-gray-500 dark:text-gray-400">Loading...</div>;
  if (error || !blog || !blog.isPublic) return <div className="text-center py-20 text-red-500 dark:text-red-400">{error || 'Blog not found or unpublished.'}</div>;

  const template = blog.template && blog.template.style ? blog.template : { style: { fontFamily: 'serif', background: '#f8fafc', border: 'none', color: '#18181b' } };
  const accentColor = blog.accentColor || '#2563eb';
  const customCSS = blog.customCSS || '';
  const author = blog.author && typeof blog.author === 'object' ? blog.author : { name: 'Author Name', image: 'https://ui-avatars.com/api/?name=Author&background=2563eb&color=fff&size=128' };
  const coverImage = blog.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
  const date = blog.publishedAt || blog.updatedAt || blog.createdAt;

  // Extract border styles from template.style
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
        {/* Byline (no author image) */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-medium text-gray-700 dark:text-gray-200 text-base">By {author.name}</span>
          <span className="text-xs text-gray-400 dark:text-gray-400">&bull;</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
        </div>
        {/* Article Content */}
        <article className="prose prose-lg max-w-none text-lg text-gray-800 dark:text-gray-100 mx-auto leading-relaxed" style={{ fontFamily: template.style.fontFamily }}>
          <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => <h2 {...props} className="mt-10 mb-4 text-2xl font-bold text-blue-700 dark:text-blue-300" />,
              h3: ({ node, ...props }) => <h3 {...props} className="mt-8 mb-3 text-xl font-semibold text-blue-600 dark:text-blue-400" />,
              blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-blue-400 pl-4 italic text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-gray-800/40 py-2 my-6" />,
              ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-6 mb-6" />,
              ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-6 mb-6" />,
              a: ({ node, ...props }) => <a {...props} className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" />,
              img: ({ node, ...props }) => <img {...props} className="rounded-lg shadow my-4 mx-auto" />,
              code: ({ node, ...props }) => <code {...props} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" />,
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </article>
      </main>
      <footer className="w-full text-center py-8 text-gray-400 text-xs opacity-80 select-none mt-8">
        &copy; {new Date().getFullYear()} Max AI Blog Platform &mdash; Powered by AI
      </footer>
    </div>
  );
} 