<template>
  <v-carousel
    cycle
    height="90vh"
    hide-delimiter-background
    show-arrows="hover"
  >
    <v-carousel-item
    v-for="product in products" :key="product._id"
    >
      <Article v-bind="product"></Article>
    </v-carousel-item>
  </v-carousel>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import Article from '@/components/ArticlePost.vue'

const { api } = useApi()
const createSnackbar = useSnackbar()
const products = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      params: {
        itemsPerPage: -1
      }
    })
    products.value.push(...data.result.data)
  } catch (error) {
    console.log(error)
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
