'use client';

import { useState } from 'react';
import UploadButton from '@/components/UploadButton';
import DownloadButton from '@/components/DownloadButton';
import type { RcFile } from 'rc-upload/lib/interface';

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
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleUploadStart = (file: RcFile) => {
    setIsUploading(true);
    setIsProcessing(true);
    setIsDownloadReady(false);
    setUploadStatus('正在上传视频...');
    setProgress(10);
    console.log('开始上传文件:', file.name);
  };

  const handleUploadProgress = (percent: number) => {
    const normalizedPercent = Math.floor(percent * 0.7); // 上传占总进度的70%
    setProgress(normalizedPercent);
    setUploadStatus(`正在上传视频... ${normalizedPercent}%`);
    console.log('上传进度:', normalizedPercent);
  };

  const handleUploadSuccess = (response: any, file: RcFile) => {
    console.log('上传成功:', response);
    setUploadStatus('处理中...');
    setProgress(70);

    // 模拟服务器端处理点云的过程
    // 在实际实现中，这里应该建立WebSocket连接或定期轮询服务器获取处理进度
    setTimeout(() => {
      setUploadStatus('生成点云...');
      setProgress(90);
    }, 2000);

    setTimeout(() => {
      setUploadStatus('下载点云文件');
      setIsProcessing(false);
      setIsUploading(false);
      setIsDownloadReady(true);
      setProgress(100);
      // 设置下载URL
      setDownloadUrl(response.url);
      message.success('视频处理完成，点云已生成');
    }, 4000);
  };

  const handleUploadError = (error: Error) => {
    console.error('上传错误:', error);
    setIsUploading(false);
    setIsProcessing(false);
    setProgress(0);
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

      {isProcessing && (
        <div className="w-full max-w-md mt-4 sm:mt-6 mb-2 sm:mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-center mt-2 text-gray-500">{uploadStatus}</p>
        </div>
      )}

      <div className="button-group mt-4 sm:mt-6">
        <UploadButton 
          isProcessing={isProcessing}
          onStart={handleUploadStart}
          onProgress={handleUploadProgress}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
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
