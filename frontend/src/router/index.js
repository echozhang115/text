import { createRouter, createWebHistory } from 'vue-router'
import UploadPage from '../views/UploadPage.vue'
import ResultPage from '../views/ResultPage.vue'

const routes = [
  {
    path: '/',
    name: 'Upload',
    component: UploadPage
  },
  {
    path: '/result',
    name: 'Result',
    component: ResultPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

