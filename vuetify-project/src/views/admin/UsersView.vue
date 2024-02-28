<template>
  <VContainer>
    <VCol cols="12">
      <h1 class="text-center">會員管理</h1>
    </VCol>
    <VCol cols="12">
      <VDataTableServer
        v-model:items-per-page="tableItemsPerPage"
        v-model:sort-by="tableSortBy"
        v-model:page="tablePage"
        :items="tableUsers"
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
        <template #[`item.avatar`]="{ item }">
            <VImg :src="item.avatar" height="50px" contain></VImg>
        </template>
        <!-- <template #[`item.remove`]="{ item }">
          <VBtn icon="mdi-delete" variant="text" color="red" @click="openDialog(item)"></VBtn>
        </template> -->
      </VDataTableServer>
    </VCol>
  </VContainer>
  <VDialog v-model="dialog" parsistent width="500px">
      <VCard rounded="lg">
        <VSpacer></VSpacer>
        <VIcon size="50" color="red" class="ma-auto">mdi-alert</VIcon>
        <VCardText class="ma-auto">是否刪除 {{account.value.value}} 帳號?</VCardText>
        <VCardActions style="display: flex; justify-content: end;">
          <VBtn color="red" @click="dialog = false">取消</VBtn>
          <VBtn color="red" @click="remove">確認刪除</VBtn>
        </VCardActions>
      </VCard>
  </VDialog>
</template>
<script setup>
import { ref } from 'vue'
import { useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const dialog = ref(false)

const dialogId = ref('')

// const openDialog = (item) => {
//   dialogId.value = item._id
//   account.value.value = item.account
//   dialog.value = true
// }

const account = useField('account')

const remove = async () => {
  try {
    await apiAuth.delete('/users/' + dialogId.value)
    createSnackbar({
      text: '刪除成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'back',
        location: 'bottom'
      }
    })
    tableLoadItems() // 重新載入使用者列表
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
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
}

const tableItemsPerPage = ref(10)
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
const tablePage = ref(1)
const tableUsers = ref([])
const tableHeaders = [
  { title: '頭像', align: 'center', sortable: false, key: 'avatar' },
  { title: '帳號', align: 'center', sortable: true, key: 'account' },
  { title: '信箱', align: 'center', sortable: true, key: 'email' }
  // { title: '刪除', align: 'center', sortable: false, key: 'remove' }
]
//  表格載入狀態
const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')

const tableLoadItems = async () => {
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/users/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt',
        sortOrder: tableSortBy.value[0]?.order === 'asc' ? 1 : -1,
        search: tableSearch.value
      }
    })
    tableUsers.value.splice(0, tableUsers.value.length, ...data.result.data)
    tableItemsLength.value = data.result.total
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
const tableApplySearch = () => {
  tablePage.value = 1
  tableLoadItems()
}
</script>
