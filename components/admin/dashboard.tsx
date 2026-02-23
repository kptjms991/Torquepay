'use client';

import { Card } from '@/components/ui/card';
import { Users, CreditCard, AlertCircle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface AdminDashboardProps {
  totalUsers: number;
  activeMerchants: number;
  totalVolume: number;
  openDisputes: number;
  recentTransactions: Array<{
    id: string;
    merchant: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    date: string;
  }>;
}

export function AdminDashboard({
  totalUsers,
  activeMerchants,
  totalVolume,
  openDisputes,
  recentTransactions,
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-12 h-12 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Merchants</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{activeMerchants}</p>
            </div>
            <CreditCard className="w-12 h-12 text-green-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Volume</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {formatCurrency(totalVolume)}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Open Disputes</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{openDisputes}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Merchant</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{tx.merchant}</td>
                  <td className="text-right py-3 px-4 font-semibold text-gray-900">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
