'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Trash2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentToken {
  id: string;
  name: string;
  type: 'card' | 'bkash' | 'nagad' | 'wechat' | 'alipay';
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

interface SavedPaymentMethodsProps {
  tokens: PaymentToken[];
  onSetDefault: (tokenId: string) => Promise<void>;
  onDelete: (tokenId: string) => Promise<void>;
}

const PAYMENT_METHOD_ICONS: Record<string, string> = {
  card: '💳',
  bkash: '📱',
  nagad: '📱',
  wechat: '🍋',
  alipay: '👤',
};

const PAYMENT_METHOD_COLORS: Record<string, string> = {
  card: 'from-blue-500 to-blue-600',
  bkash: 'from-orange-500 to-orange-600',
  nagad: 'from-red-500 to-red-600',
  wechat: 'from-green-500 to-green-600',
  alipay: 'from-cyan-500 to-cyan-600',
};

export function SavedPaymentMethods({
  tokens,
  onSetDefault,
  onDelete,
}: SavedPaymentMethodsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSetDefault = async (tokenId: string) => {
    setLoading(tokenId);
    try {
      await onSetDefault(tokenId);
      toast({
        title: 'Success',
        description: 'Payment method set as default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set as default',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (tokenId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    setLoading(tokenId);
    try {
      await onDelete(tokenId);
      toast({
        title: 'Success',
        description: 'Payment method deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete payment method',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Saved Payment Methods</h2>
        <p className="text-gray-600">Manage your stored cards and mobile money accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tokens.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-4">No payment methods saved yet</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Add Payment Method</Button>
          </Card>
        ) : (
          tokens.map((token) => (
            <div
              key={token.id}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${PAYMENT_METHOD_COLORS[token.type]} p-6 text-white shadow-lg transition hover:shadow-xl`}
            >
              {token.isDefault && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Default
                </div>
              )}

              <div className="mb-8">
                <p className="text-2xl">{PAYMENT_METHOD_ICONS[token.type]}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm opacity-90">{token.name}</p>
                <p className="text-2xl font-mono tracking-widest">
                  •••• •••• •••• {token.lastFour}
                </p>
                {token.expiryDate && (
                  <p className="text-xs opacity-75">Exp: {token.expiryDate}</p>
                )}
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t border-white border-opacity-30">
                {!token.isDefault && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={() => handleSetDefault(token.id)}
                    disabled={loading === token.id}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Set Default
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={() => handleDelete(token.id)}
                  disabled={loading === token.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Method Button */}
      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12">
        + Add New Payment Method
      </Button>
    </div>
  );
}
