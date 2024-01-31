// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: {
          title: '人類醉後的希望'
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
          title: '人類醉後的希望 | 登入'
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: {
          title: '人類醉後的希望 | 註冊'
        }
      },
      {
        path: 'menu1',
        name: 'Menu1',
        component: () => import('@/views/DrunkView.vue'),
        meta: {
          title: '人類醉後的希望 | 酒鬼專區'
        }
      },
      {
        path: 'menu2',
        name: 'Menu2',
        component: () => import('@/views/Drunk2View.vue'),
        meta: {
          title: '人類醉後的希望 | 酒鬼專區'
        }
      },
      {
        path: 'menu3',
        name: 'Menu3',
        component: () => import('@/views/Drunk3View.vue'),
        meta: {
          title: '人類醉後的希望 | 酒鬼專區'
        }
      },
      {
        path: 'menu4',
        name: 'Menu4',
        component: () => import('@/views/Drunk4View.vue'),
        meta: {
          title: '人類醉後的希望 | 酒鬼專區'
        }
      },
      {
        path: 'menu5',
        name: 'Menu5',
        component: () => import('@/views/Drunk5View.vue'),
        meta: {
          title: '人類醉後的希望 | 酒鬼專區'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
