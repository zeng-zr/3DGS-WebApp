'use client';

import React from 'react';
import Upload from 'rc-upload';
import type { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';

interface UploadButtonProps {
  isProcessing: boolean;
  onProgress: (percent: number, file: RcFile) => void;
  onStart: (file: RcFile) => void;
  onSuccess: (response: any, file: RcFile) => void;
  onError: (error: Error, response?: any, file?: RcFile) => void;
}

// 简单消息提示替代antd
const message = {
  error: (content: string) => {
    console.error(content);
    alert(content);
  }
};

export default function UploadButton({ 
  isProcessing, 
  onProgress, 
  onStart, 
  onSuccess, 
  onError 
}: UploadButtonProps) {
  
  const customRequest = async (options: UploadRequestOption) => {
    const { file, onProgress, onSuccess, onError } = options;
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // 发送请求到上传API端点
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      onSuccess?.(data, options.file);
    } catch (error) {
      onError?.(error as Error);
    }
  };
  
  const uploadProps = {
    accept: 'video/*',
    customRequest,
    beforeUpload: (file: RcFile) => {
      // 检查文件类型
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('请上传视频文件!');
        return false;
      }
      
      // 检查文件大小 (假设最大文件大小是500MB)
      const isLt500M = file.size / 1024 / 1024 < 500;
      if (!isLt500M) {
        message.error('视频文件必须小于500MB!');
        return false;
      }
      
      return true;
    },
    onStart,
    onProgress,
    onSuccess,
    onError,
    disabled: isProcessing,
  };

  return (
    <Upload {...uploadProps}>
      <button 
        className="custom-button hover:bg-primary/80 transition-colors"
        disabled={isProcessing}
      >
        上传视频文件
      </button>
    </Upload>
  );
} 