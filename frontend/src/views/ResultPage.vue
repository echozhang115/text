<template>
  <div class="result-page">
    <van-nav-bar title="分析结果" left-arrow @click-left="goBack" fixed />
    
    <div class="content">
      <div v-if="result" class="result-content">
        <!-- 个人画像 -->
        <div class="section profile-section">
          <h3 class="section-title">个人画像</h3>
          <div class="profile-content">
            <div v-if="result.profile?.interests" class="interests">
              <div class="label">兴趣爱好</div>
              <div class="tags">
                <van-tag
                  v-for="(interest, index) in result.profile.interests"
                  :key="index"
                  type="primary"
                  plain
                >
                  {{ interest }}
                </van-tag>
              </div>
            </div>
            <div v-if="result.profile?.personality" class="personality">
              <div class="label">性格特点</div>
              <p>{{ result.profile.personality }}</p>
            </div>
            <div v-if="result.profile?.lifestyle" class="lifestyle">
              <div class="label">生活方式</div>
              <p>{{ result.profile.lifestyle }}</p>
            </div>
          </div>
        </div>

        <!-- 共同话题 -->
        <div class="section topics-section">
          <h3 class="section-title">共同话题</h3>
          <div class="topics-list">
            <div
              v-for="(topic, index) in result.topics"
              :key="index"
              class="topic-card"
            >
              <div class="topic-header">
                <span class="topic-title">{{ topic.title }}</span>
                <van-tag v-if="topic.score" type="success" size="small">
                  {{ topic.score }}分
                </van-tag>
              </div>
              <p v-if="topic.description" class="topic-desc">
                {{ topic.description }}
              </p>
              <div v-if="topic.opener" class="topic-opener">
                <div class="opener-label">开场白建议：</div>
                <div class="opener-text">{{ topic.opener }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 聊天建议 -->
        <div v-if="result.suggestions && result.suggestions.length > 0" class="section suggestions-section">
          <h3 class="section-title">聊天建议</h3>
          <div class="suggestions-list">
            <div
              v-for="(suggestion, index) in result.suggestions"
              :key="index"
              class="suggestion-item"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-result">
        <van-empty description="暂无分析结果" />
      </div>
    </div>

    <div class="action-bar" v-if="result">
      <van-button type="primary" block @click="exportResult">
        导出结果
      </van-button>
      <van-button type="default" block @click="goBack" style="margin-top: 10px">
        重新分析
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const result = ref(null)

onMounted(() => {
  // 从 sessionStorage 获取结果
  const savedResult = sessionStorage.getItem('analysisResult')
  if (savedResult) {
    try {
      result.value = JSON.parse(savedResult)
      // 清除存储，避免刷新后仍显示旧数据
      sessionStorage.removeItem('analysisResult')
    } catch (e) {
      console.error('解析结果失败:', e)
      router.push('/')
    }
  } else {
    // 如果没有结果，返回上传页
    router.push('/')
  }
})

const goBack = () => {
  router.push('/')
}

const exportResult = () => {
  if (!result.value) return

  // 创建导出内容
  let content = '个人动态分析报告\n\n'
  
  if (result.value.profile) {
    content += '【个人画像】\n'
    if (result.value.profile.interests) {
      content += `兴趣爱好：${result.value.profile.interests.join('、')}\n`
    }
    if (result.value.profile.personality) {
      content += `性格特点：${result.value.profile.personality}\n`
    }
    if (result.value.profile.lifestyle) {
      content += `生活方式：${result.value.profile.lifestyle}\n`
    }
    content += '\n'
  }

  if (result.value.topics) {
    content += '【共同话题】\n'
    result.value.topics.forEach((topic, index) => {
      content += `${index + 1}. ${topic.title}`
      if (topic.score) content += ` (${topic.score}分)`
      content += '\n'
      if (topic.description) content += `   ${topic.description}\n`
      if (topic.opener) content += `   开场白：${topic.opener}\n`
      content += '\n'
    })
  }

  if (result.value.suggestions) {
    content += '【聊天建议】\n'
    result.value.suggestions.forEach((suggestion, index) => {
      content += `${index + 1}. ${suggestion}\n`
    })
  }

  // 创建 Blob 并下载
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `分析报告_${new Date().getTime()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast('导出成功')
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  padding-top: 46px;
  padding-bottom: 100px;
  background: #f5f5f5;
}

.content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.personality p,
.lifestyle p {
  color: #333;
  line-height: 1.6;
  font-size: 14px;
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.topic-card {
  padding: 15px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.topic-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.topic-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
}

.topic-opener {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.opener-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.opener-text {
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  padding: 12px;
  background: #f8f9ff;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}

.no-result {
  text-align: center;
  padding: 60px 20px;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}
</style>

