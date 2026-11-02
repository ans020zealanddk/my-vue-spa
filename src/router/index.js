import { createRouter, createWebHistory } from 'vue-router'
import MuseumShell from '../components/MuseumShell.vue'
import MuseumMapView from '../views/MuseumMapView.vue'
import WayfinderView from '../views/WayfinderView.vue'
import QuoteView from '../views/QuoteView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MuseumShell,
      children: [
        {
          path: '',
          name: 'map',
          component: MuseumMapView,
        },
        {
          path: 'find',
          name: 'find',
          component: WayfinderView,
        },
        {
          path: 'quote',
          name: 'quote',
          component: QuoteView,
        }
      ]
    },
    {
      path: '/admin-management',
      name: 'AdminPlaces',
      component: () => import('../views/AdminPlacesView.vue')
    }
  ]
})

export default router
