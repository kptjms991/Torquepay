'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  keyName: string;
  publicKey: string;
  secretKey: string;
  testMode: boolean;
  lastUsed: string | null;
  createdAt: string;
}

interface ApiKeyManagerProps {
  keys: ApiKey[];
  onGenerateKey: (name: string) => Promise<void>;
  onDeleteKey: (keyId: string) => Promise<void>;
}

export function ApiKeyManager({ keys, onGenerateKey, onDeleteKey }: ApiKeyManagerProps) {
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Key copied to clipboard',
    });
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a key name',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await onGenerateKey(newKeyName);
      setNewKeyName('');
      toast({
        title: 'Success',
        description: 'API key generated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate API key',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate New Key */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Generate New API Key</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Key name (e.g., 'Production', 'Mobile App')"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleGenerateKey}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>
      </Card>

      {/* API Keys List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your API Keys</h3>
        <div className="space-y-4">
          {keys.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No API keys yet. Generate one to get started.</p>
          ) : (
            keys.map((key) => (
              <div key={key.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{key.keyName}</p>
                    <p className="text-sm text-gray-500">
                      {key.testMode ? 'Test Mode' : 'Live Mode'} • Created{' '}
                      {new Date(key.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      key.testMode
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {key.testMode ? 'TEST' : 'LIVE'}
                  </span>
                </div>

                {/* Public Key */}
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <p className="text-sm font-medium text-gray-600">Public Key</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-white p-2 border border-gray-200 rounded font-mono break-all">
                      {key.publicKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(key.publicKey)}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Secret Key */}
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <p className="text-sm font-medium text-gray-600">Secret Key</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-white p-2 border border-gray-200 rounded font-mono break-all">
                      {visibleKeys.has(key.id) ? key.secretKey : '••••••••••••••••'}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(key.id)}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(key.secretKey)}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {key.lastUsed && (
                  <p className="text-xs text-gray-500">Last used: {new Date(key.lastUsed).toLocaleString()}</p>
                )}

                {/* Delete Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => onDeleteKey(key.id)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
