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
    {
      path: '/artist/:artist',
      name: 'ArtistSelected',
      component: MusicRequestView,
      props: true,
    },
    {
      path: '/artist/:artist/album/:album',
      name: 'AlbumSelected',
      component: MusicRequestView,
      props: true,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // スクロール位置の復元
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router
