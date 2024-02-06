<template>
 <VNavigationDrawer permanent>
  <VListItem
  v-for="item in navItems" :key="item.to"
  :to="item.to" :title="item.text" :prepend-icon="item.icon"
  ></VListItem>
 </VNavigationDrawer>
<VMain>
  <RouterView></RouterView>
</VMain>
</template>

<script setup>
const navItems = [
  { to: '/admin/poster', text: '貼文管理', icon: 'mdi-note' },
  { to: '/admin/product', text: '商品管理', icon: 'mdi-list-box' },
  { to: '/admin/order', text: '訂單管理', icon: 'mdi-shopping' },
  { to: '/', text: '回首頁', icon: 'mdi-home' }
]

</script>
