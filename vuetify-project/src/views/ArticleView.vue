<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ article.title }}</h1>
      </v-col>
      <v-col cols="12" md="6">
        <v-img :src="article.image"></v-img>
      </v-col>
      <v-col cols="12" md="6">
        <p>{{ article.content }}</p>
        <p style="white-space: pre;">{{ article.type }}</p>
        <p>{{ article.post }}</p>
      </v-col>
    </v-row>
  </v-container>
  </template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const route = useRoute()
const router = useRouter()
const { api } = useApi()
const createSnackbar = useSnackbar()
const article = ref({
  _id: '',
  title: '',
  content: '',
  image: '',
  type: '',
  post: true
})

onMounted(async () => {
  try {
    const { data } = await api.get('/articles/' + route.params.id)
    article.value._id = data.result._id
    article.value.title = data.result.title
    article.value.content = data.result.content
    article.value.image = data.result.image
    article.value.type = data.result.type
    article.value.post = data.result.post

    document.title = `人類醉後的希望 | ${article.value.title}`
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'black',
        location: 'bottom'
      }
    })
    router.push('/')
  }
})

</script>
