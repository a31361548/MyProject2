<template>
<VImg :src="image" container></VImg>
</template>

<script setup>
const props = defineProps(['_id', 'category', 'description', 'image', 'name', 'price', 'sell'])
</script>
