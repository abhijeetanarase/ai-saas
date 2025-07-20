import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplates, updateTemplate } from '../../../services/apiService';
import { Button } from '../../../components/ui/Button';
import { Palette, ArrowLeft, Save } from 'lucide-react';
import { DropDown } from '../../../components/ui/DropDown';

const DEFAULT_STYLE = {
  fontFamily: 'serif',
  background: '#fff',
  border: '2px solid #d1d5db',
  color: '#18181b',
};

const FONT_FAMILIES = [
  { label: 'Serif', value: 'serif' },
  { label: 'Sans', value: 'sans-serif' },
  { label: 'Mono', value: 'monospace' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Oswald', value: 'Oswald, sans-serif' },
  { label: 'Raleway', value: 'Raleway, sans-serif' },
  { label: 'Nunito', value: 'Nunito, sans-serif' },
  { label: 'Ubuntu', value: 'Ubuntu, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, sans-serif' },
  { label: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
  { label: 'PT Serif', value: 'PT Serif, serif' },
  { label: 'Quicksand', value: 'Quicksand, sans-serif' },
  { label: 'Fira Sans', value: 'Fira Sans, sans-serif' },
  { label: 'Inconsolata', value: 'Inconsolata, monospace' },
  { label: 'System UI', value: 'system-ui, sans-serif' },
];

const BORDER_STYLES = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
  { label: 'Double', value: 'double' },
  { label: 'Groove', value: 'groove' },
  { label: 'Ridge', value: 'ridge' },
  { label: 'Inset', value: 'inset' },
  { label: 'Outset', value: 'outset' },
  { label: 'None', value: 'none' },
];

export default function TemplateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ name: '', description: '', style: { ...DEFAULT_STYLE }, previewImage: '' });

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const data = await getTemplates({ _id: id });
        const tpl = data.data && data.data[0];
        setForm({
          name: tpl?.name || '',
          description: tpl?.description || '',
          style: tpl?.style || { ...DEFAULT_STYLE },
          previewImage: tpl?.previewImage || '',
        });
      } catch {
        setError('Failed to fetch template.');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }));
  };
  const handleStyleChange = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, style: { ...f.style, [field]: value } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateTemplate(id as string, form);
      navigate('/all-templates');
    } catch {
      setError('Failed to update template');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-lg text-gray-500 dark:text-gray-400">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500 dark:text-red-400">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-2">
      <div className="rounded-2xl border border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-gray-700 dark:via-gray-700 dark:to-gray-800 bg-white/80 dark:bg-gray-900/80 shadow-2xl backdrop-blur-md p-8 space-y-8 animate-fadein">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">Edit Blog Template</h1>
        </div>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Form */}
          <div className="space-y-6">
            <label className="block">
              <span className="font-medium">Template Name</span>
              <input
                className="w-full border rounded-lg px-4 py-3 mt-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                required
                placeholder="e.g. Modern Card"
              />
            </label>
            <label className="block">
              <span className="font-medium">Description</span>
              <textarea
                className="w-full border rounded-lg px-4 py-3 mt-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm transition-all min-h-[60px]"
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                required
                placeholder="Describe the template style..."
              />
            </label>
            <DropDown
              label="Font Family"
              options={FONT_FAMILIES}
              value={form.style.fontFamily}
              onChange={(val: any) => handleStyleChange('fontFamily', val)}
              placeholder="Select font family"
              className="mb-2"
            />
            {/* Background color and text input */}
            <label className="block">
              <span className="font-medium">Background</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-3 mt-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={form.style.background}
                  onChange={e => handleStyleChange('background', e.target.value)}
                  placeholder="#fff or linear-gradient(...)"
                />
                <div className="relative">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow bg-transparent flex items-center justify-center hover:scale-110 transition-transform focus:ring-2 focus:ring-blue-500"
                    style={{ background: (/^#([0-9A-Fa-f]{3}){1,2}$/.test(form.style.background) ? form.style.background : '#ffffff') }}
                    title="Pick background color"
                    tabIndex={-1}
                  >
                    <span className="sr-only">Pick background color</span>
                    <input
                      type="color"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      value={/^#([0-9A-Fa-f]{3}){1,2}$/.test(form.style.background) ? form.style.background : '#ffffff'}
                      onChange={e => handleStyleChange('background', e.target.value)}
                      tabIndex={0}
                    />
                  </button>
                </div>
              </div>
            </label>
            {/* Border color, thickness, and style */}
            <label className="block">
              <span className="font-medium">Border</span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-3 mt-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={form.style.border}
                    onChange={e => handleStyleChange('border', e.target.value)}
                    placeholder="2px solid #d1d5db"
                  />
                  <div className="relative">
                    <button
                      type="button"
                      className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow bg-transparent flex items-center justify-center hover:scale-110 transition-transform focus:ring-2 focus:ring-blue-500"
                      style={{ background: (() => {
                        const match = form.style.border.match(/#([0-9A-Fa-f]{3,6})/);
                        return match ? match[0] : '#d1d5db';
                      })() }}
                      title="Pick border color"
                      tabIndex={-1}
                    >
                      <span className="sr-only">Pick border color</span>
                      <input
                        type="color"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={(() => {
                          const match = form.style.border.match(/#([0-9A-Fa-f]{3,6})/);
                          return match ? match[0] : '#d1d5db';
                        })()}
                        onChange={e => {
                          // Replace color in border string
                          const border = form.style.border.replace(/#([0-9A-Fa-f]{3,6})/, e.target.value) || `2px solid ${e.target.value}`;
                          handleStyleChange('border', border);
                        }}
                        tabIndex={0}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <span className="text-sm">Thickness</span>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={(() => {
                        const match = form.style.border.match(/^(\d+)px/);
                        return match ? match[1] : 2;
                      })()}
                      onChange={e => {
                        const px = e.target.value;
                        const style = (() => {
                          const match = form.style.border.match(/px ([a-z]+) /);
                          return match ? match[1] : 'solid';
                        })();
                        const color = (() => {
                          const match = form.style.border.match(/#([0-9A-Fa-f]{3,6})/);
                          return match ? match[0] : '#d1d5db';
                        })();
                        handleStyleChange('border', `${px}px ${style} ${color}`);
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[24px] text-center">{(() => {
                      const match = form.style.border.match(/^(\d+)px/);
                      return match ? match[1] : 2;
                    })()}px</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-sm">Style</span>
                    <select
                      className="border rounded-lg px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={(() => {
                        const match = form.style.border.match(/px ([a-z]+) /);
                        return match ? match[1] : 'solid';
                      })()}
                      onChange={e => {
                        const style = e.target.value;
                        const px = (() => {
                          const match = form.style.border.match(/^(\d+)px/);
                          return match ? match[1] : 2;
                        })();
                        const color = (() => {
                          const match = form.style.border.match(/#([0-9A-Fa-f]{3,6})/);
                          return match ? match[0] : '#d1d5db';
                        })();
                        handleStyleChange('border', `${px}px ${style} ${color}`);
                      }}
                    >
                      {BORDER_STYLES.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </label>
            {/* Text color */}
            <label className="block">
              <span className="font-medium">Text Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-32 border rounded-lg px-3 py-2 mt-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={form.style.color}
                  onChange={e => handleStyleChange('color', e.target.value)}
                  placeholder="#18181b"
                />
                <div className="relative">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow bg-transparent flex items-center justify-center hover:scale-110 transition-transform focus:ring-2 focus:ring-blue-500"
                    style={{ background: form.style.color }}
                    title="Pick text color"
                    tabIndex={-1}
                  >
                    <span className="sr-only">Pick text color</span>
                    <input
                      type="color"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      value={form.style.color}
                      onChange={e => handleStyleChange('color', e.target.value)}
                      tabIndex={0}
                    />
                  </button>
                </div>
              </div>
            </label>
            <label className="block">
              <span className="font-medium">Preview Image URL (optional)</span>
              <input
                className="w-full border rounded-lg px-4 py-3 mt-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={form.previewImage}
                onChange={e => handleChange('previewImage', e.target.value)}
                placeholder="https://..."
              />
            </label>
            <Button type="submit" className="mt-4 w-full" isLoading={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            {error && <div className="text-red-500 dark:text-red-400 mt-2">{error}</div>}
          </div>
          {/* Right: Live Preview */}
          <div className="flex flex-col items-center justify-start">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Live Preview</h2>
            <div
              className="rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
              style={{
                fontFamily: form.style.fontFamily,
                background: form.style.background,
                border: form.style.border,
                color: form.style.color,
                minHeight: 320,
              }}
            >
              {form.previewImage && (
                <img src={form.previewImage} alt="preview" className="w-full h-40 object-cover rounded mb-4 shadow" />
              )}
              <h1 className="text-2xl font-bold mb-2">{form.name || 'Template Title'}</h1>
              <div className="prose max-w-none" style={{ fontFamily: form.style.fontFamily }}>
                <p>{form.description || 'Template description and sample content...'}</p>
                <p><b>Bold text</b>, <i>italic text</i>, <u>underline</u></p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 