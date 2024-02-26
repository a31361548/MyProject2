<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <h1 class="text-center">文章管理</h1>
      </VCol>
      <VDivider></VDivider>
      <VCol cols="12">
          <VDataTableServer
          v-model:items-per-page="tableItemsPerPage"
          v-model:sort-by="tableSortBy"
          v-model:page="tablePage"
          :items="tableArticles"
          :headers="tableHeaders"
          :loading="tableLoading"
          :items-length="tableItemsLength"
          :search="tableSearch"
          @update:items-per-page="tableLoadItems"
          @update:sort-by="tableLoadItems"
          @update:page="tableLoadItems"
          hover
          >
          <template #top>
            <VTextField
            label="搜尋"
              append-icon="mdi-magnify"
              v-model="tableSearch"
              @click:append="tableApplySearch"
              @keydown.enter="tableApplySearch"
            ></VTextField>
          </template>
          <template #[`item.image`]="{ item }">
            <VImg :src="item.image"></VImg>
          </template>
          <template #[`item.createdAt`]="{ item }">
           {{ new Date(item.createdAt).toLocaleString() }}
          </template>
          <template #[`item.edit`]="{ item }">
            <VBtn icon="mdi-pencil" variant="text" color="blue" @click="openDialog(item)"></VBtn>
          </template>
          <template #[`item.delete`]="{ item }">
            <VBtn icon="mdi-delete" variant="text" color="red" @click="deleteItem(item)"></VBtn>
          </template>
          </VDataTableServer>
        </VCol>
    </VRow>
  </VContainer>
  <VDialog v-model="dialog" persistent width="500px">
  <VForm :disabled="isSubmitting" @submit.prevent="submit">
    <VCard>
      <VCardText>
        <VCardTitle>{{ editaccount }}</VCardTitle>
        <VTextField
        label="標題"
        v-model="title.value.value"
        :error-messages="title.errorMessage.value"
        disabled="true"
        ></VTextField>
        <VTextarea
        label="內文"
        v-model="content.value.value"
        :error-messages="content.errorMessage.value"
        disabled="true"
        ></VTextarea>
        <VSelect
        label="分類"
        :items="types"
        v-model="type.value.value"
        :error-messages="type.errorMessage.value"
        disabled="true"
        ></VSelect>
        <VCheckbox
        label="貼文"
        v-model="post.value.value"
        :error-messages="post.errorMessage.value"
        ></VCheckbox>
        <VueFileAgent
            v-model="fileRecords"
            v-model:raw-model-value="rawFileRecords"
            accept="image/jpg,image/png"
            deletable
            :error-text="{type: '檔案格式不支援', size: '檔案超過 1MB 大小限制'}"
            help-text="選擇檔案或拖曳到這裡"
            :max-files="1"
            max-size="1MB"
            ref="fileAgent"
            disabled="true"
            ></VueFileAgent>
      </VCardText>
      <VCardActions>
        <VBtn color="blue" :disabled="isSubmitting" @click="closeDialog">取消</VBtn>
        <VBtn color="green" type="submit" :loading="isSubmitting">送出</VBtn>
      </VCardActions>
    </VCard>
  </VForm>
  </VDialog>
  </template>
<script setup>
import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const fileAgent = ref(null)

const dialog = ref(false)
const dialogId = ref('')
const editaccount = ref('')

const openDialog = (item) => {
  if (item) {
    dialogId.value = item._id
    editaccount.value = item.userid.account
    title.value.value = item.title
    content.value.value = item.content
    type.value.value = item.type
    post.value.value = item.post
  } else {
    dialogId.value = ''
  }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
  fileAgent.value.deleteFileRecord()
}

const deleteItem = async (item) => {
  try {
    await apiAuth.delete('/articles/' + item._id)
    createSnackbar({
      text: '刪除成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    tableLoadItems()
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
}

const types = ['經典調酒', '超商酒單']

const schema = yup.object({
  title: yup
    .string()
    .required('標題為必填'),
  content: yup
    .string()
    .required('內文為必填'),
  type: yup
    .string()
    .required('分類為必填')
    .test('isType', '商品分類錯誤', value => types.includes(value)),
  post: yup
    .boolean()
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    title: '',
    content: '',
    type: '',
    post: false
  }
})

const title = useField('title')
const content = useField('content')
const type = useField('type')
const post = useField('post')

const fileRecords = ref([])
const rawFileRecords = ref([])

const submit = handleSubmit(async (values) => {
  if (fileRecords.value[0]?.error) return
  if (dialogId.value === '' && fileRecords.value.length === 0) return
  try {
    // 建立 FormData 物件
    // 使用 fd.append(欄位, 值) 將資料放進去
    const fd = new FormData()
    for (const key in values) {
      fd.append(key, values[key])
    }

    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }

    if (dialogId.value === '') {
      console.log('新增')
      await apiAuth.post('/articles', fd)
    } else {
      await apiAuth.patch('/articles/' + dialogId.value, fd)
    }

    createSnackbar({
      text: dialogId.value === '' ? '新增成功' : '編輯成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    closeDialog()
    tableApplySearch()
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

// 表格每頁幾個
const tableItemsPerPage = ref(10)
// 表格排序
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
// 表格頁碼
const tablePage = ref(1)
// 表格商品資料陣列
const tableArticles = ref([])
// 表格欄位設定
const tableHeaders = [
  { title: '圖片', align: 'center', sortable: false, key: 'image' },
  { title: '標題', align: 'center', sortable: true, key: 'title' },
  { title: '分類', align: 'center', sortable: true, key: 'type' },
  { title: '新增時間', align: 'center', sortable: true, key: 'createdAt' },
  { title: '帳號', align: 'center', key: 'userid.account' },
  { title: '編輯', align: 'center', sortable: false, key: 'edit' },
  { title: '刪除', align: 'center', sortable: false, key: 'delete' }
]
// 表格載入狀態
const tableLoading = ref(true)
// 表格全部資料數
const tableItemsLength = ref(0)
// 表格搜尋文字
const tableSearch = ref('')
// 表格載入資料
const tableLoadItems = async () => {
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/articles/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt',
        sortOrder: tableSortBy.value[0]?.order === 'asc' ? 1 : -1,
        search: tableSearch.value
      }
    })
    tableArticles.value.splice(0, tableArticles.value.length, ...data.result.data)
    tableItemsLength.value = data.result.total
    console.log('嗨')
    console.log(tableItemsLength)
    console.log(data.result.data)
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
  tableLoading.value = false
}
tableLoadItems()
// 表格套用搜尋
const tableApplySearch = () => {
  tablePage.value = 1
  tableLoadItems()
}
</script>
