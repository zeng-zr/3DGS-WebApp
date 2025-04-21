'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<string>('下载点云文件');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setIsProcessing(true);
      setIsDownloadReady(false);
      setUploadStatus('正在上传视频...');
      setProgress(10);
      
      // 模拟上传和处理流程
      setTimeout(() => {
        setUploadStatus('提取关键帧...');
        setProgress(40);
      }, 2000);

      setTimeout(() => {
        setUploadStatus('生成点云...');
        setProgress(70);
      }, 4000);

      setTimeout(() => {
        setUploadStatus('下载点云文件');
        setIsProcessing(false);
        setIsUploading(false);
        setIsDownloadReady(true);
        setProgress(100);
      }, 6000);
    }
  };

  const handleDownload = () => {
    if (!isDownloadReady) return;
    
    // 模拟下载点云文件
    const fakeData = new Blob(['假设这是点云数据'], { type: 'text/plain' });
    const url = URL.createObjectURL(fakeData);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pointcloud.ply';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

      <div className="button-group w-full mt-4 sm:mt-6">
        {/* 上传按钮 */}
        <button 
          className="custom-button hover:bg-primary/80 transition-colors"
          onClick={handleUploadTrigger}
          disabled={isProcessing}
        >
          上传视频
        </button>
        <input 
          ref={fileInputRef}
          id="videoUpload" 
          type="file" 
          accept="video/*" 
          onChange={handleFileChange}
          hidden 
        />

        {/* 下载按钮 */}
        <button 
          className={`custom-button ${isDownloadReady ? '' : 'disabled'}`}
          disabled={!isDownloadReady}
          onClick={handleDownload}
        >
          {isDownloadReady ? '下载点云文件' : uploadStatus}
        </button>
      </div>
    </main>
  );
}
