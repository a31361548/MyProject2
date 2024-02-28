<template>
  <v-card class="article-card rounded-lg">
    <div class="overflow-hidden">
      <v-img :src="image" contain  height="200" class="img-enlarge"></v-img>
    </div>
    <v-card-title>
      <router-link class="text-primary text-decoration-none" :to="'/articles/' + _id">{{ title }}</router-link>
    </v-card-title>
    <v-card-subtitle>{{ userid.account }}</v-card-subtitle>
   <v-card-text style="white-space: pre;">
     <div class="text-overflow">{{ content }}</div>
   </v-card-text>
  </v-card>
</template>

<script setup>

const props = defineProps(['_id', 'userid', 'type', 'content', 'image', 'title', 'post'])

</script>
<style scoped>
.text-overflow {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制行數為 2 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
