'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CheckoutSettings {
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
  webhookSecret: string;
  paymentMethods: string[];
  returnMethod: 'GET' | 'POST';
}

interface CheckoutSettingsProps {
  settings: CheckoutSettings;
  onSave: (settings: CheckoutSettings) => Promise<void>;
}

const AVAILABLE_PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card' },
  { id: 'bkash', label: 'bKash' },
  { id: 'nagad', label: 'Nagad' },
  { id: 'wechat', label: 'WeChat Pay' },
  { id: 'alipay', label: 'Alipay' },
];

export function CheckoutSettings({ settings, onSave }: CheckoutSettingsProps) {
  const [formData, setFormData] = useState<CheckoutSettings>(settings);
  const [loading, setLoading] = useState(false);

  const handlePaymentMethodToggle = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      toast({
        title: 'Success',
        description: 'Checkout settings saved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Return URLs</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Success URL
            </label>
            <input
              type="url"
              value={formData.successUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, successUrl: e.target.value }))
              }
              placeholder="https://your-domain.com/success"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Customer redirected here after successful payment
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancel URL
            </label>
            <input
              type="url"
              value={formData.cancelUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cancelUrl: e.target.value }))
              }
              placeholder="https://your-domain.com/cancel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Customer redirected here if payment is cancelled
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Method
            </label>
            <select
              value={formData.returnMethod}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  returnMethod: e.target.value as 'GET' | 'POST',
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="GET">GET (Recommended)</option>
              <option value="POST">POST</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Webhook Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Webhook Configuration</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={formData.webhookUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, webhookUrl: e.target.value }))
              }
              placeholder="https://your-domain.com/webhooks/payment"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll POST payment events to this URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook Secret
            </label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={formData.webhookSecret}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button variant="outline">Regenerate</Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use this secret to verify webhook signatures
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Accepted Payment Methods</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AVAILABLE_PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
            >
              <input
                type="checkbox"
                checked={formData.paymentMethods.includes(method.id)}
                onChange={() => handlePaymentMethodToggle(method.id)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="ml-3 font-medium text-gray-700">{method.label}</span>
              {formData.paymentMethods.includes(method.id) && (
                <Check className="w-4 h-4 text-green-600 ml-auto" />
              )}
            </label>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
