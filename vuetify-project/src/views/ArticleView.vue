<template >
  <v-container>
    <v-sheet style="background-color: rgba(255,255,255,0.1); width:75vw ; height:70vh; ">
      <v-row style="margin: 1rem; padding-top: 2rem;">
        <v-col cols="6">
          <v-img :src="article.image" ></v-img>
        </v-col>
        <v-col cols="6" style="color: white; font-size: 1.5rem;">
          <h1>{{ article.title }}</h1>
          <p>{{ article.content }}</p>
          <p style="white-space: pre;">類別: &nbsp;{{ article.type }}</p>
          <p>貼文時間: &nbsp;{{ article.time }}</p>
        </v-col>
      </v-row>
    </v-sheet>
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
  userid: '',
  title: '',
  content: '',
  image: '',
  type: '',
  createdAt: '',
  post: true
})

onMounted(async () => {
  try {
    const { data } = await api.get('/articles/' + route.params.id)
    article.value._id = data.result._id
    article.value.userid = data.result.userid
    article.value.title = data.result.title
    article.value.content = data.result.content
    article.value.image = data.result.image
    article.value.type = data.result.type
    article.value.time = new Date(data.result.createdAt).toLocaleString()
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
