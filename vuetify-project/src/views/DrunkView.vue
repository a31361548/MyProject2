<template>
  <VContainer>
    <div v-for="(article, index) in articles" :key="index" class="box">
          <div>
            <VImg :src="article.image" class="img"></VImg>
          </div>
          <div>
            <h1>{{  article.title }}</h1>
            <p>作者:&nbsp;{{ article.userid.account }}</p>
            <div style="white-space: pre;">
                  <p class="text-overflow">{{ article.content }}</p>
            </div>
          </div>
    </div>
  </VContainer>
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
.img{
  height: 100%;
  width: 200px;
}
.box{
  height: 200px;
  display:flex;
  flex-direction: row;
  margin-bottom: 35px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.text-overflow {
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 限制行數為 2 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
