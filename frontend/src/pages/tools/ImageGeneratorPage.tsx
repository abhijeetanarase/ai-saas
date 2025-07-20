import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Wand2, Download, Grid, List } from 'lucide-react';
import { api } from '../../services/apiService';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import type { GeneratedImage } from '../../types';

interface ImageForm {
  prompt: string;
  style: string;
  resolution: string;
  count: number;
}

const styleOptions = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'minimalist', label: 'Minimalist' },
];

const resolutionOptions = [
  { value: '512x512', label: '512×512 (Square)' },
  { value: '768x768', label: '768×768 (Square HD)' },
  { value: '1024x1024', label: '1024×1024 (High Quality)' },
  { value: '1024x768', label: '1024×768 (Landscape)' },
  { value: '768x1024', label: '768×1024 (Portrait)' },
];

const countOptions = [
  { value: '1', label: '1 Image' },
  { value: '2', label: '2 Images' },
  { value: '3', label: '3 Images' },
  { value: '4', label: '4 Images' },
];

export function ImageGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [userImages, setUserImages] = useLocalStorage<GeneratedImage[]>('userImages', []);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ImageForm>({
    defaultValues: {
      style: 'realistic',
      resolution: '1024x1024',
      count: 1,
    }
  });

  const onSubmit = async (data: ImageForm) => {
    setIsGenerating(true);
    try {
      const images = await api.generateImages(data.prompt, data.style, data.resolution, Number(data.count));
      setGeneratedImages(images);
      
      // Save to local storage
      const updatedImages = [...images, ...userImages];
      setUserImages(updatedImages.slice(0, 50)); // Keep only latest 50 images
    } catch (error) {
      console.error('Failed to generate images:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Image Generator</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create stunning images from text prompts using advanced AI models
        </p>
      </div>

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Wand2 className="h-5 w-5 mr-2" />
            Image Configuration
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Textarea
              label="Image Prompt"
              placeholder="Describe the image you want to generate... e.g., A serene mountain landscape at sunset with a lake reflection"
              rows={3}
              {...register('prompt', { 
                required: 'Prompt is required',
                minLength: {
                  value: 10,
                  message: 'Prompt must be at least 10 characters'
                }
              })}
              error={errors.prompt?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Style"
                options={styleOptions}
                {...register('style', { required: 'Style is required' })}
                error={errors.style?.message}
              />

              <Select
                label="Resolution"
                options={resolutionOptions}
                {...register('resolution', { required: 'Resolution is required' })}
                error={errors.resolution?.message}
              />

              <Select
                label="Number of Images"
                options={countOptions}
                {...register('count', { required: 'Count is required' })}
                error={errors.count?.message}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full md:w-auto" 
              isLoading={isGenerating}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Images...' : 'Generate Images'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Images</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => downloadImage(image.imageUrl, `ai-image-${image.id}.jpg`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{image.prompt}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {image.style} • {image.resolution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {generatedImages.map((image) => (
                  <div key={image.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{image.prompt}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {image.style} • {image.resolution} • {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadImage(image.imageUrl, `ai-image-${image.id}.jpg`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      {userImages.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Gallery</h2>
            <p className="text-gray-600 dark:text-gray-400">Your previously generated images</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userImages.slice(0, 12).map((image) => (
                <div key={image.id} className="group relative aspect-square">
                  <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-full">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => downloadImage(image.imageUrl, `ai-image-${image.id}.jpg`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {userImages.length > 12 && (
              <div className="mt-6 text-center">
                <Button variant="outline">View All Images ({userImages.length})</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}