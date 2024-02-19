<template>
  <v-container>
    <v-form v-model="formData" @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12">
          <h1 class="text-center">文章管理</h1>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="formData.title" label="標題"></v-text-field>
        </v-col>
        <v-col cols="12">
          <!-- 将 CKEditor 组件嵌套在 Vuetify 表单组件中 -->
          <CKEditor v-model="formData.content" :config="editorConfig"></CKEditor>
        </v-col>
        <v-col cols="12">
          <v-btn color="green" type="submit">
            新增文章
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'

// 定义组件的响应式数据
const formData = ref({
  title: '',
  content: ''
})

// CKEditor 的配置选项
const editorConfig = {
  // 在这里添加 CKEditor 的配置选项
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'undo',
      'redo'
    ]
  },
  language: 'en',
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
    ]
  }
}

// 提交表单的处理函数
const handleSubmit = () => {
  // 在这里执行表单提交的逻辑，formData.title 和 formData.content 中分别存储着标题和内容
}
</script>
