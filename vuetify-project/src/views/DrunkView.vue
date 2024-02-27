<template>
<div v-for="(article, index) in articles" :key="index">
      <VImg :src="article.image" style="height: 200px;"></VImg>
      <h1>{{  article.title }}</h1>
      <p>作者:&nbsp;{{ article.userid.account }}</p>
      <div style="white-space: pre;">
            <p class="text-overflow">{{ article.content }}</p>
      </div>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/axios'

const props = defineProps(['userid', 'type', 'content', 'image', 'title', 'post'])

const articles = ref([])
const { api } = useApi()

onMounted(async () => {
  try {
    const { data: articleData } = await api.get('/articles/all', {
      params: {
        itemsPerPage: -1
      }
    })
    articles.value = articleData.result.data
  } catch (error) {

  }
})
</script>
<style scoped>
.text-overflow {
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 限制行數為 2 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
