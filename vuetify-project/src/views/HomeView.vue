<template>
  <div class="swiper mySwiper" style="height: 75vh;">
    <div class="swiper-wrapper"
    >
      <div class="swiper-slide text-center" v-for="product in products" :key="product._id">
        <img :src="product.image" style="height: 70vh; width: 100%; height: 100%; object-fit: contain;"/>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
  <VContainer style="width: 95%; color:white;">
    <VRow>
    <VCol cols="12">
      <h1 class="text-center">微醺小物</h1>
    </VCol>
    <VDivider></VDivider>
    <VCol cols="12" md="6" lg="3" v-for="product in products" :key="product._id">
      <ProductCard v-bind="product"></ProductCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12">
      <h1 class="text-center">最新文章</h1>
    </VCol>
    <VDivider></VDivider>
    <VCol cols="12" md="6" lg="3" v-for="article in articles" :key="article._id">
      <ArticleCard v-bind="article"></ArticleCard>
    </VCol>
  </VRow>
  </VContainer>

</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import ArticleCard from '@/components/ArticleCard.vue'
import ProductCard from '@/components/ProductCard.vue'
import gsap from 'gsap'
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'

const { api } = useApi()
const createSnackbar = useSnackbar()
const products = ref([])
const articles = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      params: {
        itemsPerPage: -1
      }
    })
    const allProducts = data.result.data
    const selectedProducts = []
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * allProducts.length)
      selectedProducts.push(allProducts[randomIndex])
      allProducts.splice(randomIndex, 1) // remove the selected product from allProducts
    }
    products.value.push(...selectedProducts)
    await nextTick()

    const { data: articleData } = await api.get('/articles/all', {
      params: {
        itemsPerPage: -1
      }
    })
    const allArticles = articleData.result.data
    const selectedArticles = []
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * allArticles.length)
      selectedArticles.push(allArticles[randomIndex])
      // allArticles.splice(randomIndex, 1) // remove the selected article from allArticles
    }
    console.log(articles.value)
    articles.value.push(...articleData.result.data)
    await nextTick()
    gsap
      .to('.product-card', { opacity: 1, duration: 0.5 })
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

onMounted(() => {
  const swiper = new Swiper('.mySwiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 40
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50
      }
    }
  })
})

</script>
<style scoped>

</style>
