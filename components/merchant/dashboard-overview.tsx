'use client';

import { Card } from '@/components/ui/card';
import { CreditCard, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface MerchantOverviewProps {
  transactions: number;
  volume: number;
  settlementBalance: number;
  pendingSettlement: number;
  recentPayments: Array<{
    id: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    customer: string;
  }>;
}

export function MerchantDashboardOverview({
  transactions,
  volume,
  settlementBalance,
  pendingSettlement,
  recentPayments,
}: MerchantOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Volume</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {formatCurrency(volume)}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Transactions</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{transactions}</p>
            </div>
            <CreditCard className="w-12 h-12 text-green-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Settlement Balance</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {formatCurrency(settlementBalance)}
              </p>
            </div>
            <Wallet className="w-12 h-12 text-purple-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {formatCurrency(pendingSettlement)}
              </p>
            </div>
            <ArrowUpRight className="w-12 h-12 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
        <div className="space-y-3">
          {recentPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{payment.customer}</p>
                <p className="text-sm text-gray-500">{payment.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    payment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
