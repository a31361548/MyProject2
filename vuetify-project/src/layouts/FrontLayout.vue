<template>
  <!-- 手機板側攔 -->
  <VNavigationDrawer v-model="drawer" temporary location="left" v-if="isMobile">
  <VList nav>
    <template v-for="(item) in menu" :key="item.to">
      <VListItem :to="item.to">
        <VListItemTitle>{{ item.text }}</VListItemTitle>
      </VListItem>
    </template>
    <span v-if="!user.isLogin">
      <VListItem  v-for="item in navItems" :key="item.to" :to="item.to" :prepend-icon="item.icon">
        <VListItemTitle>{{ item.text }}</VListItemTitle>
      </VListItem>
    </span>
    <VListItem v-if="user.isAdmin" prepend-icon="mdi-cog" color="white" @click="cog">管理</VListItem >
    <VListItem v-if="user.isLogin" prepend-icon="mdi-pen" @click="information" >個人資料</VListItem>
    <VListItem prepend-icon="mdi-logout" v-if="user.isLogin" @click="logout">登出</VListItem>
  </VList>
  </VNavigationDrawer>

  <VAppBar color="rgba(0,0,0,0.9)" :elevation="3">
    <VContainer class="fullcontainer" fluid>
      <VBtn to="/" :active="false">
        <VAppBarTitle class="bartitle">醉後希望</VAppBarTitle>
      </VBtn>
      <!-- 手機板導覽 -->
      <template v-if="isMobile">
        <VAppBarNavIcon @click="drawer = true"></VAppBarNavIcon>
      </template>
      <!-- 下拉選單 -->
      <div v-else>
        <v-menu v-for="(item) in menu" :key="item.to" class="menu" open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :to="item.to"
              :prepend-icon="item.icon"
              class="buttonstyle"
              >
              {{item.text}}
            </v-btn>
          </template>
          <v-list v-if="item.list">
            <v-list-item
              v-for="(subitem, index) in item.list"
              :key="index"
              :value="index"
              :to="subitem.to"
              >
            <v-list-item-title>{{ subitem.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <!--  登入鍵 --->
    <div v-if="!isMobile">
      <span v-if="!user.isLogin">
        <VBtn v-for="item in navItems" :key="item.to" :prepend-icon="item.icon"  class="buttonstyle">
          {{ item.text }}
          <v-dialog
          v-model="dialog"
          activator="parent"
          width="auto"
        >
          <v-card min-width="800">
            <v-tabs  fixed-tabs
              v-model="tab"
              bg-color="primary"
            >
              <v-tab value="one">登入</v-tab>
              <v-tab value="two">註冊</v-tab>
            </v-tabs>

            <VCardText>
              <VWindow v-model="tab">
            <Register></Register>
            <Login></Login>
              </VWindow>
            </VCardText>
            <v-card-actions>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </VBtn>
      </span>
      <VBtn v-if="user.isAdmin" prepend-icon="mdi-cog" color="white"  class="buttonstyle" @click="cog">管理</VBtn>
      <VBtn v-if="user.isLogin" prepend-icon="mdi-pen" class="buttonstyle" @click="information" >個人資料</VBtn>
      <VBtn prepend-icon="mdi-logout" v-if="user.isLogin" @click="logout" class="buttonstyle" >登出</VBtn>
    </div>
  </VContainer>
</VAppBar>
<VMain
style="min-height: 150vh;"
class="bg"
>
  <RouterView :key="$route.path" >
  </RouterView>
</VMain>
<VFooter
style=
"
background-color: rgba(245,203,50,0.9);
color:white; font-size: 2rem;
display: flex;
justify-content: center;
"

>
  <div>
    禁止酒駕 &nbsp;
    ，
    未成年請勿飲酒&nbsp;
  </div>
  <img src="https://www.kkbar2023.com/images/stop.png" style="size:;">
</VFooter>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { computed, ref } from 'vue'
import Register from '../components/UserRegister.vue'
import Login from '../components/UserLogin.vue'
import { useUserStore } from '@/store/user'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// const imageUrl = computed(() => new URL('@/assets/wine-cellar.jpg', import.meta.url).href)

const dialog = ref(false)
const drawer = ref(false)
const tab = ref('one')

const user = useUserStore()
const { apiAuth } = useApi()
const router = useRouter()
const createSnackbar = useSnackbar()

const navItems = [
  { to: '/login', text: '登入', icon: 'mdi-login' }
]

const cog = () => {
  router.push('/admin')
}

const information = () => {
  console.log('information method called')
  router.push('/self')
}

const menu = [
  { to: '/menu1', text: '酒鬼專區', list: [{ to: '/', text: '經典調酒' }, { to: '/', text: '超商酒單' }, { to: '/', text: '酒單分享' }] },
  { to: '/menu2', text: '喝酒必備', list: [{ to: '/', text: '酒桌遊戲' }, { to: '/', text: '調酒酒單' }] },
  // { to: '/menu3', text: '活動專區' },
  { to: '/menu4', text: '購物車', list: [{ to: '/orders', text: '購買紀錄' }] }
  // { to: '/menu5', text: '關於我們' }
]

const logout = async () => {
  try {
    await apiAuth.delete('/users/logout')
    user.logout()
    createSnackbar({
      text: '登出成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    router.push('/')
  } catch (error) {
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
</script>

<style scoped>

.v-list-item-title{
  font-size: 1rem;
}

.fullcontainer{
  display: flex;
  align-items: center;
  color: white;
  justify-content: space-between;
}

.bartitle{
  font-weight: bolder;
  font-size: 2rem;
  display: flex;
  align-items: center;
}

.buttonstyle{
  font-size: 1.5rem;
  font-weight: bolder;
}

.loginbutton{
  margin-left: auto;
}
.bg{
  background-size: cover;
  background-image: url('https://images.unsplash.com/photo-1611575189074-9dfbbceb258a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2luZSUyMGNlbGxhcnxlbnwwfHwwfHx8MA%3D%3D')
}

</style>
