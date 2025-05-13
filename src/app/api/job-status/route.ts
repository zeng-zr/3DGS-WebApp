import { NextRequest, NextResponse } from 'next/server';

// 处理服务器API地址 - 使用服务器内部IP而不是localhost
const PROCESSOR_API = 'http://127.0.0.1:3002/api';

export async function GET(request: NextRequest) {
  try {
    // 从查询参数中获取jobId
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // 请求处理服务器获取作业状态
    const response = await fetch(`${PROCESSOR_API}/status/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error fetching job status: ${response.status}` },
        { status: response.status }
      );
    }

    // 解析并返回处理服务器的响应
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching job status:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
} 