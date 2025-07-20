import React, { useState, useRef } from 'react';
import { Upload, FileCheck, AlertCircle, CheckCircle, Download, Target, ArrowLeft } from 'lucide-react';
import { api } from '../../services/apiService';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import type { ResumeAnalysis } from '../../types';
import { useNavigate } from 'react-router-dom';

export function ResumeAnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [userResumes, setUserResumes] = useLocalStorage<ResumeAnalysis[]>('userResumes', []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await api.analyzeResume(file);
      setAnalysis(result);
      
      // Save to local storage
      const updatedResumes = [result, ...userResumes.filter(r => r.id !== result.id)];
      setUserResumes(updatedResumes);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 shadow transition-all backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Back</span>
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">AI Resume Analyzer</h1>
      </div>
      <div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get your ATS score and improvement suggestions for better job applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Resume
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Upload your resume in PDF or DOCX format</p>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Drop your resume here
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  or click to browse files
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                  PDF or DOCX files only
                </p>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  isLoading={isAnalyzing}
                  className="mx-auto"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Choose File'}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Analysis Results
            </h2>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                {/* ATS Score */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - analysis.atsScore / 100)}`}
                        className={`bg-gradient-to-r ${getScoreBackground(analysis.atsScore)}`}
                        style={{
                          background: `conic-gradient(from 0deg, #3B82F6, #8B5CF6 ${analysis.atsScore}%, #E5E7EB ${analysis.atsScore}%)`
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                        {analysis.atsScore}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">ATS Score</span>
                    </div>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {analysis.fileName}
                  </p>
                </div>

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      Issues Found
                    </h3>
                    <ul className="space-y-2">
                      {analysis.issues.map((issue, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-2 w-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    Improvement Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-2 w-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button className="flex-1">
                    Get Enhanced Version
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Upload a resume to see analysis results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Previous Analyses */}
      {userResumes.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Previous Analyses</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userResumes.slice(0, 6).map((resume) => (
                <div
                  key={resume.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setAnalysis(resume)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {resume.fileName}
                    </h3>
                    <span className={`text-lg font-bold ${getScoreColor(resume.atsScore)}`}>
                      {resume.atsScore}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resume.issues.length} issues found
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}