import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  
  // 定义专门处理跨域请求的配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  }
};

export default nextConfig;
