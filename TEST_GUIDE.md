# 测试指南

## 前置准备

### 1. 检查 Node.js 版本
确保已安装 Node.js（建议 v16+ 或 v18+）

```bash
node -v
npm -v
```

### 2. 安装依赖

在项目根目录执行：

```bash
npm run install:all
```

或者分别安装：

```bash
# 安装前端依赖
cd frontend
npm install
cd ..

# 安装后端依赖
cd backend
npm install
cd ..
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp backend/env.example backend/.env
```

编辑 `backend/.env` 文件，填入你的豆包 API Token：

```env
DOUBAO_API_URL=https://ark.cn-beijing.volces.com/api/v3/responses
DOUBAO_TOKEN=你的token_here
DOUBAO_MODEL=doubao-seed-1-6-thinking-250715
PORT=3001
```

**重要**：你需要从火山引擎获取有效的 API Token。

## 启动服务

### 方式一：同时启动前后端（推荐）

```bash
npm run dev
```

### 方式二：分别启动

**终端 1 - 启动后端：**
```bash
cd backend
npm run dev
```

**终端 2 - 启动前端：**
```bash
cd frontend
npm run dev
```

### 验证服务启动

- 后端应该显示：`服务器运行在 http://localhost:3001`
- 前端应该显示：`Local: http://localhost:3000`

## 功能测试

### 1. 访问应用

打开浏览器访问：http://localhost:3000

### 2. 测试图片上传功能

#### 测试步骤：
1. **上传图片**
   - 点击上传区域或拖拽图片
   - 上传至少 5 张图片（可以使用项目目录中的 IMG_4287.jpg 等测试图片）
   - 验证图片预览是否正常显示

2. **验证限制**
   - 尝试上传少于 5 张图片，确认"开始分析"按钮被禁用
   - 尝试上传超过 20 张图片，确认有提示
   - 尝试上传超过 10MB 的图片，确认有错误提示

3. **删除图片**
   - 点击图片上的删除图标，确认可以删除
   - 删除后图片数量更新

### 3. 测试分析功能

#### 测试步骤：
1. **开始分析**
   - 上传至少 5 张图片后，点击"开始分析"按钮
   - 确认显示加载动画和"正在分析中..."提示

2. **查看结果**
   - 等待分析完成（通常 10-30 秒）
   - 确认跳转到结果页面
   - 验证以下内容是否显示：
     - 个人画像（兴趣爱好、性格特点、生活方式）
     - 共同话题列表（标题、描述、评分、开场白）
     - 聊天建议

### 4. 测试结果页面

#### 测试步骤：
1. **查看结果展示**
   - 确认所有分析结果正确显示
   - 验证话题卡片样式正常
   - 确认评分标签显示正确

2. **测试导出功能**
   - 点击"导出结果"按钮
   - 确认下载了文本文件
   - 打开文件验证内容格式正确

3. **测试重新分析**
   - 点击"重新分析"按钮
   - 确认返回上传页面
   - 确认可以重新上传图片

### 5. 测试错误处理

#### 测试场景：
1. **网络错误**
   - 断开网络后尝试分析
   - 确认显示友好的错误提示

2. **API 错误**
   - 使用错误的 Token
   - 确认显示错误信息

3. **图片格式错误**
   - 尝试上传非图片文件
   - 确认有格式验证提示

## API 测试

### 使用 curl 测试后端 API

#### 1. 健康检查
```bash
curl http://localhost:3001/health
```

预期响应：
```json
{"status":"ok"}
```

#### 2. 测试分析接口

准备一个 base64 编码的图片（简化示例）：

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "images": [
      "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    ]
  }'
```

**注意**：实际测试时需要使用真实的 base64 图片数据。

## 常见问题排查

### 问题 1：依赖安装失败

**解决方案：**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 2：端口被占用

**解决方案：**
- 修改 `backend/.env` 中的 `PORT` 值
- 修改 `frontend/vite.config.js` 中的 `server.port` 值
- 修改 `frontend/vite.config.js` 中的代理目标端口

### 问题 3：CORS 错误

**解决方案：**
- 确认后端已启用 CORS 中间件
- 检查前端代理配置是否正确

### 问题 4：API Token 无效

**错误信息：** `豆包大模型调用失败` 或 `401 Unauthorized`

**解决方案：**
- 检查 `backend/.env` 中的 `DOUBAO_TOKEN` 是否正确
- 确认 Token 有调用权限
- 验证 API URL 是否正确

### 问题 5：图片上传失败

**解决方案：**
- 检查图片大小是否超过 10MB
- 确认图片格式支持（JPG、PNG、WEBP）
- 查看浏览器控制台错误信息

### 问题 6：分析结果格式错误

**可能原因：**
- 豆包 API 返回格式与预期不符
- JSON 解析失败

**解决方案：**
- 查看后端控制台日志
- 检查 `backend/services/doubao.js` 中的响应解析逻辑
- 可能需要调整 Prompt 让模型返回标准 JSON

## 调试技巧

### 1. 查看浏览器控制台
- 打开浏览器开发者工具（F12）
- 查看 Console 标签页的错误信息
- 查看 Network 标签页的请求响应

### 2. 查看后端日志
- 后端服务器会在终端输出日志
- 查看错误堆栈信息
- 检查 API 调用详情

### 3. 测试 API 响应
在 `backend/services/doubao.js` 中添加日志：

```javascript
console.log('API 响应:', JSON.stringify(responseData, null, 2))
```

## 性能测试

### 1. 测试不同数量的图片
- 5 张图片（最少）
- 10 张图片
- 20 张图片（最多）

### 2. 测试不同大小的图片
- 小图片（< 1MB）
- 中等图片（1-5MB）
- 大图片（5-10MB）

### 3. 测试并发请求
使用工具如 Apache Bench 或 Postman 测试并发：

```bash
ab -n 10 -c 2 -p test.json -T application/json http://localhost:3001/api/analyze
```

## 测试检查清单

- [ ] 依赖安装成功
- [ ] 环境变量配置正确
- [ ] 前后端服务正常启动
- [ ] 可以访问前端页面
- [ ] 图片上传功能正常
- [ ] 图片预览功能正常
- [ ] 图片删除功能正常
- [ ] 至少 5 张图片限制生效
- [ ] 分析功能正常调用
- [ ] 分析结果正确显示
- [ ] 导出功能正常
- [ ] 重新分析功能正常
- [ ] 错误提示友好
- [ ] 移动端适配正常

## 下一步

测试通过后，你可以：
1. 优化 UI 样式
2. 添加更多错误处理
3. 优化分析结果的展示
4. 添加更多功能（如历史记录、分享等）

