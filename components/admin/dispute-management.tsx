'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { toast } from '@/hooks/use-toast';

interface Dispute {
  id: string;
  transactionId: string;
  complainant: string;
  respondent: string;
  amount: number;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdDate: string;
  messages: Array<{
    id: string;
    author: string;
    message: string;
    date: string;
  }>;
}

interface DisputeManagementProps {
  disputes: Dispute[];
  onResolveDispute: (disputeId: string, resolution: string) => Promise<void>;
  onRefund: (disputeId: string, amount: number) => Promise<void>;
}

export function DisputeManagement({
  disputes,
  onResolveDispute,
  onRefund,
}: DisputeManagementProps) {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    if (!selectedDispute || !resolution.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a resolution',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await onResolveDispute(selectedDispute.id, resolution);
      setResolution('');
      setSelectedDispute(null);
      toast({
        title: 'Success',
        description: 'Dispute resolved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve dispute',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedDispute || !refundAmount) {
      toast({
        title: 'Error',
        description: 'Please enter refund amount',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await onRefund(selectedDispute.id, parseFloat(refundAmount));
      setRefundAmount('');
      toast({
        title: 'Success',
        description: 'Refund processed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process refund',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Disputes List */}
      <div className="lg:col-span-1">
        <Card className="p-6 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Disputes</h3>
          <div className="space-y-2">
            {disputes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No disputes</p>
            ) : (
              disputes.map((dispute) => (
                <button
                  key={dispute.id}
                  onClick={() => setSelectedDispute(dispute)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${
                    selectedDispute?.id === dispute.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{dispute.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">{dispute.transactionId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(dispute.status)}`}>
                      {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Dispute Details */}
      <div className="lg:col-span-2">
        {selectedDispute ? (
          <Card className="p-6 space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDispute.reason}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    TX ID: {selectedDispute.transactionId}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedDispute.status)}`}>
                  {selectedDispute.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Complainant</p>
                  <p className="font-medium text-gray-900">{selectedDispute.complainant}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">{formatCurrency(selectedDispute.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">{selectedDispute.createdDate}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Communication
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto space-y-3">
                {selectedDispute.messages.map((msg) => (
                  <div key={msg.id} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium text-sm text-gray-900">{msg.author}</p>
                      <p className="text-xs text-gray-500">{msg.date}</p>
                    </div>
                    <p className="text-sm text-gray-700">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Actions */}
            {selectedDispute.status !== 'closed' && (
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Describe the resolution..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Amount (if applicable)
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleResolve}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve Dispute
                  </Button>
                  {refundAmount && (
                    <Button
                      onClick={handleRefund}
                      disabled={loading}
                      variant="outline"
                    >
                      Process Refund
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Card className="p-6 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a dispute to view details</p>
          </Card>
        )}
      </div>
    </div>
  );
}
