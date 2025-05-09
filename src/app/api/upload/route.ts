// 在src/app/api/upload/route.ts中添加处理服务通知代码
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 设置上传目录
const uploadDir = join(process.cwd(), 'uploads');
// 处理服务器API地址
const PROCESSOR_API = 'http://localhost:3002/api/process';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded' },
      { status: 400 }
    );
  }

  try {
    // 确保上传目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 创建文件名
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    // 写入文件
    await writeFile(filePath, buffer);
    console.log(`[Debug] 文件已保存: ${filePath}`);

    // 通知处理服务器开始处理视频
    console.log(`[Debug] 正在通知处理服务器: ${PROCESSOR_API} 处理文件: ${filePath}`);
    try {
      const processorResponse = await fetch(PROCESSOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath,
          fileName,
          jobId: timestamp.toString()
        }),
      });
      
      if (!processorResponse.ok) {
        console.error(`[Debug] 处理服务器响应失败: ${processorResponse.status} - ${processorResponse.statusText}`);
        throw new Error(`处理服务器响应失败: ${processorResponse.status}`);
      }

      console.log(`[Debug] 处理服务器响应成功: ${processorResponse.status}`);
      const processorData = await processorResponse.json();
      console.log(`[Debug] 处理服务器返回数据:`, processorData);

      // 返回成功响应和处理作业ID
      return NextResponse.json({
        success: true,
        fileName,
        url: `/uploads/${fileName}`,
        message: '文件上传成功',
        jobId: processorData.jobId
      });
    } catch (fetchError: any) {
      console.error(`[Debug] 通知处理服务器失败:`, fetchError);
      // 即使处理服务器通知失败，我们仍然返回成功，但添加错误信息
      return NextResponse.json({
        success: true,
        fileName,
        url: `/uploads/${fileName}`,
        message: '文件上传成功，但处理服务通知失败',
        error: fetchError.message
      });
    }
  } catch (error) {
    console.error('[Debug] 上传错误:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Disabling built-in bodyParser to handle file uploads
  },
};