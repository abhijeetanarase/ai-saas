import React, { useState } from 'react';
import { FileText, Download, Copy, Save, Edit, View, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import type { BlogPost } from '../../types';
import jsPDF from 'jspdf';

interface BlogEditorViewProps {
  blog: BlogPost;
  onSave?: (content: string) => Promise<void>;
  editable?: boolean;
}

export const BlogEditorView: React.FC<BlogEditorViewProps> = ({ blog, onSave, editable = true }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(blog.content);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editMode ? editedContent ?? '' : blog.content ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(blog.topic, 10, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(editMode ? editedContent ?? '' : blog.content ?? '', 180);
    doc.text(lines, 10, 35);
    doc.save(`${blog.topic.replace(/\s+/g, '_').slice(0, 30)}.pdf`);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(editedContent ?? '');
      setEditMode(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full shadow-2xl rounded-2xl border-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md animate-fadein">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          Content
        </h2>
        <div className="flex space-x-2">
          {editable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditMode(!editMode)}
              className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-all"
            >
              {editMode ? <><View className="h-4 w-4 mr-1" /> </> : <Edit className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-all">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadAsPDF} className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-all">
            <Download className="h-4 w-4" />
          </Button>
          {editable && onSave && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
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
          )}
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-4">
          <div>
           
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span>Topic: {blog.topic.slice(0,1).toLocaleUpperCase() +  blog.topic.slice(1)}</span>
              <span>Tone: {blog.tone.slice(0,1).toLocaleUpperCase() +  blog.tone.slice(1)}</span>
              <span>Length: ~{blog.length} words</span>
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
                <ReactMarkdown>{editMode ? editedContent : blog.content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 