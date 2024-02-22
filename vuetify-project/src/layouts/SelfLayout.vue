<template>
      <v-navigation-drawer expand-on-hover rail mobile-breakpoint="xs">
        <v-list>
          <v-list-item :prepend-avatar="prependAvatar" :title="user.account" :subtitle="user.email" to="/self"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :title="item.text"
            :prepend-icon="item.icon"
            :value="item.to"
          ></v-list-item>
          <v-list-item
          v-if="user.isLogin"
           title="登出"
           prepend-icon="mdi-logout"
           @click="logout"
           ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <RouterView></RouterView>
      </v-main>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { computed } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const router = useRouter()
const createSnackbar = useSnackbar()
const { apiAuth } = useApi()

const user = useUserStore()

const navItems = [
  { to: '/self/article', text: '文章管理', icon: 'mdi-list-box' },
  { to: '/self/favorite', text: '收藏', icon: 'mdi-heart' },
  { to: '/', text: '回首頁', icon: 'mdi-home' }
]

const prependAvatar = computed(() => {
  return user.avatar
})

const logout = async () => {
  try {
    await apiAuth.delete('/users/logout')
    user.logout()
    createSnackbar({
      text: '登出成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    router.push('/')
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
}
</script>
