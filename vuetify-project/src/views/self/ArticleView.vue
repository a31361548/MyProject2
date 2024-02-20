<template>
<VContainer>
  <VRow>
    <VCol cols="12">
      <h1 class="text-center">文章管理</h1>
    </VCol>
    <VDivider></VDivider>
    <VCol cols="12">
      <VBtn color="green" @click="openDialog">
        新增文章
      </VBtn>
    </VCol>
    <VCol cols="12">
    </VCol>
  </VRow>
</VContainer>
<VDialog v-model="dialog" persistent width="500px">
<VForm>
  <VCard>
    <VCardTitle>{{ '新增文章' }}</VCardTitle>
    <VCardText>
      <VTextField
      label="標題"
      ></VTextField>
      <VTextField
      label="作者"
      ></VTextField>
      <VTextField
      label="圖片"
      ></VTextField>
      <VTextField
      label="發布日期"
      ></VTextField>
    </VCardText>
    <VCardActions>
      <VBtn color="blue" @click="closeDialog">取消</VBtn>
      <VBtn color="green" type="submit">送出</VBtn>
    </VCardActions>
  </VCard>
</VForm>
</VDialog>
</template>
<script setup>
import { ref } from 'vue'

const dialog = ref(false)

const openDialog = () => {
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}
</script>
