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
        name: 'Drunk',
        component: () => import('@/views/DrunkView.vue'),
        meta: {
          title: '人類醉後的希望 | 酒鬼專區',
          login: false,
          admin: false
        }
      },
      {
        path: 'menu2',
        name: 'Drunk2',
        component: () => import('@/views/Drunk2View.vue'),
        meta: {
          title: '人類醉後的希望 | 喝酒必備',
          login: false,
          admin: false
        }
      },
      {
        path: 'menu3',
        name: 'Drunk3',
        component: () => import('@/views/Drunk3View.vue'),
        meta: {
          title: '人類醉後的希望 | 活動專區',
          login: false,
          admin: false
        }
      },
      {
        path: 'menu4',
        name: 'Drunk4',
        component: () => import('@/views/Drunk4View.vue'),
        meta: {
          title: '人類醉後的希望 | 購物車',
          login: true,
          admin: false
        }
      },
      {
        path: 'menu5',
        name: 'Drunk5',
        component: () => import('@/views/Drunk5View.vue'),
        meta: {
          title: '人類醉後的希望 | 關於我們',
          login: false,
          admin: false
        }
      },
      {
        path: 'products/:id',
        name: 'Product',
        component: () => import('@/views/ProductView.vue'),
        meta: {
          title: '人類醉後的希望 | 商品',
          login: false,
          admin: false
        }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/OrdersView.vue'),
        meta: {
          title: '人類醉後的希望 | 訂單',
          login: true,
          admin: false
        }
      },
      {
        path: 'articles/:id',
        name: 'Articles',
        component: () => import('@/views/ArticleView.vue'),
        meta: {
          title: '人類醉後的希望 | 酒鬼專區',
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
          title: '人類醉後的希望 | 管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'poster',
        name: 'AdminPoster',
        component: () => import('@/views/admin/PosterView.vue'),
        meta: {
          title: '人類醉後的希望 | 管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductsView.vue'),
        meta: {
          title: '人類醉後的希望 | 商品管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/OrdersView.vue'),
        meta: {
          title: '人類醉後的希望 | 訂單管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: {
          title: '人類醉後的希望 | 會員管理',
          login: true,
          admin: true
        }
      }
    ]
  },
  {
    path: '/self',
    component: () => import('@/layouts/SelfLayout.vue'),
    children: [
      {
        path: '',
        name: 'SelfHome',
        component: () => import('@/views/self/HomeView.vue'),
        meta: {
          title: '人類醉後的希望 | 個人資料',
          login: true,
          admin: false
        }
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/self/ArticleView.vue'),
        meta: {
          title: '人類醉後的希望 | 貼文管理',
          login: true,
          admin: false
        }
      },
      {
        path: 'favorite',
        name: 'Favorite',
        component: () => import('@/views/self/FavoriteView.vue'),
        meta: {
          title: '人類醉後的希望 | 收藏',
          login: true,
          admin: false
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
