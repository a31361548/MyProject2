<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <h1>個人資料</h1>
      </VCol>
      <VCard width="500px" style="padding-left: 30px; padding-top: 15px;">
        <VImg class="avatar" :src="user.avatar" style="height: 50px; width: 50px;" @click="openDialog()"></VImg>
        <VCardTitle></VCardTitle>
      </VCard>
    </VRow>
  </VContainer>
  <VDialog v-model="dialog" width="500px">
    <VForm :disabled="isSubmitting" @submit.prevent="submit">
      <VCard rounded="lg">
        <VCardTitle>{{ '更換大頭貼' }}</VCardTitle>
        <VCardText>
          <VueFileAgent v-model="fileRecords" v-model:rawModelValue="rawFileRecords"
              accept="image/jpeg,image/png" max-size="2MB" :error-text="{type: '檔案格式不支援，只接受 .jpeg .png', size: '檔案超過 2MB 大小限制'}"
              deletable help-text="選擇大頭貼圖片或拖曳到這裡" :max-files="1" ref="fileAgent"
              >
          </VueFileAgent>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="secondary" rounded :disabled="isSubmitting" @click="closeDialog">取消</VBtn>
          <VBtn color="primary" rounded type="submit" :loading="isSubmitting">送出</VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>
<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useForm } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const user = useUserStore()
const dialog = ref(false)

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const fileAgent = ref(null)

const openDialog = (item) => {
  dialog.value = true
}
const closeDialog = () => {
  dialog.value = false
  resetForm() // 重置表單
  fileAgent.value.deleteFileRecord() // 重設上傳的檔案
}

// const dialogId = ref('')

const { handleSubmit, isSubmitting, resetForm } = useForm()

const fileRecords = ref([])
const rawFileRecords = ref([])

const submit = handleSubmit(async (values) => { // values 是表單各個欄位的值
  // 如果 圖片上傳有錯誤，就不送出  // 沒上傳圖片就沒有 value[0]，value[0] 是 undefined，undefined 沒有 .error 所以要用 ?. 避免錯誤
  if (fileRecords.value[0]?.error) return
  // 如果 新增商品時，沒有選擇圖片，就不送出（編輯商品時，可以不選擇圖片）
  if (fileRecords.value.length === 0) return

  try {
    // === 檔案上傳要用 FormData 物件，不是一般的 JSON 物件
    // 建立 FormData 物件
    const fd = new FormData()
    // === 如果有選擇圖片，就放進 FormData
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }
    // === 送出 FormData 物件的表單資料到後端
    // 如果 dialogId.value 有值，代表是編輯使用者，就用 .patch() 送出
    await apiAuth.patch('/users/', fd)
    // 成功通知
    createSnackbar({
      text: '編輯成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'back',
        location: 'bottom'
      }
    })
    closeDialog()
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    // 失敗通知
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'secondary',
        location: 'bottom'
      }
    })
  }
})
</script>

<style scoped>
.avatar:hover {
  cursor: pointer;
}
</style>
