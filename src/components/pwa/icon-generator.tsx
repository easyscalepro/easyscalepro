"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export const IconGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateIcon = (size: number, withBackground: boolean = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    if (withBackground) {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#2563EB');
      gradient.addColorStop(1, '#1e40af');
      
      // Fill background with rounded corners
      const radius = size * 0.2; // 20% radius for iOS style
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();
    }

    // Load and draw the company logo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Calculate logo size (70% of icon size with padding)
      const logoSize = size * 0.7;
      const x = (size - logoSize) / 2;
      const y = (size - logoSize) / 2;

      // Draw logo centered
      ctx.drawImage(img, x, y, logoSize, logoSize);

      // Add subtle shadow for depth
      if (withBackground) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = size * 0.02;
        ctx.shadowOffsetY = size * 0.01;
      }
    };
    
    img.src = 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png';
    
    return canvas.toDataURL('image/png');
  };

  const downloadIcon = (size: number, name: string) => {
    const dataUrl = generateIcon(size, true);
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `${name}-${size}x${size}.png`;
    link.href = dataUrl;
    link.click();
    
    toast.success(`Ícone ${size}x${size} baixado!`);
  };

  const downloadAllIcons = () => {
    const sizes = [
      { size: 57, name: 'apple-touch-icon-57x57' },
      { size: 60, name: 'apple-touch-icon-60x60' },
      { size: 72, name: 'apple-touch-icon-72x72' },
      { size: 76, name: 'apple-touch-icon-76x76' },
      { size: 114, name: 'apple-touch-icon-114x114' },
      { size: 120, name: 'apple-touch-icon-120x120' },
      { size: 144, name: 'apple-touch-icon-144x144' },
      { size: 152, name: 'apple-touch-icon-152x152' },
      { size: 180, name: 'apple-touch-icon-180x180' },
      { size: 192, name: 'android-chrome-192x192' },
      { size: 512, name: 'android-chrome-512x512' },
    ];

    sizes.forEach(({ size, name }, index) => {
      setTimeout(() => {
        downloadIcon(size, name);
      }, index * 200);
    });
  };

  return (
    <div className="hidden">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Button onClick={downloadAllIcons}>
        <Download className="h-4 w-4 mr-2" />
        Gerar Ícones PWA
      </Button>
    </div>
  );
};