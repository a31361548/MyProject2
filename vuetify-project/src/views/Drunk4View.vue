<template>
  <v-container>
    <v-col cols="12">
      <h1 style="color: white;">購物車</h1>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="12" >
      <v-data-table :items="cart" :headers="headers">
        <template v-slot:[`item.product.image`]="{ item }">
          <img :src="item.product.image" height="50px" />
        </template>
        <template v-slot:[`item.product.name`]="{ item }">
          <span v-if="item.product.sell">{{ item.product.name }}</span>
          <span class="text-red text-decoration-line-through" v-else>{{ item.product.name }} (已下架)</span>
        </template>
        <template v-slot:[`item.quantity`]="{ item }">
          <v-btn variant="text" icon="mdi-minus" color="red" @click="addCart(item.product._id, -1)"></v-btn>
          {{ item.quantity }}
          <v-btn variant="text" icon="mdi-plus" color="green" @click="addCart(item.product._id, 1)"></v-btn>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn variant="text" icon="mdi-delete" color="red" @click="addCart(item.product._id, item.quantity * -1)"></v-btn>
        </template>
      </v-data-table>
    </v-col>
    <v-col class="text-center" cols="12" style="color: white;">
      <p>總金額: {{ total }}</p>
      <v-btn color="green" :disabled="!canCheckout" :loading="isSubmitting" @click="checkout">結帳</v-btn>
    </v-col>
  </v-container>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const user = useUserStore()
const router = useRouter()

const cart = ref([])
const headers = [
  { title: '商品圖片', key: 'product.image' },
  { title: '商品名稱', key: 'product.name' },
  { title: '單價', key: 'product.price' },
  { title: '數量', key: 'quantity' },
  { title: '總價', key: 'total', value: item => item.product.price * item.quantity },
  { title: '操作', key: 'action' }
]

const total = computed(() => {
  return cart.value.reduce((total, current) => {
    return total + current.quantity * current.product.price
  }, 0)
})

const canCheckout = computed(() => {
  return cart.value.length > 0 && !cart.value.some(item => !item.product.sell)
})

const addCart = async (product, quantity) => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }
  try {
    const { data } = await apiAuth.patch('/users/cart', {
      product,
      quantity
    })
    user.cart = data.result
    createSnackbar({
      text: '修改成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    const idx = cart.value.findIndex(item => item.product._id === product)
    cart.value[idx].quantity += quantity
    if (cart.value[idx].quantity <= 0) {
      cart.value.splice(idx, 1)
    }
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

const isSubmitting = ref(false)
const checkout = async () => {
  isSubmitting.value = true
  try {
    await apiAuth.post('/orders')
    user.cart = 0
    router.push('/orders')
    createSnackbar({
      text: '結帳成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'blue',
        location: 'bottom'
      }
    })
  }
  isSubmitting.value = false
}

onMounted(async () => {
  try {
    const { data } = await apiAuth.get('/users/cart')
    cart.value.push(...data.result)
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
})
</script>
<style scoped>
::v-deep .v-data-table_td {
  padding: 0;
}
</style>
