'use client';

import React from 'react';
import Upload from 'rc-upload';
import type { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';
import { 
  MAX_FILE_SIZE, 
  ACCEPTED_FILE_TYPES, 
  UPLOAD_API_ENDPOINT, 
  UPLOAD_CONFIG 
} from '@/config/upload';

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
    formData.append(UPLOAD_CONFIG.fileFieldName, file);
    
    try {
      // 发送请求到上传API端点
      const response = await fetch(UPLOAD_API_ENDPOINT, {
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
    accept: ACCEPTED_FILE_TYPES.join(','),
    customRequest,
    beforeUpload: (file: RcFile) => {
      // 检查文件类型
      const isAcceptedType = ACCEPTED_FILE_TYPES.some(type => file.type === type);
      if (!isAcceptedType) {
        message.error(UPLOAD_CONFIG.fileTypesText);
        return false;
      }
      
      // 检查文件大小
      const isLtMaxSize = file.size / 1024 / 1024 < MAX_FILE_SIZE;
      if (!isLtMaxSize) {
        message.error(UPLOAD_CONFIG.fileSizeText);
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