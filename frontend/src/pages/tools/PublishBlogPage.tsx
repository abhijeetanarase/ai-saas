import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { Button } from '../../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import { Edit, Save, Check, Copy, CheckCircle, Megaphone, Link as LinkIcon, ExternalLink, ArrowLeft } from 'lucide-react';
import { publishBlog } from '../../services/apiService';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { useRef } from 'react';

export default function PublishBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [custom, setCustom] = useState({
    title: '',
    coverImage: '',
    accentColor: '#2563eb',
    customCSS: '',
    template: '',
  });
  const [publishing, setPublishing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTopic, setEditedTopic] = useState('');
  const [copied, setCopied] = useState(false);
  const [templatePage, setTemplatePage] = useState(1);
  const [templatesPerPage] = useState(6);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const totalTemplatePages = Math.ceil(totalTemplates / templatesPerPage);
  const [showModal, setShowModal] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  const copyRef = useRef<HTMLInputElement>(null);
  

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      setTemplatesLoading(true);
      try {
        const res = await apiService.get('/templates', { params: { p: templatePage, n: templatesPerPage } });
        setTemplates(res.data.data || []);
        setTotalTemplates(res.data.total || 0);
      } catch {
        setTemplates([]);
        setTotalTemplates(0);
      } finally {
        setTemplatesLoading(false);
      }
    };
    fetchTemplates();
    // eslint-disable-next-line
  }, [templatePage, templatesPerPage]);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await apiService.get(`/blog/${id}`);
        setBlog(data.data.data);
        setCustom({
          title: data.data.data.topic || '',
          coverImage: data.data.data.coverImage || '',
          accentColor: data.data.data.accentColor || '#2563eb',
          customCSS: data.data.data.customCSS || '',
          template: data.data.data.template || '',
        });
        setEditedContent(data.data.data.content || '');
        setEditedTopic(data.data.data.topic || '');
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handlePublish = async () => {
    setPublishing(true);
    const res = await publishBlog(id!, {
      template: custom.template,
      coverImage: custom.coverImage,
      accentColor: custom.accentColor,
      customCSS: custom.customCSS,
      author: blog?.author || {
        name: 'Author Name',
        image: 'https://ui-avatars.com/api/?name=Author&background=2563eb&color=fff&size=128',
      },
    });
    setPublishing(false);
    const publicPath = res.data?.publicPath || `/public/blog/${id}`;
    setPublicUrl(window.location.origin + publicPath);
    setShowModal(true);
    // navigate(publicPath); // Do not auto-navigate
  };

  const handleSaveEdit = async () => {
    setPublishing(true);
    await apiService.put(`/blog/${id}`, {
      content: editedContent,
      topic: editedTopic,
    });
    setBlog((prev: any) => ({ ...prev, content: editedContent, topic: editedTopic }));
    setEditMode(false);
    setPublishing(false);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const selectedTemplate = templates.find(t => t._id === custom.template) || templates[0];
  const authorName = blog?.author?.name || 'Author Name';
  const authorImage = blog?.author?.image || 'https://ui-avatars.com/api/?name=Author&background=2563eb&color=fff&size=128';

  if (loading) return <div className="text-center py-20 text-lg text-gray-500 dark:text-gray-400">Loading...</div>;
  if (!blog) return <div className="text-center py-20 text-red-500 dark:text-red-400">Blog not found</div>;
  if (!templates.length && !templatesLoading) return <div className="text-center py-20 text-red-500 dark:text-red-400">No templates found</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-2">
      <button
        type="button"
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/blogs')}
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 shadow transition-all backdrop-blur-md"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-semibold">Back</span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Template selection + publish */}
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Choose & Publish Blog Template</h1>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Choose a Template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templatesLoading
                ? Array.from({ length: templatesPerPage }).map((_, i) => (
                    <div key={i} className="border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-white/80 dark:bg-gray-900/80 shadow animate-pulse">
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))
                : templates.map((tpl) => {
                   // System template badge logic
                   const systemNames = [
                     'Modern Glass', 'Classic News', 'Minimal Dark', 'Sunset Card', 'Emerald Note', 'Royal Purple', 'Oceanic', 'Paper Sheet', 'Cyber Night', 'Peachy', 'Slate Minimal', 'Sunrise', 'Aqua Card', 'Rose Elegant'
                   ];
                   const isSystem = systemNames.includes(tpl.name);
                   const isSelected = custom.template === tpl._id;
                   return (
                     <label
                       key={tpl._id}
                       className={`relative cursor-pointer group border-2 rounded-xl p-0 transition-all flex flex-col items-stretch justify-between text-center shadow-sm bg-white dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 duration-150 overflow-hidden ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'}`}
                       style={{ minHeight: 180, animation: 'fadeIn .4s' }}
                     >
                       <input
                         type="radio"
                         name="template"
                         value={tpl._id}
                         checked={isSelected}
                         onChange={() => setCustom(c => ({ ...c, template: tpl._id }))}
                         className="hidden"
                       />
                       {/* Mini live preview */}
                       <div
                         className="rounded-t-xl w-full h-16 flex items-center justify-center mb-2 border-b bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900"
                         style={{
                           ...tpl.style,
                           borderRadius: '1rem 1rem 0 0',
                           borderBottom: '1px solid #e5e7eb',
                           fontSize: 15,
                           minHeight: 48,
                           padding: 0,
                           color: tpl.style?.color || '#18181b',
                         }}
                       >
                         <span className="font-bold truncate" style={{ fontFamily: tpl.style?.fontFamily }}>{tpl.name}</span>
                       </div>
                       <div className="flex-1 flex flex-col justify-center items-center px-3 py-2 gap-1">
                         <div className="font-semibold text-gray-900 dark:text-white mb-0.5 truncate flex items-center gap-2 text-base">
                         
                           {isSystem && (
                             <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200 font-medium">System</span>
                           )}
                           {isSelected && (
                             <CheckCircle className="h-5 w-5 text-blue-500 ml-1" />
                           )}
                         </div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{tpl.description}</div>
                       </div>
                       {/* Gradient overlay on hover */}
                       <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.08) 0%,rgba(168,85,247,0.08) 100%)' }} />
                     </label>
                   );
                 })}
            </div>
            <Pagination
              currentPage={templatePage}
              totalPages={totalTemplatePages}
              onPageChange={setTemplatePage}
            />
          </div>
          <Button
            className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900 text-white font-bold text-lg shadow-lg transition-all flex items-center gap-2"
            isLoading={publishing}
            onClick={handlePublish}
            style={{ minWidth: 180 }}
          >
            {publishing ? (
              <span className="flex items-center gap-2"><Save className="h-5 w-5 animate-spin" /> Publishing...</span>
            ) : (
              <span className="flex items-center gap-2"><Megaphone className="h-5 w-5" /> Publish Blog</span>
            )}
          </Button>
        </div>
        {/* Right: Live Preview + Edit Controls */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Live Preview</h2>
          <div className="flex gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => setEditMode((v) => !v)} title={editMode ? 'View' : 'Edit'}>
              {editMode ? <Check className="h-4 w-4 text-green-500" /> : <Edit className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy Content">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            {editMode && (
              <Button variant="primary" size="sm" onClick={handleSaveEdit} isLoading={publishing} title="Save Changes">
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            )}
          </div>
          <div
            className="rounded-lg p-4 w-full max-w-2xl shadow-lg"
            style={{
              ...(selectedTemplate?.style || {}),
              borderColor: custom.accentColor,
              minHeight: 320,
              ...(custom.customCSS ? { boxShadow: '0 0 0 2px ' + custom.accentColor } : {}),
            }}
          >
            {(custom.coverImage || blog?.coverImage) ? (
              <div className="relative mb-4">
                <img src={custom.coverImage || blog?.coverImage} alt="cover" className="w-full h-48 object-cover rounded" />
                <div className="absolute left-4 bottom-4 flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 px-3 py-1 rounded-full shadow backdrop-blur-md">
                  <img src={authorImage} alt="author" className="h-8 w-8 rounded-full border-2 border-blue-500 object-cover" />
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{authorName}</span>
                </div>
              </div>
            ) : (
              <div className="relative mb-4">
                <img src="https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D" alt="cover" className="w-full h-48 object-cover rounded" />
                <div className="absolute left-4 bottom-4 flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 px-3 py-1 rounded-full shadow backdrop-blur-md">
                  <img src={authorImage} alt="author" className="h-8 w-8 rounded-full border-2 border-blue-500 object-cover" />
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{authorName}</span>
                </div>
              </div>
            )}
            {editMode ? (
              <input
                className="w-full border rounded px-4 py-3 mb-4 font-bold text-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={editedTopic}
                onChange={e => setEditedTopic(e.target.value)}
                placeholder="Blog Title"
              />
            ) : (
              <h1 className="text-2xl font-bold mb-2">{blog?.topic || 'Blog Title'}</h1>
            )}
            {editMode ? (
              <textarea
                className="w-full border rounded px-4 py-3 min-h-[300px] text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={editedContent}
                onChange={e => setEditedContent(e.target.value)}
                placeholder="Write your blog content here..."
              />
            ) : (
              <div className="prose max-w-none" style={{ fontFamily: selectedTemplate?.style?.fontFamily }}>
                <ReactMarkdown>{blog?.content || 'Blog content...'}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Publish Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center animate-fadein">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Blog Published!</h2>
            <div className="mb-4 w-full flex flex-col items-center">
              <span className="text-gray-600 dark:text-gray-300 mb-2">Your public blog URL:</span>
              <div className="flex items-center w-full gap-2">
                <div className="relative w-full flex items-center">
                  <input
                    ref={copyRef}
                    type="text"
                    value={publicUrl}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono pr-8"
                    onFocus={e => e.target.select()}
                  />
                  <LinkIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (copyRef.current) {
                      copyRef.current.select();
                      document.execCommand('copy');
                    }
                  }}
                  className="ml-1 px-3 py-2"
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4  px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Open Public Blog
              </a>
            </div>
            <Button className="mt-2" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 