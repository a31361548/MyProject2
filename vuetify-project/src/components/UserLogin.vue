<template>
  <VWindowItem value="one">
  <VRow>
  <VCol cols="12">
      <VForm >
        <VTextField
        label="帳號"
        minlength="4" maxlength="20" counter
        ></VTextField>
        <VTextField
        label="密碼" type="password"
        minlength="4" maxlength="20" counter
        ></VTextField>
        <VBtn type="submit" color="green">登入</VBtn>
      </VForm>
    </VCol>
  </VRow>
  </VWindowItem>
</template>