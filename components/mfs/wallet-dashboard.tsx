'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Plus, QrCode, History } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';

interface WalletDashboardProps {
  balance: number;
  currency: string;
  recentTransactions: Array<{
    id: string;
    type: 'sent' | 'received' | 'payment' | 'withdrawal';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending';
  }>;
  onSendMoney: () => void;
  onAddMoney: () => void;
  onScanQR: () => void;
}

export function WalletDashboard({
  balance,
  currency,
  recentTransactions,
  onSendMoney,
  onAddMoney,
  onScanQR,
}: WalletDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-30" />
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-90">Wallet Balance</p>
          <h1 className="text-5xl font-bold mt-2">
            {formatCurrency(balance, currency)}
          </h1>
          <p className="text-sm opacity-75 mt-4">Account Status: Active</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={onAddMoney}
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-500 hover:bg-blue-50"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-medium">Add Money</span>
        </Button>

        <Button
          onClick={onSendMoney}
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-500 hover:bg-blue-50"
        >
          <Send className="w-6 h-6" />
          <span className="text-xs font-medium">Send Money</span>
        </Button>

        <Button
          onClick={onScanQR}
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-500 hover:bg-blue-50"
        >
          <QrCode className="w-6 h-6" />
          <span className="text-xs font-medium">Scan QR</span>
        </Button>

        <Link href="/mfs/history">
          <Button
            variant="outline"
            className="h-24 w-full flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-500 hover:bg-blue-50"
          >
            <History className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </Button>
        </Link>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Link href="/mfs/history" className="text-blue-600 text-sm font-medium hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentTransactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{tx.description}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === 'sent' || tx.type === 'payment' ? 'text-red-600' : 'text-green-600'}`}>
                  {tx.type === 'sent' || tx.type === 'payment' ? '-' : '+'}
                  {formatCurrency(tx.amount)}
                </p>
                <p className={`text-xs ${tx.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {tx.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
