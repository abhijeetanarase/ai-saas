import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, FileText, FileSearch, Image, Users, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

const features = [
  {
    icon: FileText,
    title: 'AI Blog Generator',
    description: 'Create SEO-optimized blog content with customizable tone and length',
  },
  {
    icon: FileSearch,
    title: 'Resume Analyzer',
    description: 'Get ATS scores and improvement suggestions for your resume',
  },
  {
    icon: Image,
    title: 'AI Image Generator',
    description: 'Generate stunning images from text prompts with various styles',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share and collaborate on AI-generated content with your team',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out our AI tools',
    features: ['1,000 tokens/month', '3 AI tools', 'Basic support', 'Export capabilities'],
    buttonText: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Best for professionals and small teams',
    features: ['50,000 tokens/month', 'All AI tools', 'Priority support', 'Advanced features', 'Team collaboration'],
    buttonText: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    features: ['Unlimited tokens', 'Custom integrations', 'Dedicated support', 'Advanced analytics', 'Custom models'],
    buttonText: 'Contact Sales',
    popular: false,
  },
];

export function LandingPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              AI-Powered Tools for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Modern Professionals</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Generate blogs, analyze resumes, create images, and more with our comprehensive suite of AI tools. 
              Boost your productivity and creativity in one unified platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register">
                <Button size="lg" className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to create with AI
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Powerful AI tools designed for content creators, job seekers, and professionals
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-blue-600 dark:ring-blue-400' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-600 dark:text-gray-400">/month</span>}
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/register">
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? 'primary' : 'outline'}
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}