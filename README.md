# 3DGS-WebApp

基于Next.js的3D Gaussian Splatting Web前端应用，提供视频上传和点云可视化功能。

## 功能概述

3DGS-WebApp是一个现代化的Web应用，作为3D Gaussian Splatting处理系统的前端界面。主要功能包括：

- 视频文件上传和处理
- 实时处理进度显示
- 3D点云数据下载
- 响应式设计，适配多种设备

本应用与[3DGS-Processor](https://github.com/your-username/3DGS-Processor)后端服务配合使用，构成完整的3D Gaussian Splatting处理系统。

## 技术栈

- **框架**：Next.js 15
- **UI**：React 19 + Tailwind CSS
- **上传**：rc-upload
- **通信**：WebSocket + RESTful API
- **构建工具**：Turbopack

## 安装与使用

### 前提条件

- Node.js (v18+)
- 配置好的3DGS-Processor后端服务

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/3DGS-WebApp.git
cd 3DGS-WebApp

# 安装依赖
npm install
```

### 配置

主要配置文件包括：

- `next.config.ts`：Next.js配置，包括跨域设置
- `src/config/upload.ts`：上传文件配置
- `src/app/page.tsx`：WebSocket连接配置

### 运行

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产版本
npm run start
```

## 项目结构

```
3DGS-WebApp/
├── public/               # 静态资源
├── src/
│   ├── app/              # 应用路由和页面
│   │   ├── api/          # API路由
│   │   │   ├── download/ # 下载API
│   │   │   ├── status/   # 状态查询API
│   │   │   └── upload/   # 上传API
│   │   ├── globals.css   # 全局样式
│   │   ├── layout.tsx    # 全局布局
│   │   └── page.tsx      # 主页面
│   ├── components/       # 可复用组件
│   │   ├── DownloadButton.tsx
│   │   └── UploadButton.tsx
│   └── config/           # 配置文件
├── uploads/              # 上传文件存储
├── .next/                # Next.js生成文件
├── next.config.ts        # Next.js配置
├── package.json          # 项目依赖
└── README.md             # 项目文档
```

## 工作流程

1. 用户通过界面上传视频文件
2. WebApp将文件保存到`uploads`目录
3. WebApp通知3DGS-Processor开始处理
4. WebApp通过WebSocket接收处理进度更新
5. 处理完成后，用户可下载生成的点云文件

## 与3DGS-Processor的集成

本应用通过以下方式与3DGS-Processor后端集成：

1. 上传API：将上传的视频传递给处理服务
2. WebSocket：接收实时处理进度
3. 状态API：作为WebSocket的备用方案查询处理状态
4. 下载API：获取处理完成的点云文件

## 未来开发计划

### 短期目标

1. **3D可视化**
   - 集成Three.js进行浏览器内点云预览
   - 添加基本的相机控制和交互功能
   - 支持不同格式的点云渲染

2. **用户体验优化**
   - 添加拖放上传功能
   - 增强移动端支持
   - 添加视频预览功能

3. **错误处理增强**
   - 更友好的错误信息展示
   - 重试机制
   - 离线支持

### 中期目标

1. **高级3D交互**
   - 点云编辑功能
   - 支持材质和光照调整
   - 多视角相机配置

2. **多媒体支持**
   - 支持图片集合上传
   - 支持从URL导入
   - 添加图库和历史记录

3. **用户管理**
   - 添加用户认证
   - 项目管理
   - 结果分享功能

### 长期目标

1. **VR/AR集成**
   - 支持WebXR的VR/AR展示
   - 沉浸式交互体验
   - 空间音频支持

2. **协作功能**
   - 实时多用户协作
   - 注释和评论
   - 版本控制

3. **高级渲染**
   - 实时光照和阴影
   - 环境映射
   - 后期处理效果

## 贡献指南

欢迎贡献代码、报告问题或提出改进建议！请遵循以下步骤：

1. Fork项目并创建你的特性分支
2. 添加注释并提交变更
3. 推送到你的分支
4. 创建一个Pull Request

## 许可证

[MIT](LICENSE)
