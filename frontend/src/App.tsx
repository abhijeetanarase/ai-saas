import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { BlogGeneratorPage } from './pages/tools/BlogGeneratorPage';
import { ResumeAnalyzerPage } from './pages/tools/ResumeAnalyzerPage';
import { ImageGeneratorPage } from './pages/tools/ImageGeneratorPage';
import { AdminPage } from './pages/admin/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { SendResetLinkPage } from './pages/auth/SendResetLinkPage';
import { InvitationPage } from './pages/InvitationPage';
import AllBlogsPage from './pages/tools/AllBlogsPage';
import BlogViewPage from './pages/tools/BlogViewPage';
import PublishBlogPage from './pages/tools/PublishBlogPage';
import TemplateCreatePage from './pages/admin/template/TemplateCreatePage';
import AllTemplatesPage from './pages/admin/template/AllTemplatesPage';
import TemplateEditPage from './pages/admin/template/TemplateEditPage';
import PublicBlogPage from './pages/PublicBlogPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout showSidebar={false}><LandingPage /></Layout>} />
              <Route path="/login" element={<Layout showSidebar={false}><LoginPage /></Layout>} />
              <Route path="/register" element={<Layout showSidebar={false}><RegisterPage /></Layout>} />
              <Route path="/forgot-password" element={<Layout showSidebar={false}><ForgotPasswordPage /></Layout>} />
              <Route path="/reset-password" element={<Layout showSidebar={false}><SendResetLinkPage /></Layout>} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
               
                  <Layout><DashboardPage /></Layout>
               
              } />
              
              <Route path="/blog-generator" element={
               
                  <Layout><BlogGeneratorPage /></Layout>
               
              } />
              
              <Route path="/resume-analyzer" element={
               
                  <Layout><ResumeAnalyzerPage /></Layout>
                
              } />
              
              <Route path="/image-generator" element={
               
                  <Layout><ImageGeneratorPage /></Layout>
               
              } />
              
              <Route path="/admin" element={
               
                  <Layout><AdminPage /></Layout>
              
              } />
              
              <Route path="/settings" element={
               
                  <Layout><SettingsPage /></Layout>
              
              } />
              <Route path="/invite" element={
                <Layout><InvitationPage /></Layout>
              } />
              <Route path="/blogs" element={<Layout><AllBlogsPage /></Layout>} />
              <Route path="/blog/:id" element={<Layout><BlogViewPage /></Layout>} />
              <Route path="/publish/:id" element={<Layout><PublishBlogPage /></Layout>} />
              <Route path="/templates/create" element={<Layout><TemplateCreatePage /></Layout>} />
              <Route path="/templates/all" element={<Layout><AllTemplatesPage /></Layout>} />
              <Route path="/template/edit/:id" element={<Layout><TemplateEditPage /></Layout>} />
              <Route path="/public/blog/:author/:topic" element={<PublicBlogPage />} />

              {/* Redirect any unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;