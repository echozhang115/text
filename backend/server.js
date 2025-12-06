import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { analyzeWithDoubao } from './services/doubao.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 分析接口
app.post('/api/analyze', async (req, res) => {
  try {
    const { images } = req.body

    if (!images || !Array.isArray(images) || images.length < 5) {
      return res.status(400).json({
        success: false,
        message: '至少需要 5 张图片'
      })
    }

    if (images.length > 20) {
      return res.status(400).json({
        success: false,
        message: '最多支持 20 张图片'
      })
    }

    // 调用豆包大模型进行分析
    const result = await analyzeWithDoubao(images)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('分析错误:', error)
    res.status(500).json({
      success: false,
      message: error.message || '分析失败，请重试'
    })
  }
})

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})

