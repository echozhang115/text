# Vercel 部署快速设置

## 解决 404 问题的关键步骤

### 1. 在 Vercel 项目设置中配置 Root Directory

**这是最重要的步骤！**

1. 进入 Vercel 项目设置（Settings）
2. 找到 "General" → "Root Directory"
3. 设置为：`frontend`
4. 保存

### 2. 构建配置（如果 Root Directory 设置后仍需要）

- **Build Command**: `npm run build`（或留空，Vercel 会自动检测）
- **Output Directory**: `dist`（或留空）
- **Install Command**: `npm install`（或留空）

### 3. 环境变量配置

在 Vercel 项目设置中添加环境变量：

- `DOUBAO_TOKEN`: 你的豆包 API Token
- `DOUBAO_API_URL`: `https://ark.cn-beijing.volces.com/api/v3/responses`（可选，有默认值）
- `DOUBAO_MODEL`: `doubao-seed-1-6-thinking-250715`（可选，有默认值）

### 4. 重新部署

设置完成后，在 Vercel 中触发重新部署：
- 进入 Deployments
- 点击最新的部署右侧的 "..." 菜单
- 选择 "Redeploy"

## 验证

部署成功后：
1. 访问你的 Vercel 域名
2. 应该能看到上传页面（不再是 404）
3. 可以正常上传图片并进行分析

## 如果仍然有问题

1. **检查构建日志**：在 Vercel 的部署详情中查看构建日志
2. **检查路由配置**：确保 `frontend/vercel.json` 存在且配置正确
3. **清除缓存**：在 Vercel 设置中清除构建缓存后重新部署

## 后端 API 说明

当前项目包含 `api/analyze.js` serverless function，但需要：
1. 确保 `backend/services/doubao.js` 可以被正确导入
2. 或者将后端逻辑直接写在 `api/analyze.js` 中

如果 API 调用失败，可能需要调整 serverless function 的实现方式。

