// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import MusicRequestView from '@/views/MusicRequestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MusicRequest',
      component: MusicRequestView,
    },
    // もしサブページがあれば追加
  ],
})

export default router
