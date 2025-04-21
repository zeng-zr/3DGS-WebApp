# 3D Gaussian Splatting Web App

基于 Next.js 和 React 开发的 3D Gaussian Splatting 点云重建应用，支持视频上传和点云生成。

## 第一部分：部署和运行

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装步骤

1. 克隆仓库到本地
```bash
git clone https://github.com/yourusername/3DGS-WebApp.git
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
