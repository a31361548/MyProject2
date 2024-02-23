<template>
 <VNavigationDrawer permanent>
  <VList>
    <VListItem :prepend-avatar="user.avatar" :title="user.account">
    </VListItem>
  </VList>
  <VList>
    <VListItem
    v-for="item in navItems" :key="item.to"
    :to="item.to" :title="item.text" :prepend-icon="item.icon"
    ></VListItem>
  </VList>
 </VNavigationDrawer>
<VMain>
  <RouterView></RouterView>
</VMain>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { computed } from 'vue'

const user = useUserStore()

const navItems = [
  { to: '/admin/poster', text: '貼文管理', icon: 'mdi-note' },
  { to: '/admin/products', text: '商品管理', icon: 'mdi-list-box' },
  { to: '/admin/orders', text: '訂單管理', icon: 'mdi-shopping' },
  { to: '/admin/users', text: '會員管理', icon: 'mdi-account' },
  { to: '/', text: '回首頁', icon: 'mdi-home' }
]

const prependAvatar = computed(() => {
  return `https://source.boringavatars.com/beam/120/${user.account}?colors=4EB3DE,8DE0A6,FCF09F,F27C7C,DE528C`
})
</script>
