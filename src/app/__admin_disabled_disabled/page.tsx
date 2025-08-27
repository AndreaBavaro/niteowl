'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/lib/types';
import { CheckCircle, XCircle, Clock, User, MapPin, Music, Calendar } from 'lucide-react';

interface AdminUser extends UserProfile {
  user_preferences?: {
    location_neighbourhood?: string;
    preferred_music?: string[];
    age?: number;
  };
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const router = useRouter();

  // Simple localhost check - in production, you'd want proper auth
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, status }),
      });

      if (response.ok) {
        // Refresh the users list
        fetchUsers();
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.access_status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-400/10';
      case 'rejected':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">NightOwl TO Admin</h1>
          <p className="text-zinc-400">Manage user access and approvals</p>
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-4 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === filterOption
                  ? 'bg-green-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              <span className="ml-2 text-sm">
                ({users.filter(u => filterOption === 'all' ? true : u.access_status === filterOption).length})
              </span>
            </button>
          ))}
        </div>

        {/* Users table */}
        <div className="bg-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Preferences
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-zinc-400">
                            {user.email || user.phone || 'No contact'}
                          </div>
                          <div className="text-xs text-zinc-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {user.location_neighbourhood && (
                          <div className="flex items-center text-sm text-zinc-300">
                            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                            {user.location_neighbourhood}
                          </div>
                        )}
                        {user.preferred_music && user.preferred_music.length > 0 && (
                          <div className="flex items-center text-sm text-zinc-300">
                            <Music className="w-4 h-4 mr-2 text-purple-400" />
                            {user.preferred_music.join(', ')}
                          </div>
                        )}
                        {user.age && (
                          <div className="text-sm text-zinc-300">
                            Age: {user.age}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.access_status)}`}>
                        {getStatusIcon(user.access_status)}
                        <span className="ml-1">{user.access_status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.access_status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateUserStatus(user.id, 'approved')}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateUserStatus(user.id, 'rejected')}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {user.access_status !== 'pending' && (
                        <span className="text-zinc-500">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-zinc-400 text-lg">No users found for the selected filter.</div>
          </div>
        )}
      </div>
    </div>
  );
}
