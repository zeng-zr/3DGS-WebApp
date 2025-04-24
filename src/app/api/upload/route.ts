import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 设置上传目录
const uploadDir = join(process.cwd(), 'uploads');

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

    // 返回成功响应
    return NextResponse.json({
      success: true,
      fileName,
      url: `/uploads/${fileName}`,
      message: '文件上传成功'
    });
  } catch (error) {
    console.error('Upload error:', error);
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