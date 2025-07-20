import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const MODULES = [
  { key: 'blog', label: 'Blog Generator' },
  { key: 'resume', label: 'Resume Analyzer' },
  { key: 'image', label: 'Image Generator' },
  { key: 'team', label: 'Team Collaboration' },
  { key: 'settings', label: 'Settings' },
];

const PERMISSIONS = [
  { key: 'add', label: 'Add' },
  { key: 'view', label: 'View' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

function isAllSelected(permissionsState: Record<string, Record<string, boolean>>) {
  return MODULES.every(mod => PERMISSIONS.every(perm => permissionsState[mod.key][perm.key]));
}

function isRowSelected(permissionsState: Record<string, Record<string, boolean>>, moduleKey: string) {
  return PERMISSIONS.every(perm => permissionsState[moduleKey][perm.key]);
}

function isColSelected(permissionsState: Record<string, Record<string, boolean>>, permKey: string) {
  return MODULES.every(mod => permissionsState[mod.key][permKey]);
}

export function InvitationPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  // permissionsState: { [moduleKey]: { [permKey]: boolean } }
  const [permissionsState, setPermissionsState] = useState(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    MODULES.forEach(mod => {
      initial[mod.key] = {};
      PERMISSIONS.forEach(perm => {
        initial[mod.key][perm.key] = false;
      });
    });
    return initial;
  });

  // Global select all
  const handleSelectAll = () => {
    const allSelected = isAllSelected(permissionsState);
    setPermissionsState(() => {
      const updated: Record<string, Record<string, boolean>> = {};
      MODULES.forEach(mod => {
        updated[mod.key] = {};
        PERMISSIONS.forEach(perm => {
          updated[mod.key][perm.key] = !allSelected;
        });
      });
      return updated;
    });
  };

  // Row select (module)
  const handleRowSelect = (moduleKey: string) => {
    const rowSelected = isRowSelected(permissionsState, moduleKey);
    setPermissionsState(prev => ({
      ...prev,
      [moduleKey]: PERMISSIONS.reduce((acc, perm) => {
        acc[perm.key] = !rowSelected;
        return acc;
      }, {} as Record<string, boolean>),
    }));
  };

  // Column select (permission)
  const handleColSelect = (permKey: string) => {
    const colSelected = isColSelected(permissionsState, permKey);
    setPermissionsState(prev => {
      const updated = { ...prev };
      MODULES.forEach(mod => {
        updated[mod.key] = { ...updated[mod.key], [permKey]: !colSelected };
      });
      return updated;
    });
  };

  // Individual cell
  const handlePermissionChange = (moduleKey: string, permKey: string) => {
    setPermissionsState(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [permKey]: !prev[moduleKey][permKey],
      },
    }));
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter a name.');
      return;
    }
    if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      setError('Please enter a valid email.');
      return;
    }
    // At least one permission should be selected
    const anyPermission = MODULES.some(mod => PERMISSIONS.some(perm => permissionsState[mod.key][perm.key]));
    if (!anyPermission) {
      setError('Please select at least one permission.');
      return;
    }
    // Save: name, email, permissionsState
    setSent(true);
    setEmail('');
    setName('');
    // Reset permissions
    setPermissionsState(() => {
      const initial: Record<string, Record<string, boolean>> = {};
      MODULES.forEach(mod => {
        initial[mod.key] = {};
        PERMISSIONS.forEach(perm => {
          initial[mod.key][perm.key] = false;
        });
      });
      return initial;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invite Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Invite team members and set module-wise permissions.</p>
        </CardHeader>
        <CardContent>
          {sent && (
            <div className="mb-4 text-green-600 dark:text-green-400 text-center">Invitation sent successfully!</div>
          )}
          <form onSubmit={handleInvite} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={e => setName(e.target.value)}
              error={error && !name.trim() ? error : undefined}
            />
            <Input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={error && !email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i) ? error : undefined}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={isAllSelected(permissionsState)}
                        onChange={handleSelectAll}
                        className="accent-blue-600 h-4 w-4 mr-2"
                      />
                      Module
                    </th>
                    {PERMISSIONS.map(perm => (
                      <th key={perm.key} className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={isColSelected(permissionsState, perm.key)}
                          onChange={() => handleColSelect(perm.key)}
                          className="accent-blue-600 h-4 w-4 mr-1"
                        />
                        {perm.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map(mod => (
                    <tr key={mod.key}>
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                        <input
                          type="checkbox"
                          checked={isRowSelected(permissionsState, mod.key)}
                          onChange={() => handleRowSelect(mod.key)}
                          className="accent-blue-600 h-4 w-4 mr-2"
                        />
                        {mod.label}
                      </td>
                      {PERMISSIONS.map(perm => (
                        <td key={perm.key} className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={permissionsState[mod.key][perm.key]}
                            onChange={() => handlePermissionChange(mod.key, perm.key)}
                            className="accent-blue-600 h-4 w-4"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full">Invite</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 