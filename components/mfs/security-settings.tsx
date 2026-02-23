'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Smartphone, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SecuritySettingsProps {
  twoFaEnabled: boolean;
  pinSet: boolean;
  onSetPin: (pin: string) => Promise<void>;
  onSetup2fa: (method: 'sms' | 'email' | 'authenticator') => Promise<void>;
}

export function SecuritySettings({
  twoFaEnabled,
  pinSet,
  onSetPin,
  onSetup2fa,
}: SecuritySettingsProps) {
  const [pinMode, setPinMode] = useState<'view' | 'set' | 'change'>('view');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [twoFaMethod, setTwoFaMethod] = useState<'sms' | 'email' | 'authenticator'>('sms');

  const handleSetPin = async () => {
    if (!newPin || !confirmPin) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: 'Error',
        description: 'PINs do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      toast({
        title: 'Error',
        description: 'PIN must be 4 digits',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await onSetPin(newPin);
      setNewPin('');
      setConfirmPin('');
      setPinMode('view');
      toast({
        title: 'Success',
        description: 'Transaction PIN set successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set PIN',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2fa = async () => {
    setLoading(true);
    try {
      await onSetup2fa(twoFaMethod);
      toast({
        title: 'Success',
        description: `2FA setup initiated via ${twoFaMethod}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to setup 2FA',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Security Settings</h2>
        <p className="text-gray-600">Protect your account with advanced security features</p>
      </div>

      {/* Transaction PIN */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Transaction PIN</h3>
        </div>

        {pinMode === 'view' ? (
          <div className="space-y-3">
            <p className="text-gray-600">
              {pinSet
                ? 'Your transaction PIN is set. Use it to authorize payments.'
                : 'Set a 4-digit PIN to authorize transactions.'}
            </p>
            <Button
              onClick={() => setPinMode(pinSet ? 'change' : 'set')}
              variant="outline"
            >
              {pinSet ? 'Change PIN' : 'Set PIN'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.slice(0, 4))}
                  maxLength={4}
                  placeholder="••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPin ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be 4 digits</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm PIN
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.slice(0, 4))}
                maxLength={4}
                placeholder="••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSetPin}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Confirm
              </Button>
              <Button
                onClick={() => {
                  setPinMode('view');
                  setNewPin('');
                  setConfirmPin('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            {twoFaEnabled
              ? 'Two-factor authentication is enabled on your account.'
              : 'Add an extra layer of security to your account.'}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Authentication Method
            </label>
            <div className="space-y-2">
              {['sms', 'email', 'authenticator'].map((method) => (
                <label
                  key={method}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    value={method}
                    checked={twoFaMethod === method}
                    onChange={(e) => setTwoFaMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <span className="ml-3">
                    <span className="font-medium capitalize">{method}</span>
                    <span className="text-xs text-gray-500 block">
                      {method === 'sms'
                        ? 'Receive codes via SMS'
                        : method === 'email'
                          ? 'Receive codes via email'
                          : 'Use an authenticator app'}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSetup2fa}
            disabled={loading || twoFaEnabled}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {twoFaEnabled ? '2FA Enabled' : 'Enable 2FA'}
          </Button>
        </div>
      </Card>

      {/* Security Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">Security Tips</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Never share your PIN with anyone</li>
          <li>• Use a unique 4-digit PIN that's not easily guessable</li>
          <li>• Enable 2FA for maximum account security</li>
          <li>• Regularly review your transaction history</li>
          <li>• Contact support immediately if you notice suspicious activity</li>
        </ul>
      </Card>
    </div>
  );
}
