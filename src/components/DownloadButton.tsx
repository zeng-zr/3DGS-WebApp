'use client';

import React, { useEffect, useState } from 'react';

interface DownloadButtonProps {
  isDownloadReady: boolean;
  uploadStatus: string;
  onDownload: () => void;
}

export default function DownloadButton({ isDownloadReady, uploadStatus, onDownload }: DownloadButtonProps) {
  // 追踪组件内部状态，避免渲染问题
  const [isReady, setIsReady] = useState(isDownloadReady);
  
  // 当isDownloadReady属性变化时更新内部状态
  useEffect(() => {
    setIsReady(isDownloadReady);
    console.log('下载按钮状态更新:', isDownloadReady);
  }, [isDownloadReady]);
  
  return (
    <button 
      className={`custom-button ${!isReady ? 'disabled' : ''}`}
      disabled={!isReady}
      onClick={onDownload}
    >
      下载点云文件
    </button>
  );
} 