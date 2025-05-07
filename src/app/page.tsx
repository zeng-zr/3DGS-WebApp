'use client';

import { useState } from 'react';
import UploadButton from '@/components/UploadButton';
import DownloadButton from '@/components/DownloadButton';
import type { RcFile } from 'rc-upload/lib/interface';
import { info } from 'console';

// 简单消息提示
const message = {
  success: (content: string) => {
    console.log(content);
    alert(content); 
  },
  error: (content: string) => {
    console.error(content);
    alert(content);
  },
  warning: (content: string) => {
    console.warn(content);
    alert(content);
  }
};

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<string>('下载点云文件');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleUploadStart = (file: RcFile) => {
    setIsUploading(true);
    setIsProcessing(true);
    setIsDownloadReady(false);
    setUploadStatus('正在上传视频...');
    // setProgress(10); 
    console.log('开始上传文件:', file.name);
  };

  const handleUploadProgress = (percent: number) => {
    
  };

  const handleUploadSuccess = (response: any, file: RcFile) => {
    // 回调处理uploadsucess
    setUploadStatus("上传完成");
  };

  const handleUploadError = (error: Error) => {
    console.error('上传错误:', error);
    setIsUploading(false);
    setIsProcessing(false);
    // setProgress(0);
    message.error('上传失败: ' + error.message);
  };

  const handleDownload = () => {
    if (!isDownloadReady) return;
    
    // 如果有下载URL，直接下载
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'pointcloud.ply';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      message.warning('下载链接不可用');
    }
  };

  return (
    <main className="flex flex-col items-center w-full max-w-lg px-4 mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">3D Gaussian Splatting Web App</h1>
      <p className="text-sm sm:text-base mt-2 text-gray-600 text-center">
        本应用支持基于 3D Gaussian Splatting 技术的点云重建。
        请使用手机拍摄室内视频并上传，系统将提取关键帧并生成 3D 点云供 VR 浏览。
      </p>
      <p className="invisible">占位</p> {/* 删了会报错 */}
      <div className="button-group mt-4 sm:mt-6">
        <UploadButton 
          isProcessing={isProcessing}
          onStart={handleUploadStart}
          onProgress={handleUploadProgress}
          onSuccess={handleUploadSuccess}//直接调用，跳过progress
          onError={handleUploadError}
          uploadStatus={uploadStatus} 
        />
        <DownloadButton 
          isDownloadReady={isDownloadReady} 
          uploadStatus={uploadStatus} 
          onDownload={handleDownload} 
        />
      </div>
    </main>
  );
}
