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
    {
      path: '/queue',
      name: 'Queue',
      component: () => import('@/views/QueueView.vue'),
    },
  ],
})

export default router
