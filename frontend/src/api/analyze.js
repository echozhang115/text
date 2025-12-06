import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const analyzeImages = async (images) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, {
      images
    })
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || '分析失败，请重试')
  }
}

