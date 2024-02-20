<template>
    <v-layout>
      <v-navigation-drawer expand-on-hover rail>
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
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <RouterView></RouterView>
      </v-main>
    </v-layout>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { computed } from 'vue'

const user = useUserStore()

const navItems = [
  { to: '/self/article', text: '文章管理', icon: 'mdi-list-box' },
  { to: '/self/favorite', text: '收藏', icon: 'mdi-heart' },
  { to: '/', text: '回首頁', icon: 'mdi-home' }
]

const prependAvatar = computed(() => {
  return `https://source.boringavatars.com/beam/120/${user.account}?colors=4EB3DE,8DE0A6,FCF09F,F27C7C,DE528C`
})
</script>
