'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (data: string) => Promise<void>;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create a canvas element and read the image
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          // In a real app, you'd use a QR code library like jsQR
          // For now, we'll show a placeholder
          toast({
            title: 'QR Code Uploaded',
            description: 'Processing QR code data...',
          });
          // Simulate QR code scanning
          await onScan('qr_data_from_upload');
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to scan QR code',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">QR Code Scanner</h2>
        <p className="text-gray-600">Scan QR codes for quick payments and transfers</p>
      </div>

      {/* Camera Scanner */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scan with Camera</h3>

        <div className="bg-gray-900 rounded-lg aspect-square flex items-center justify-center mb-4 overflow-hidden relative">
          {scanning ? (
            <div className="relative w-full h-full">
              <video
                className="w-full h-full"
                onPlay={() => {
                  // Start camera scanning
                }}
              />
              <div className="absolute inset-0 border-2 border-green-400 m-12 rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 border-4 border-green-400 rounded-lg opacity-50 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Ready to scan</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setScanning(!scanning)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {scanning ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4 mr-2" />
                Start Camera
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* File Upload */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload QR Code Image</h3>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">PNG, JPG, or GIF (max 5MB)</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </Card>

      {/* Success Message */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h4 className="font-semibold text-green-900 mb-2">Payment Ready</h4>
        <p className="text-sm text-green-800">
          After scanning, you'll review the payment details before confirming.
        </p>
      </Card>
    </div>
  );
}
