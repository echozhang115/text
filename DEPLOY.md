# Vercel 部署指南

## 问题说明

如果遇到 404 错误，通常是因为 Vue Router 的 history 模式需要服务器配置来重定向所有路由到 `index.html`。

## 部署步骤

### 方式一：只部署前端（推荐用于测试）

1. **在 Vercel 中配置项目根目录为 `frontend`**
   - 进入 Vercel 项目设置
   - 找到 "Root Directory" 设置
   - 设置为 `frontend`

2. **构建配置**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **环境变量（如果需要）**
   - 在 Vercel 项目设置中添加环境变量
   - `VITE_API_BASE_URL`: 你的后端 API 地址（如果后端单独部署）

### 方式二：使用 vercel.json 配置（当前项目根目录）

项目根目录已有 `vercel.json` 和 `frontend/vercel.json` 配置文件。

**重要**：在 Vercel 项目设置中，将 **Root Directory** 设置为 `frontend`

### 方式三：部署前后端（完整部署）

#### 前端部署
1. 在 Vercel 中创建新项目
2. 连接 GitHub 仓库
3. 设置 Root Directory 为 `frontend`
4. 构建命令：`npm run build`
5. 输出目录：`dist`

#### 后端部署
后端需要单独部署，可以选择：

**选项 A：部署到 Vercel Serverless Functions**
1. 创建 `api/` 目录在项目根目录
2. 将后端 API 转换为 serverless functions
3. 配置 vercel.json

**选项 B：部署到其他平台**
- Railway
- Render
- Heroku
- 或自己的服务器

**选项 C：使用 Vercel 的 API Routes**
创建 `api/analyze.js` 作为 serverless function

## 当前配置说明

项目已包含 `frontend/vercel.json` 配置文件，它会：
- 将所有路由重定向到 `index.html`（解决 404 问题）
- 配置正确的构建命令和输出目录

## 验证部署

部署成功后：
1. 访问你的 Vercel 域名
2. 应该能看到上传页面（不是 404）
3. 如果看到 404，检查 Root Directory 设置

## 后端 API 部署

由于后端需要环境变量（豆包 API Token），建议：

1. **使用 Vercel Serverless Functions**
   - 创建 `api/analyze.js`
   - 在 Vercel 环境变量中配置 `DOUBAO_TOKEN`

2. **或单独部署后端**
   - 部署到 Railway/Render 等平台
   - 更新前端的 `VITE_API_BASE_URL` 环境变量

## 常见问题

### Q: 仍然看到 404
A: 确保在 Vercel 项目设置中将 Root Directory 设置为 `frontend`

### Q: API 调用失败
A: 需要部署后端 API，或配置正确的 API 地址

### Q: 构建失败
A: 检查 Node.js 版本（建议 18+），确保所有依赖都正确安装

