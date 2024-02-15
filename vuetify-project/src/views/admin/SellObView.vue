<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
          <h1 class="text-center">商品管理</h1>
      </VCol>
      <VDivider></VDivider>
      <VCol cols="12">
        <VBtn color="green" @click="openDialog">
          新增商品
        </VBtn>
      </VCol>
    </VRow>
  </VContainer>
  <VDialog v-model="dialog" persistent width="500px">
    <VForm :disabled="isSubmitting" @submit.prevent="submit">
      <VCard>
        <VCardTitle>{{ dialogId === '' ? '新增商品' : '編輯商品' }}</VCardTitle>
        <VCardText>
          <VTextField
          label="名稱"
          v-model="name.value.value"
          :error-messages="name.errorMessage.value"
          ></VTextField>
          <VTextField
          label="價格"
          type="number"
          min="0"
          v-model="price.value.value"
          :error-messages="price.errorMessage.value"
          ></VTextField>
          <VSelect
          label="分類"
          :items="categories"
          v-model="category.value.value"
          :error-messages="category.errorMessage.value"
          ></VSelect>
          <VCheckbox
          label="上架"
          v-model="sell.value.value"
          :error-messages="sell.errorMessage.value"
          ></VCheckbox>
          <VTextarea
          label="說明"
          v-model="description.value.value"
          :error-messages="description.errorMessage.value"
          ></VTextarea>
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
          ></VueFileAgent>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="red" :disabled="isSubmitting" @click="closeDialog">取消</VBtn>
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

const dialog = ref(false)

const dialogId = ref('')
const fileAgent = ref(null)

const openDialog = () => {
  dialogId.value = ''
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
  fileAgent.value.deleteFileRecord()
}

const categories = ['衣服', '食品', '3C', '遊戲']

const schema = yup.object({
  name: yup
    .string()
    .required('缺少商品名稱'),
  price: yup
    .number()
    .typeError('商品價格格式錯誤')
    .required('缺少商品價格')
    .min(0, '商品價格不能小於 0'),
  description: yup
    .string()
    .required('缺少商品說明'),
  category: yup
    .string()
    .required('缺少商品分類')
    .test('isCategory', '商品分類錯誤', value => categories.includes(value)),
  sell: yup
    .boolean()
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: false
  }
})
const name = useField('name')
const price = useField('price')
const description = useField('description')
const category = useField('category')
const sell = useField('sell')

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
      await apiAuth.post('/products', fd)
    } else {
      await apiAuth.patch('/products/' + dialogId.value, fd)
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
</script>
