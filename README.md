# 个人动态分析助手

基于豆包大模型的个人动态分析 H5 网页应用，帮助用户分析目标对象的个人动态，找出共同话题。

## 功能特性

- 📸 支持上传 5-20 张个人动态截图
- 🤖 使用豆包大模型（doubao-seed-1.6-thinking）进行多模态分析
- 💡 智能生成共同话题和聊天建议
- 📊 展示个人画像分析结果
- 📥 支持导出分析报告

## 技术栈

### 前端
- Vue 3
- Vite
- Vant UI
- Pinia
- Axios

### 后端
- Node.js
- Express
- 豆包大模型 API

## 快速开始

### 1. 安装依赖

```bash
npm run install:all
```

### 2. 配置环境变量

复制后端环境变量示例文件：

```bash
cp backend/env.example backend/.env
```

编辑 `backend/.env`，填入你的豆包 API Token：

```env
DOUBAO_TOKEN=your_token_here
```

**注意**：你需要从火山引擎获取有效的 API Token。Token 格式类似：`e1274865-0de9-4d08-bd1d-e0325bbb4d51`

### 3. 启动开发服务器

同时启动前端和后端：

```bash
npm run dev
```

或者分别启动：

```bash
# 启动后端（端口 3001）
npm run dev:backend

# 启动前端（端口 3000）
npm run dev:frontend
```

### 4. 访问应用

打开浏览器访问：http://localhost:3000

## 项目结构

```
.
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── views/    # 页面组件
│   │   ├── api/      # API 接口
│   │   └── router/   # 路由配置
│   └── package.json
├── backend/           # 后端项目
│   ├── services/     # 业务服务
│   └── server.js     # 服务器入口
├── PRD.md            # 产品需求文档
└── package.json      # 根目录配置
```

## API 说明

### 分析接口

**POST** `/api/analyze`

请求体：
```json
{
  "images": [
    "data:image/jpeg;base64,...",
    "data:image/jpeg;base64,..."
  ]
}
```

响应：
```json
{
  "success": true,
  "data": {
    "profile": {
      "interests": ["兴趣1", "兴趣2"],
      "personality": "性格特点",
      "lifestyle": "生活方式"
    },
    "topics": [
      {
        "title": "话题标题",
        "description": "话题描述",
        "score": 8,
        "opener": "开场白建议"
      }
    ],
    "suggestions": ["建议1", "建议2"]
  }
}
```

## 注意事项

1. 图片不进行任何存储，仅在内存中处理
2. 需要至少上传 5 张图片才能开始分析
3. 单张图片最大 10MB，总大小不超过 50MB
4. 需要有效的豆包 API Token 才能使用

## 开发计划

- [x] 项目基础架构
- [x] 图片上传功能
- [x] 豆包大模型集成
- [x] 结果展示页面
- [x] 导出功能
- [ ] 性能优化
- [ ] 错误处理完善
- [ ] 用户体验优化

## 许可证

MIT

