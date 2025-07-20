import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Link } from 'react-router-dom';

interface ForgotForm {
  email: string;
}

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<ForgotForm>();
  const [isSent, setIsSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      // Yahan API call karo reset link bhejne ke liye
      await new Promise(res => setTimeout(res, 1200)); // fake delay
      setIsSent(true);
    } catch (error) {
      setError('root', { message: 'Failed to send reset link' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter your email to receive a reset link</p>
        </CardHeader>
        <CardContent>
          {isSent ? (
            <div className="text-center text-green-600 dark:text-green-400">
              Reset link sent! Check your email.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                />
              </div>
              {errors.root && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
              )}
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send Reset Link
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