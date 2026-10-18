import { createRouter, createWebHistory } from 'vue-router'
import QuoteView from '../views/QuoteView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/quote',
      name: 'quote',
      component: QuoteView,
    },
  ],
})

export default router
