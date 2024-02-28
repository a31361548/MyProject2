<template>
 <VContainer style="background-color: white; border-radius: 36px; margin-top: 50px;">
  <VCol cols="12">
    <h1>註冊</h1>
    <VDivider></VDivider>
  </VCol>
  <VCol cols="12">
     <VForm :disabled="isSubmitting" @submit.prevent="submit">
       <VTextField
       label="帳號"
       minlength="4" maxlength="20" counter
       prepend-inner-icon="mdi-account"
       v-model="account.value.value"
       :error-messages="account.errorMessage.value"
       ></VTextField>
       <VTextField
       label="信箱" type="email"
       prepend-inner-icon="mdi-email"
       v-model="email.value.value"
       :error-messages="email.errorMessage.value"
       ></VTextField>
       <VTextField
       label="手機號碼"
       prepend-inner-icon="mdi-phone"
       v-model="phone.value.value"
       :error-messages="phone.errorMessage.value"
       ></VTextField>
       <VTextField
       label="密碼" :type="show2 ? 'text' : 'password'"
       prepend-inner-icon="mdi-lock"
       minlength="4" maxlength="20" counter
       v-model="password.value.value"
       :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
       @click:append-inner="show2 = !show2"
       :error-messages="password.errorMessage.value"
       ></VTextField>
       <VTextField
       label="確認密碼" :type="show1 ? 'text' : 'password'"
       prepend-inner-icon="mdi-check"
       minlength="4" maxlength="20" counter
       v-model="passwordConfirm.value.value"
       :append-icon-inner="show1 ? 'mdi-eye' : 'mdi-eye-off'"
       @click:append-inner="show1 = !show1"
       :error-messages="passwordConfirm.errorMessage.value"
       ></VTextField>
       <VBtn type="submit" color="blue">註冊</VBtn>
     </VForm>
   </VCol>
 </VContainer>
</template>
<script setup>
import validator from 'validator'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useApi } from '@/composables/axios'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const createSnackbar = useSnackbar()
const { api } = useApi()
const user = useUserStore()

const show1 = ref(false)
const show2 = ref(false)

// 定義註冊表單的資料格式
const schema = yup.object({
  account: yup
    .string()
    .required('帳號為必填欄位')
    .min(4, '使用者帳號長度不符')
    .max(20, '使用者帳號長度不符'),
  email: yup
    .string()
    .required('信箱為必填欄位')
    // .test(自訂驗證名稱, 錯誤訊息, 驗證function)
    .test(
      'isEmail', '信箱格式錯誤',
      (value) => {
        return validator.isEmail(value)
      }
    ),
  phone: yup
    .string()
    .required('手機號碼必填')
    .test('isMobilePhone', '格式錯誤',
      (value) => {
        return validator.isMobilePhone(value, 'zh-TW')
      }),
  password: yup
    .string()
    .required('密碼為必填欄位')
    .min(4, '密碼長度不符')
    .max(20, '密碼長度不符'),
  passwordConfirm: yup
    .string()
    .required('密碼為必填欄位')
    .min(4, '密碼長度不符')
    .max(20, '密碼長度不符')
    // .oneOf 只允許符合陣列內其中一個值
    // .oneOf(陣列, 錯誤訊息)
    // .ref('password') 代表這個 schema 的 password 欄位值
    .oneOf([yup.ref('password')], '密碼不一致')
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema
})

const account = useField('account')
const email = useField('email')
const phone = useField('phone')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

const submit = handleSubmit(async (values) => {
  try {
    await api.post('/users', {
      account: values.account,
      email: values.email,
      password: values.password,
      phone: values.phone
    })
    createSnackbar({
      text: '註冊成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    const { data } = await api.post('/users/login', {
      account: values.account,
      password: values.password
    })
    user.login(data.result)
    router.push('/')
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
