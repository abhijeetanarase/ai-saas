import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from  '../../services/api'

import { FileText, Download, Copy, Save, Wand2, Edit, View, Check, ArrowLeft, Megaphone } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/apiService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DropDown } from '../../components/ui/DropDown';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import type { BlogPost } from '../../types';
import jsPDF from 'jspdf';
import { Skeleton } from '../../components/ui/Skeleton';
import { getBlogs } from '../../services/apiService';


const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'formal', label: 'Formal' },
  { value: 'informal', label: 'Informal' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'sarcastic', label: 'Sarcastic' },
  { value: 'optimistic', label: 'Optimistic' },
  { value: 'pessimistic', label: 'Pessimistic' },
  { value: 'encouraging', label: 'Encouraging' },
  { value: 'sympathetic', label: 'Sympathetic' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'educational', label: 'Educational' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'respectful', label: 'Respectful' },
  { value: 'playful', label: 'Playful' },
  { value: 'technical', label: 'Technical' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'luxurious', label: 'Luxurious' },
  { value: 'bold', label: 'Bold' },
];


const lengthOptions = [
  { value: '500', label: 'Short (500 words)' },
  { value: '1000', label: 'Medium (1000 words)' },
  { value: '1500', label: 'Long (1500 words)' },
  { value: '2000', label: 'Very Long (2000+ words)' },
];

export function BlogGeneratorPage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<BlogPost | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [userBlogs, setUserBlogs] = useState<BlogPost[]>( []);
  const [copied, setCopied] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // Simple form state
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [length, setLength] = useState('');
  const [errors, setErrors] = useState<{ topic?: string; tone?: string; length?: string }>({});

  const validate = () => {
    const newErrors: { topic?: string; tone?: string; length?: string } = {};
    if (!topic.trim()) newErrors.topic = 'Topic is required';
    if (!tone) newErrors.tone = 'Tone is required';
    if (!length) newErrors.length = 'Length is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsGenerating(true);
    try {
      const blog = await api.generateBlog(topic, tone, Number(length));
      setGeneratedBlog(blog);
      setEditedContent(blog.content ?? '');
      setEditMode(false);
    } catch (error) {
      console.error('Failed to generate blog:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBlog = async() => {
    if (!generatedBlog) return;
    
    setIsSaving(true);
    try {
      const blogToSave = {
        ...generatedBlog,
        content: editMode ? editedContent : generatedBlog.content,
      };
      await apiService.put(`/blog/${generatedBlog._id}`, {content :  editedContent})
      const updatedBlogs = [blogToSave, ...userBlogs.filter(b => b._id !== blogToSave._id)];
      setUserBlogs(updatedBlogs);
    } catch (error) {
      console.error('Failed to save blog:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const data = await getBlogs({ n: 5 });
      setUserBlogs(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setBlogsLoading(false);
    }
  };


  const copyToClipboard = () => {
    const content = editMode ? editedContent : generatedBlog?.content || '';
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const downloadAsPDF = () => {
    if (!generatedBlog) return
 
    const doc = new jsPDF();
    // Title
    doc.setFontSize(18);
    doc.text(generatedBlog.topic, 10, 20);
    // Content (split into lines for PDF)
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(editMode ? editedContent : (generatedBlog.content ?? ''), 180);
    doc.text(lines, 10, 35);
    doc.save(`${generatedBlog.topic.replace(/\s+/g, '_').slice(0, 30)}.pdf`);
  };

  useEffect(()=>{
   fetchBlogs();
  },[])

  return (
    <div className="min-h-screen  dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-10 px-2">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <div className="flex items-center gap-4 mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 shadow transition-all backdrop-blur-md"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">AI Blog Generator</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-6">
          Generate SEO-optimized blog content with AI assistance. Choose your topic, tone, and length, then let AI do the rest!
        </p>
        <div className="h-px w-full bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-gray-700 dark:via-gray-700 dark:to-gray-800 mb-2" />

        {/* Main grid: form and generated content side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Input Form */}
          <Card className="w-full shadow-2xl rounded-2xl border-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md animate-fadein">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Wand2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Blog Configuration
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Blog Topic"
                  placeholder="e.g., The Future of Artificial Intelligence"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  error={errors.topic}
                />
                <DropDown
                  label="Writing Tone"
                  options={[{ value: '', label: 'Select tone' }, ...toneOptions]}
                  value={tone}
                  onChange={setTone}
                  placeholder="Select tone"
                  error={errors.tone}
                />
                <DropDown
                  label="Content Length"
                  options={[{ value: '', label: 'Select length' }, ...lengthOptions]}
                  value={length}
                  onChange={setLength}
                  placeholder="Select length"
                  error={errors.length}
                />
                <Button 
                  type="submit" 
                  className="w-full font-semibold text-base py-2 rounded-lg shadow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900 transition-all duration-200"
                  isLoading={isGenerating}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating Blog...' : 'Generate Blog'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Generated Content */}
          <Card className="w-full shadow-2xl rounded-2xl border-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md animate-fadein">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                   Content
                </h2>
                {generatedBlog && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode(!editMode)}
                      className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-all"
                    >
                      {editMode ? <><View className="h-4 w-4 mr-1" /> </> : <Edit className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-all">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={downloadAsPDF} className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-all">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={saveBlog} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900 transition-all"
                      isLoading={isSaving}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/publish/${generatedBlog._id}`)}
                      className="flex items-center gap-1"
                      title="Publish Blog"
                    >
                      <Megaphone className="h-4 w-4 mr-1" /> Publish
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedBlog ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {generatedBlog.topic}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <span>Topic: {generatedBlog.topic.slice(0,1).toLocaleUpperCase() +  generatedBlog.topic.slice(1)}</span>
                      <span>Tone: {generatedBlog.tone.slice(0,1).toLocaleUpperCase() +  generatedBlog.tone.slice(1)}</span>
                      <span>Length: ~{generatedBlog.length} words</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    {editMode ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-96 border-0 resize-none"
                        placeholder="Edit your blog content..."
                      />
                    ) : (
                      <div className="p-4 prose prose-sm dark:text-white max-w-none dark:prose-invert">
                        <ReactMarkdown>{editMode ? editedContent : generatedBlog.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Generate a blog to see the content here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Blogs */}
        {userBlogs.length > 0 && !blogsLoading && (
          <div className="mt-8 shadow-md dark:shadow-slate-800 bg-white dark:bg-gray-900/80 rounded-lg p-3 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Recent Blogs
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold px-4 py-1 rounded-lg transition-all"
                onClick={() => navigate('/blogs')}
              >
                View All
              </Button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Click any blog to view or edit it below.</p>
            <div className="flex flex-col gap-4">
              {userBlogs.slice(0, 6).map((blog) => (
                <div
                  key={blog._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white/80 dark:bg-gray-800/80 hover:shadow-md dark:hover:shadow-lg transition-shadow cursor-pointer group"
                  
                >
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blog.topic}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{blog.topic} • {blog.tone}</span>
                    <span className="text-xs">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/publish/${blog._id}`);
                      }}
                      className="flex items-center gap-1 ml-auto"
                      title="Publish Blog"
                    >
                      <Megaphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {blogsLoading && (
          <div className="mt-8 flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white/80 dark:bg-gray-800/80 shadow-md dark:shadow-slate-800 animate-pulse flex flex-col gap-3">
                <Skeleton className="h-5 w-1/2 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-4 w-20 mt-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}