// Composables
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router'
import { useUserStore } from '@/store/user'

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
          title: '人類醉後的希望',
          login: false,
          admin: false
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
          title: '人類醉後的希望 | 登入',
          login: false,
          admin: false
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: {
          title: '人類醉後的希望 | 註冊',
          login: false,
          admin: false
        }
      },
      {
        path: 'menu1',
        name: 'Menu1',
        component: () => import('@/views/DrunkView.vue'),
        meta: {
          title: '人類醉後的希望 | 酒鬼專區',
          login: false,
          admin: false
        }
      },
      {
        path: 'menu2',
        name: 'Menu2',
        component: () => import('@/views/Drunk2View.vue'),
        meta: {
          title: '人類醉後的希望 | 喝酒必備',
          login: false,
          admin: false
        }
      },
      {
        path: 'menu3',
        name: 'Menu3',
        component: () => import('@/views/Drunk3View.vue'),
        meta: {
          title: '人類醉後的希望 | 活動專區',
          login: false,
          admin: false
        }
      },
      {
        path: 'menu4',
        name: 'Menu4',
        component: () => import('@/views/Drunk4View.vue'),
        meta: {
          title: '人類醉後的希望 | 購物車',
          login: true,
          admin: false
        }
      },
      {
        path: 'menu5',
        name: 'Menu5',
        component: () => import('@/views/Drunk5View.vue'),
        meta: {
          title: '人類醉後的希望 | 關於我們',
          login: false,
          admin: false
        }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('@/views/admin/HomeView.vue'),
        meta: {
          title: '購物網 | 管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'poster',
        name: 'AdminPoster',
        component: () => import('@/views/admin/PosterView.vue'),
        meta: {
          title: '購物網 | 管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductsView.vue'),
        meta: {
          title: '購物網 | 商品管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/OrdersView.vue'),
        meta: {
          title: '購物網 | 訂單管理',
          login: true,
          admin: true
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

router.beforeEach(async (to, from, next) => {
  const user = useUserStore()

  if (from === START_LOCATION) {
    await user.getProfile()
  }

  if (user.isLogin && ['/register', '/login'].includes(to.path)) {
    // 如果有登入，要去註冊或登入頁，重新導向回首頁
    next('/')
  } else if (to.meta.login && !user.isLogin) {
    // 如果要去的頁面要登入，但是沒登入，重新導向回登入頁
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    // 如果要去的頁面要管理員，但是不是管理員，重新導向回首頁
    next('/')
  } else {
    // 不重新導向
    next()
  }
})

export default router
