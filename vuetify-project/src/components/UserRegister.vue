<template>
  <VWindowItem value="two">
   <VRow>
   <VCol cols="12">
     <VForm>
       <VTextField
       label="帳號"
       minlength="4" maxlength="20" counter
       ></VTextField>
       <VTextField
       label="信箱" type="email"
       ></VTextField>
       <VTextField
       label="密碼" type="password"
       minlength="4" maxlength="20" counter
       ></VTextField>
       <VTextField
       label="確認密碼" type="password"
       minlength="4" maxlength="20" counter
       ></VTextField>
       <VBtn type="submit">註冊</VBtn>
     </VForm>
   </VCol>
 </VRow>
 </VWindowItem>
</template>
