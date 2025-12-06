<template>
  <div class="upload-page">
    <van-nav-bar title="个人动态分析助手" fixed />
    
    <div class="content">
      <div class="intro-section">
        <h2>上传个人动态截图</h2>
        <p class="tip">请上传至少 5 张对方的个人动态截图，我们将为您分析并找出共同话题</p>
      </div>

      <div class="upload-section">
        <van-uploader
          v-model="fileList"
          :max-count="20"
          :max-size="10 * 1024 * 1024"
          multiple
          :after-read="afterRead"
          :before-delete="beforeDelete"
          accept="image/*"
          :preview-full-image="true"
        >
          <div class="upload-area">
            <van-icon name="plus" size="40" color="#999" />
            <p>点击或拖拽上传图片</p>
            <p class="hint">支持 JPG、PNG、WEBP，单张最大 10MB</p>
          </div>
        </van-uploader>
      </div>

      <div class="preview-section" v-if="fileList.length > 0">
        <div class="preview-header">
          <span>已上传 {{ fileList.length }} 张图片</span>
        </div>
        <div class="preview-grid">
          <div
            v-for="(file, index) in fileList"
            :key="index"
            class="preview-item"
          >
            <img :src="file.content || file.url" alt="预览" />
            <van-icon
              name="cross"
              class="delete-icon"
              @click="removeFile(index)"
            />
          </div>
        </div>
      </div>

      <div class="action-section">
        <van-button
          type="primary"
          size="large"
          block
          :disabled="fileList.length < 5"
          :loading="analyzing"
          @click="startAnalyze"
        >
          {{ analyzing ? '分析中...' : '开始分析' }}
        </van-button>
        <p v-if="fileList.length < 5" class="warning">
          至少需要上传 5 张图片
        </p>
      </div>
    </div>

    <van-loading v-if="analyzing" class="loading-overlay" vertical>
      正在分析中，请稍候...
    </van-loading>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { analyzeImages } from '../api/analyze'

const router = useRouter()
const fileList = ref([])
const analyzing = ref(false)

const afterRead = (file) => {
  // 验证文件
  if (file.file.size > 10 * 1024 * 1024) {
    showToast('图片大小不能超过 10MB')
    return false
  }
  return true
}

const beforeDelete = () => {
  return true
}

const removeFile = (index) => {
  fileList.value.splice(index, 1)
}

const startAnalyze = async () => {
  if (fileList.value.length < 5) {
    showToast('至少需要上传 5 张图片')
    return
  }

  analyzing.value = true
  showLoadingToast({
    message: '正在分析中...',
    forbidClick: true,
    duration: 0
  })

  try {
    // 将图片转换为 base64
    const images = await Promise.all(
      fileList.value.map(async (file) => {
        if (file.content) {
          return file.content
        }
        if (file.file) {
          return await fileToBase64(file.file)
        }
        return file.url
      })
    )

    const result = await analyzeImages(images)
    
    closeToast()
    analyzing.value = false

    // 跳转到结果页，使用 sessionStorage 传递数据
    sessionStorage.setItem('analysisResult', JSON.stringify(result))
    router.push('/result')
  } catch (error) {
    closeToast()
    analyzing.value = false
    showToast(error.message || '分析失败，请重试')
    console.error('分析错误:', error)
  }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
</script>

<style scoped>
.upload-page {
  min-height: 100vh;
  padding-top: 46px;
  padding-bottom: 80px;
}

.content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.intro-section {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.intro-section h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.intro-section .tip {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.6;
}

.upload-section {
  margin-bottom: 20px;
}

.upload-area {
  background: white;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  border: 2px dashed #ddd;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-area p {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.upload-area .hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.preview-section {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
}

.preview-header {
  margin-bottom: 15px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}

.preview-item {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.preview-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  padding: 4px;
  font-size: 14px;
  z-index: 10;
}

.action-section {
  margin-top: 30px;
}

.warning {
  text-align: center;
  color: white;
  font-size: 12px;
  margin-top: 10px;
  opacity: 0.8;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>

