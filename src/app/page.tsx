'use client';

import { useState, useEffect, useRef } from 'react';
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

// 获取动态WebSocket地址
const getWebSocketUrl = () => {
  // 从当前URL获取主机名和协议
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const port = '3002'; // 处理服务器端口
  
  // 确保使用服务器的IP地址而不是localhost
  // 当从其他设备连接时，需要使用服务器的公网IP或局域网IP
  return `${protocol}//${host}:${port}`;
};

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<string>('下载点云文件');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  
  // WebSocket引用
  const wsRef = useRef<WebSocket | null>(null);

  // 用于清理WebSocket连接
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        setWsConnected(false);
      }
    };
  }, []);

  // 创建WebSocket连接
  const connectWebSocket = (newJobId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const wsUrl = `${getWebSocketUrl()}/?jobId=${newJobId}`;
    console.log('连接WebSocket:', wsUrl);
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket已连接');
        setWsConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('收到WebSocket消息:', data);
          
          // 根据状态更新UI
          if (data.progress !== undefined) {
            setProgress(data.progress);
          }
          
          if (data.stage) {
            // 根据不同阶段更新状态文本
            switch (data.stage) {
              case 'initializing':
                setUploadStatus('初始化处理...');
                break;
              case 'extracting_frames':
                setUploadStatus(`提取视频帧 (${data.progress}%)...`);
                break;
              case 'frames_extracted':
                setUploadStatus(`已提取${data.framesCount}帧 (${data.progress}%)...`);
                break;
              case 'ready':
                setUploadStatus('处理完成，可下载点云');
                break;
              case 'error':
                setUploadStatus('处理失败: ' + (data.error || '未知错误'));
                setIsProcessing(false);
                break;
              default:
                setUploadStatus(`处理中: ${data.stage} (${data.progress}%)`);
            }
          }
          
          // 更新处理状态
          if (data.status === 'completed') {
            setIsProcessing(false);
            setIsDownloadReady(true);
            setUploadStatus('处理完成，可下载点云');
            
            // 设置下载URL，确保包含所有必要参数
            const downloadUrlPath = `/api/download?jobId=${data.jobId}&framesDir=${encodeURIComponent(data.framesDir || '')}`;
            console.log('设置下载URL:', downloadUrlPath);
            setDownloadUrl(downloadUrlPath);
            
            return true; // 结束轮询
          } else if (data.status === 'failed') {
            setIsProcessing(false);
            setIsDownloadReady(false);
            setUploadStatus('处理失败: ' + (data.error || '未知错误'));
            message.error('处理失败: ' + (data.error || '未知错误'));
            return true; // 结束轮询
          }
        } catch (error) {
          console.error('WebSocket消息解析错误:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        setWsConnected(false);
        
        // 显示错误消息，但不要中断用户体验
        setUploadStatus('无法连接到处理服务器，但文件已上传');
      };
      
      ws.onclose = () => {
        console.log('WebSocket连接已关闭');
        setWsConnected(false);
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
      setUploadStatus('无法连接到处理服务器，但文件已上传');
    }
  };

  const handleUploadStart = (file: RcFile) => {
    setIsUploading(true);
    setIsProcessing(true);
    setIsDownloadReady(false);
    setUploadStatus('正在上传视频...');
    setProgress(0);
    console.log('开始上传文件:', file.name);
  };

  const handleUploadProgress = (percent: number) => {
    if (percent <= 100) {
      setProgress(Math.floor(percent));
    }
  };

  const handleUploadSuccess = (response: any, file: RcFile) => {
    console.log('上传成功，响应:', response);
    setUploadStatus("上传完成，准备处理...");
    
    // 如果响应中包含jobId，则连接WebSocket
    if (response && response.jobId) {
      setJobId(response.jobId);
      // 创建WebSocket连接接收处理状态
      connectWebSocket(response.jobId);
      
      // 即使WebSocket连接失败，也设置一个定时器来轮询状态
      if (!wsConnected) {
        setTimeout(() => {
          if (!wsConnected) {
            // WebSocket连接超时，使用轮询作为备选方案
            pollJobStatus(response.jobId);
          }
        }, 3000); // 3秒后检查连接状态
      }
    } else {
      console.error('响应中缺少jobId:', response);
      setIsProcessing(false);
      setUploadStatus('上传完成，但无法跟踪处理状态');
    }
  };
  
  // 轮询作业状态（作为WebSocket的备选方案）
  const pollJobStatus = (jobId: string) => {
    const checkStatus = async () => {
      try {
        // 使用新的API端点
        const response = await fetch(`/api/job-status?jobId=${jobId}`);
        if (response.ok) {
          const data = await response.json();
          
          // 更新UI，与WebSocket处理逻辑相同
          if (data.progress !== undefined) {
            setProgress(data.progress);
          }
          
          if (data.stage) {
            switch (data.stage) {
              case 'initializing':
                setUploadStatus('初始化处理...');
                break;
              case 'extracting_frames':
                setUploadStatus(`提取视频帧 (${data.progress}%)...`);
                break;
              case 'frames_extracted':
                setUploadStatus(`已提取${data.framesCount}帧 (${data.progress}%)...`);
                break;
              case 'ready':
                setUploadStatus('处理完成，可下载点云');
                break;
              default:
                setUploadStatus(`处理中: ${data.stage} (${data.progress}%)`);
            }
          }
          
          if (data.status === 'completed') {
            setIsProcessing(false);
            setIsDownloadReady(true);
            setUploadStatus('处理完成，可下载点云');
            
            // 设置下载URL，确保包含所有必要参数
            const downloadUrlPath = `/api/download?jobId=${data.jobId}&framesDir=${encodeURIComponent(data.framesDir || '')}`;
            console.log('设置下载URL:', downloadUrlPath);
            setDownloadUrl(downloadUrlPath);
            
            return true; // 结束轮询
          } else if (data.status === 'failed') {
            setIsProcessing(false);
            setIsDownloadReady(false);
            setUploadStatus('处理失败: ' + (data.error || '未知错误'));
            message.error('处理失败: ' + (data.error || '未知错误'));
            return true; // 结束轮询
          }
          
          // 继续轮询
          return false;
        }
      } catch (error) {
        console.error('轮询状态失败:', error);
      }
      return false;
    };
    
    // 开始轮询
    const poll = async () => {
      const done = await checkStatus();
      if (!done && !wsConnected) {
        setTimeout(poll, 4000); // 每4秒轮询一次
      }
    };
    
    poll();
  };

  const handleUploadError = (error: Error) => {
    console.error('上传错误:', error);
    setIsUploading(false);
    setIsProcessing(false);
    setProgress(0);
    message.error('上传失败: ' + error.message);
  };

  const handleDownload = () => {
    console.log('触发下载事件, 下载就绪状态:', isDownloadReady, '下载URL:', downloadUrl);
    
    if (!isDownloadReady) {
      console.log('下载未就绪，无法下载');
      return;
    }
    
    // 如果有下载URL，直接下载
    if (downloadUrl) {
      console.log('开始下载文件, URL:', downloadUrl);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `pointcloud_${jobId || 'unknown'}.ply`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.log('下载URL不可用');
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
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          uploadStatus={uploadStatus} 
        />
        <DownloadButton 
          isDownloadReady={isDownloadReady} 
          uploadStatus={uploadStatus} 
          onDownload={handleDownload} 
        />
      </div>
      {/* {isProcessing && progress > 0 && (
        <div className="w-full mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-center mt-2">{progress}%</p>
        </div>
      )} */}
    </main>
  );
}
