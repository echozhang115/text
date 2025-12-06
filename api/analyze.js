// Vercel Serverless Function for analyze API
const axios = require('axios')

const DOUBAO_API_URL = process.env.DOUBAO_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/responses'
const DOUBAO_TOKEN = process.env.DOUBAO_TOKEN || 'e1274865-0de9-4d08-bd1d-e0325bbb4d51'
const DOUBAO_MODEL = process.env.DOUBAO_MODEL || 'doubao-seed-1-6-thinking-250715'

const SYSTEM_PROMPT = '你是一个交友高手，对用户的动态有很强的洞察能力，且有丰富的交友互动技巧，擅长于输出简短但有效的分析和建议。'

const formatImageBase64 = (base64String) => {
  if (base64String.startsWith('data:')) {
    return base64String
  }
  return `data:image/jpeg;base64,${base64String}`
}

const analyzeWithDoubao = async (images) => {
  try {
    const content = [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: SYSTEM_PROMPT
          }
        ]
      },
      {
        role: 'user',
        content: [
          ...images.map(image => ({
            type: 'input_image',
            image_url: formatImageBase64(image)
          })),
          {
            type: 'input_text',
            text: `请仔细分析这${images.length}张个人动态截图，找出这个人的兴趣爱好、性格特点、生活方式等信息。然后基于这些信息，生成3-5个可能的共同话题，每个话题需要包含：
1. 话题标题
2. 话题描述（为什么这是共同话题）
3. 相关度评分（1-10分）
4. 聊天开场白建议

最后，提供3-5条聊天策略建议，帮助用户与这个人建立更深入的交流关系。

请以JSON格式返回结果，格式如下：
{
  "profile": {
    "interests": ["兴趣1", "兴趣2"],
    "personality": "性格特点描述",
    "lifestyle": "生活方式描述"
  },
  "topics": [
    {
      "title": "话题标题",
      "description": "话题描述",
      "score": 8,
      "opener": "开场白建议"
    }
  ],
  "suggestions": [
    "建议1",
    "建议2"
  ]
}`
          }
        ]
      }
    ]

    const response = await axios.post(
      DOUBAO_API_URL,
      {
        model: DOUBAO_MODEL,
        input: content
      },
      {
        headers: {
          'Authorization': `Bearer ${DOUBAO_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const responseData = response.data
    
    let resultText = ''
    if (responseData.output) {
      if (Array.isArray(responseData.output)) {
        resultText = responseData.output
          .map(item => {
            if (item.content) {
              if (Array.isArray(item.content)) {
                return item.content
                  .filter(c => c.type === 'output_text')
                  .map(c => c.text)
                  .join('')
              }
              return item.content
            }
            return ''
          })
          .join('')
      } else if (responseData.output.content) {
        if (Array.isArray(responseData.output.content)) {
          resultText = responseData.output.content
            .filter(c => c.type === 'output_text')
            .map(c => c.text)
            .join('')
        } else {
          resultText = responseData.output.content
        }
      } else {
        resultText = JSON.stringify(responseData.output)
      }
    }

    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return parsed
      }
    } catch (e) {
      console.warn('无法解析 JSON，使用原始文本:', e)
    }

    return {
      profile: {
        interests: [],
        personality: '分析中...',
        lifestyle: '分析中...'
      },
      topics: [
        {
          title: '分析结果',
          description: resultText || '分析完成，但格式解析失败',
          score: 5,
          opener: '可以尝试从分析结果中找到话题'
        }
      ],
      suggestions: [
        '根据分析结果选择合适的聊天话题',
        '注意观察对方的兴趣点',
        '保持自然和真诚的交流'
      ],
      raw: resultText
    }
  } catch (error) {
    console.error('豆包 API 调用错误:', error)
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      '豆包大模型调用失败'
    )
  }
}

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

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

    const result = await analyzeWithDoubao(images)

    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('分析错误:', error)
    return res.status(500).json({
      success: false,
      message: error.message || '分析失败，请重试'
    })
  }
}
