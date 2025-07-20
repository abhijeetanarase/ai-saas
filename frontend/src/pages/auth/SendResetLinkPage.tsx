import React from 'react';
import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Link, useSearchParams } from 'react-router-dom';

interface ResetForm {
  password: string;
  confirmPassword: string;
}

export function SendResetLinkPage() {
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm<ResetForm>();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const password = watch('password');

  const onSubmit = async (data: ResetForm) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setIsLoading(true);
    try {
      // Yahan API call karo password reset ke liye (token ke sath)
      await new Promise(res => setTimeout(res, 1200)); // fake delay
      setIsSuccess(true);
    } catch (error) {
      setError('root', { message: 'Failed to reset password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400">Set your new password</p>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center text-green-600 dark:text-green-400">
              Password reset successful! <Link to="/login" className="underline">Login now</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="New password"
                  className="pl-10"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  error={errors.password?.message}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-10"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  error={errors.confirmPassword?.message}
                />
              </div>
              {errors.root && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
              )}
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Reset Password
              </Button>
              <div className="text-center text-sm">
                <Link to="/login" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 