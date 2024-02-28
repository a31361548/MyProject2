<template>
  <VContainer>
      <div v-for="(article, index) in articles" :key="index" class="box" @click="hello(article._id)" style="background-color: rgba(255,255,255,0.1);">
            <div>
              <VImg :src="article.image" class="img"></VImg>
            </div>
            <div class="text">
              <h1>{{  article.title }}</h1>
              <span>作者:&nbsp;{{ article.userid.account }}</span>
              <div style="white-space: pre;">
                    <span class="text-overflow">{{ article.content }}</span>
              </div>
            </div>
      </div>
  </VContainer>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/axios'
import router from '@/router'

const props = defineProps(['_id', 'userid', 'type', 'content', 'image', 'title', 'post'])

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
const hello = (id) => {
  router.push('/articles/' + id)
}
</script>
<style scoped>
.img{
  height: 100%;
  width: 200px;
  margin-left: 1rem;
}
.box{
  height: 200px;
  color:white;
  display:flex;
  flex-direction: row;
  cursor:pointer;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.text{
  width: calc(100% - 200px);
  padding-left: calc(10%);
}
.text-overflow {
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 限制行數為 2 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
