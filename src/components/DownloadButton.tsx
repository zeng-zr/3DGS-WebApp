'use client';

import React from 'react';

interface DownloadButtonProps {
  isDownloadReady: boolean;
  uploadStatus: string;
  onDownload: () => void;
}

export default function DownloadButton({ isDownloadReady, uploadStatus, onDownload }: DownloadButtonProps) {
  return (
    <button 
      className={`custom-button ${isDownloadReady ? '' : 'disabled'}`}
      disabled={!isDownloadReady}
      onClick={onDownload}
    >
      下载点云文件
    </button>
  );
} 