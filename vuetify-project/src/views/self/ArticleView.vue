import { send } from 'vite';
import { onMounted } from 'vue';
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
      <VForm>
        <div id="editor"></div>
        <VBtn color="green" @click="sendData">送出</VBtn>
      </VForm>
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
import { ref, onMounted } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const dialog = ref(false)

const openDialog = () => {
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}

const editor = ref(null) // 用于存储编辑器实例

const sendData = () => {
  const data = editor.value.getData()
  console.log(data)
}

onMounted(() => {
  ClassicEditor
    .create(document.querySelector('#editor'))
    .then(editorInstance => {
      editor.value = editorInstance
    })
    .catch(error => {
      console.error('Error occurred:', error)
    })
})
</script>
