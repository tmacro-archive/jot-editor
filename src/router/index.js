import Vue from 'vue'
import Router from 'vue-router'
import Desk from '@/components/Desk'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Desk',
      component: Desk
    }
  ]
})
