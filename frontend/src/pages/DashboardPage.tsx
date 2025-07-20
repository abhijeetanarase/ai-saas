import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, FileSearch, Image, Plus, TrendingUp, Users, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, getBlogs } from '../services/apiService';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { BlogPost, ResumeAnalysis, GeneratedImage } from '../types';
import { fromatField } from '../utils/formatters';

const stats = [
  { name: 'Total Blogs', value: '12', icon: FileText, change: '+2 this week' },
  { name: 'Resumes Analyzed', value: '8', icon: FileSearch, change: '+1 this week' },
  { name: 'Images Generated', value: '24', icon: Image, change: '+6 this week' },
  { name: 'Tokens Used', value: '2,847', icon: Activity, change: '71% of limit' },
];

const quickActions = [
  { name: 'Generate Blog', href: '/blog-generator', icon: FileText, description: 'Create SEO-optimized content' },
  { name: 'Analyze Resume', href: '/resume-analyzer', icon: FileSearch, description: 'Check ATS compatibility' },
  { name: 'Generate Images', href: '/image-generator', icon: Image, description: 'Create AI-powered visuals' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [recentResumes, setRecentResumes] = useState<ResumeAnalysis[]>([]);
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);

  const navigate = useNavigate()

 

  useEffect(() => {
    const loadRecentData = async () => {
      try {
        const [blogs, resumes, images] = await Promise.all([
          getBlogs({ n: 6 }),
          api.getUserResumes(),
          api.getUserImages(),
        ]);
        
        setRecentBlogs(blogs.data.slice(0, 6));
        setRecentResumes(resumes.slice(0, 3));
        setRecentImages(images.slice(0, 3));
      } catch (error) {
        console.error('Failed to load recent data:', error);
      }
    };

    loadRecentData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening with your AI tools today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <p className="text-gray-600 dark:text-gray-400">Jump right into creating with AI</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.name} to={action.href}>
                <div className="group relative rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>
                  <Plus className="absolute top-6 right-6 h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Blogs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Blogs</h2>
              <p className="text-gray-600 dark:text-gray-400">Your latest generated content</p>
            </div>
            <Link to="/blogs">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentBlogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentBlogs.map((blog) => (
                  <div
                   onClick={()=>navigate(`/blog/${blog._id}`)}
                    key={blog._id}
                    className="rounded-2xl border border-blue-100 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 shadow-lg backdrop-blur-md p-4 flex flex-col gap-2 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group"
                  >
    
                    <div className="flex flex-wrap gap-2 text-xs mb-1">
                      <span className="inline-block px-2 py-0.5 rounded  dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                        {fromatField(blog.topic,35)}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                        {fromatField(blog.tone,10)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
                      <span>~{blog.length} words</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">No blogs generated yet</p>
                <Link to="/blog-generator">
                  <Button size="sm" className="mt-4">Generate Your First Blog</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Images */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Images</h2>
              <p className="text-gray-600 dark:text-gray-400">Your latest AI-generated images</p>
            </div>
            <Link to="/image-generator">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {recentImages.map((image) => (
                  <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={image.imageUrl} 
                      alt={image.prompt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">No images generated yet</p>
                <Link to="/image-generator">
                  <Button size="sm" className="mt-4">Generate Your First Image</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}