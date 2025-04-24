# 3D Gaussian Splatting Web App

这是一个基于 Next.js 的 3D Gaussian Splatting 点云重建应用。用户可以上传视频，系统会处理并生成3D点云文件供下载和浏览。

## 功能特点

- 视频上传：支持上传视频文件进行3D重建
- 实时进度：显示上传和处理进度
- 点云下载：重建完成后可下载点云文件

## 开发指南

### 当前实现

当前实现使用 rc-upload 组件处理文件上传，并将文件保存在本地的 `uploads` 目录中。处理步骤基于模拟，没有实际的3D点云生成功能。

### 实际服务器集成步骤

要将此应用集成到实际服务器环境，请按照以下步骤操作：

1. **设置服务器端点**：
   - 修改 `src/components/UploadButton.tsx` 中的 API 端点，指向您的实际服务器 URL：
   ```typescript
   const response = await fetch('https://your-api-server.com/api/upload', {
     method: 'POST',
     body: formData,
   });
   ```

2. **实现3D Gaussian Splatting 处理逻辑**：
   - 在服务器上，接收上传的视频文件
   - 提取关键帧
   - 使用 Gaussian Splatting 算法生成点云
   - 提供点云文件下载链接或 WebRTC 实时预览
   - 考虑使用 WebSocket 或轮询机制实时更新处理进度

3. **处理进度跟踪**：
   - 替换 `handleUploadSuccess` 中的模拟进度更新，使用 WebSocket 或轮询 API 获取实际处理进度：
   ```typescript
   // 示例：建立 WebSocket 连接
   const ws = new WebSocket(`wss://your-api-server.com/ws/job/${jobId}`);
   ws.onmessage = (event) => {
     const data = JSON.parse(event.data);
     setProgress(data.progress);
     setUploadStatus(data.status);
     
     if (data.completed) {
       setIsDownloadReady(true);
       setDownloadUrl(data.downloadUrl);
       ws.close();
     }
   };
   ```

4. **安全性考虑**：
   - 添加身份验证机制
   - 实现文件大小和类型的服务器端验证
   - 使用 HTTPS 保护数据传输
   - 考虑添加上传速率限制和防滥用措施

5. **资源管理**：
   - 实现文件过期和清理机制
   - 监控服务器资源使用情况
   - 考虑使用云存储服务（如 AWS S3）存储上传的视频和生成的点云文件

## 技术栈

- Next.js
- React
- rc-upload
- 3D Gaussian Splatting 算法 (服务器端实现)

## 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 第一部分：部署和运行

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装步骤

1. 克隆仓库到本地
```bash
git clone https://github.com/zeng-zr/3DGS-WebApp.git
cd 3DGS-WebApp
```

2. 安装依赖
```bash
npm install
```

3. 运行开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 生产环境部署

1. 构建应用
```bash
npm run build
```

2. 启动生产服务器
```bash
npm run start
```

### 部署到 Vercel

作为 Next.js 应用，可以轻松部署到 Vercel 平台：

1. 在 [Vercel](https://vercel.com) 创建账号并连接 GitHub 仓库
2. 导入项目并自动部署

### 学习资源

要深入了解本项目使用的技术，请参考以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [React 官方文档](https://react.dev) - 学习 React 基础和高级概念
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - 学习使用的 CSS 框架
- [3D Gaussian Splatting 论文](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/) - 了解底层技术原理

## 第二部分：开发内容

本项目是基于 3D Gaussian Splatting 技术的前端应用，主要完成了以下功能：

### 核心功能

1. **视频上传功能**
   - 支持用户上传手机拍摄的室内视频
   - 文件格式验证和上传状态反馈

2. **处理流程可视化**
   - 上传进度显示
   - 关键帧提取状态展示
   - 点云生成过程可视化

3. **点云文件下载**
   - 生成完成后支持下载点云文件
   - 文件命名和类型处理

### 技术特性

1. **响应式设计**
   - 适配桌面和移动设备
   - 针对触摸设备优化的交互体验

2. **现代 UI/UX**
   - 简洁直观的用户界面
   - 状态反馈和进度指示
   - 流畅的动画过渡效果

3. **技术栈**
   - Next.js 15 App Router
   - React 19 客户端组件
   - Tailwind CSS 4 样式系统
   - TypeScript 类型检查

### 未来计划

- 集成后端 API 进行真实视频处理
- 添加点云预览功能
- 支持更多文件格式和处理选项
- 实现 VR 浏览模式
