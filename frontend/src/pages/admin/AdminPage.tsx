import React, { useState, useEffect } from 'react';
import { Users, Activity, CreditCard, Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { User } from '../../types';

// Mock admin data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    plan: 'pro',
    usageTokens: 15000,
    maxTokens: 50000,
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    plan: 'free',
    usageTokens: 800,
    maxTokens: 1000,
    createdAt: '2024-01-18T00:00:00Z',
    lastLogin: '2024-01-21T14:22:00Z',
  },
  {
    id: '3',
    email: 'mike@enterprise.com',
    name: 'Mike Johnson',
    plan: 'enterprise',
    usageTokens: 45000,
    maxTokens: 100000,
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-21T09:15:00Z',
  },
];

const adminStats = [
  { name: 'Total Users', value: '1,247', icon: Users, change: '+12%' },
  { name: 'Active Today', value: '89', icon: Activity, change: '+5%' },
  { name: 'Total Revenue', value: '$24,890', icon: CreditCard, change: '+18%' },
  { name: 'Avg Usage', value: '67%', icon: TrendingUp, change: '+3%' },
];

export function AdminPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'pro': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getUsagePercentage = (used: number, max: number) => {
    return Math.round((used / max) * 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage users, monitor usage, and oversee platform operations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h2>
                <Button size="sm">Export Data</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Plan</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Usage</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPlanColor(user.plan)}`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-20">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getUsagePercentage(user.usageTokens, user.maxTokens)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {getUsagePercentage(user.usageTokens, user.maxTokens)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Details */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Details</h2>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Plan:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPlanColor(selectedUser.plan)}`}>
                        {selectedUser.plan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Usage:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.usageTokens.toLocaleString()} / {selectedUser.maxTokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Login:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(selectedUser.lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Reset Password
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Upgrade Plan
                    </Button>
                    <Button variant="danger" size="sm" className="w-full">
                      Suspend Account
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Select a user to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Alerts</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">High Usage Alert</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Server load at 85% capacity
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">API Rate Limit</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      OpenAI API approaching limit
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}