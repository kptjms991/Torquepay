'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'user' | 'merchant' | 'admin';
  kycStatus: 'pending' | 'verified' | 'rejected';
  joinedDate: string;
  volume?: number;
}

interface UserManagementProps {
  users: User[];
  onApproveMerchant: (userId: string) => Promise<void>;
  onRejectMerchant: (userId: string) => Promise<void>;
  onSuspendUser: (userId: string) => Promise<void>;
}

export function UserManagement({
  users,
  onApproveMerchant,
  onRejectMerchant,
  onSuspendUser,
}: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'user' | 'merchant' | 'admin'>('all');
  const [kycFilter, setKycFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || user.type === typeFilter;
    const matchesKyc = kycFilter === 'all' || user.kycStatus === kycFilter;
    return matchesSearch && matchesType && matchesKyc;
  });

  const getKycIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">All Types</option>
                <option value="user">Users</option>
                <option value="merchant">Merchants</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All KYC Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">KYC Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Volume</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.type === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.type === 'merchant'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {getKycIcon(user.kycStatus)}
                        <span className="text-sm text-gray-600">
                          {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      ${user.volume?.toLocaleString() || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{user.joinedDate}</td>
                    <td className="py-3 px-4 text-center">
                      {user.type === 'merchant' && user.kycStatus === 'pending' ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => onApproveMerchant(user.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => onRejectMerchant(user.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => onSuspendUser(user.id)}
                        >
                          Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
