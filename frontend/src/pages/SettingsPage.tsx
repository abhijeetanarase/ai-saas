import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Bell, Shield, CreditCard, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

interface ProfileForm {
  name: string;
  email: string;
  notifications: string;
}

const notificationOptions = [
  { value: 'all', label: 'All Notifications' },
  { value: 'important', label: 'Important Only' },
  { value: 'none', label: 'None' },
];

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      notifications: 'all',
    }
  });

  const onSubmit = (data: ProfileForm) => {
    console.log('Profile updated:', data);
    alert('Profile updated successfully!');
  };

  const handleUpgradePlan = () => {
    alert('Upgrade plan functionality would be implemented here');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />

              <Input
                label="Email Address"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />

              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                label="Email Notifications"
                options={notificationOptions}
                defaultValue="all"
              />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about important updates</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive product updates and tips</p>
                </div>
                <Button variant="outline" size="sm">
                  Disable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              {theme === 'light' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
              Appearance
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred theme
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme}>
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan & Billing */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Plan & Billing
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Current Plan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {user?.plan} Plan
                  </p>
                </div>
                <Button size="sm" onClick={handleUpgradePlan}>
                  {user?.plan === 'free' ? 'Upgrade' : 'Manage'}
                </Button>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Token Usage</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.usageTokens} / {user?.maxTokens}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((user?.usageTokens || 0) / (user?.maxTokens || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Enable Two-Factor Auth
                </Button>
              </div>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Download Data
                </Button>
                <Button variant="danger" className="w-full">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}