<template>
  <v-carousel
    cycle
    height="400"
    hide-delimiter-background
    show-arrows="hover"
    >
    <v-carousel-item
    v-for="game in games"
    :key="game._id"
    >
    <v-sheet
    height="100%"
    v-bind="game"
      >
        <div class="d-flex fill-height justify-center align-center">
         {{ name }}
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['_id', 'category', 'description', 'image', 'name', 'price', 'sell'])
const games = ref([])
// const colors = ref([
//   'indigo',
//   'warning',
//   'pink darken-2',
//   'red lighten-1',
//   'deep-purple accent-4'
// ])

// const slides = ref([
//   'First',
//   'Second',
//   'Third',
//   'Fourth',
//   'Fifth'
// ])
</script>
