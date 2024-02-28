<template>
  <v-card class="product-card rounded-lg">
    <div class="overflow-hidden">
      <v-img :src="image" contain height="200" class="img-enlarge"></v-img>
    </div>
    <v-card-title>
      <router-link class="text-primary text-decoration-none" :to="'/products/' + _id">{{ name }}</router-link>
    </v-card-title>
    <v-card-subtitle>${{ price }}</v-card-subtitle>
    <v-card-text style="white-space: pre;">
     <div  class="text-overflow">{{ description }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" prepend-icon="mdi-cart" @click="addCart">加入購物車</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useApi } from '@/composables/axios'
import { useUserStore } from '@/store/user'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const { apiAuth } = useApi()
const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()

const props = defineProps(['_id', 'category', 'description', 'image', 'name', 'price', 'sell'])

const addCart = async () => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }
  try {
    const { data } = await apiAuth.patch('/users/cart', {
      product: props._id,
      quantity: 1
    })
    user.cart = data.result
    createSnackbar({
      text: '新增成功',
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
        color: 'red',
        location: 'bottom'
      }
    })
  }
}
</script>
<style scoped>

.text-overflow {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制行數為 2 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  /* line-height: 1.2em;
  max-height: 3.6em; */
}

.overflow-hidden {
  overflow: hidden;
}
.img-enlarge{
  overflow:hidden;
  transform:scale(1,1);
  transition: 1s ease-out;
}

.img-enlarge:hover {
  transform: scale(1.2, 1.2);
}
</style>
