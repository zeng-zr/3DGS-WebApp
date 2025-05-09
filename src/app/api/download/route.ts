import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readdir } from 'fs/promises';

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Check job status (perhaps using a jobId from the query params)
    // 2. Generate or retrieve the processed point cloud file
    // 3. Return it as an attachment

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId parameter' },
        { status: 400 }
      );
    }

    // 如果没有提供framesDir，尝试使用默认路径
    const basePath = framesDir || path.join(process.cwd(), '..', '3DGS-Processor', 'extracted_frames', jobId);
    
    if (!fs.existsSync(basePath)) {
      return NextResponse.json(
        { error: 'Frames directory not found' },
        { status: 404 }
      );
    }

    // 获取目录中的帧文件
    const files = await readdir(basePath);
    const frameFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));

    // 创建一个简单的点云数据（实际应用中应该是从COLMAP等处理后的数据）
    const pointCloudData = `ply
format ascii 1.0
comment Generated from ${frameFiles.length} frames
element vertex ${frameFiles.length * 10}
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
end_header
${generateMockPointCloud(frameFiles.length * 10)}
`;
    
    const response = new NextResponse(pointCloudData, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="pointcloud_${jobId}.ply"`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, message: 'Download failed', error: String(error) },
      { status: 500 }
    );
  }
}

// 生成模拟点云数据的辅助函数
function generateMockPointCloud(numPoints: number) {
  let result = '';
  for (let i = 0; i < numPoints; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 10;
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    result += `${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)} ${r} ${g} ${b}\n`;
  }
  return result;
} 