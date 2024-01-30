<template>
  <VAppBar color="rgba(0,0,0,0.9)" :elevation="3">
    <VContainer class="fullcontainer" fluid>
      <VBtn to="/" :active="false">
        <VAppBarTitle class="bartitle">醉後希望</VAppBarTitle>
      </VBtn>
      <template v-if="isMobile">

      </template>
      <!-- 下拉選單 -->
      <div>
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
              >
            <v-list-item-title>{{ subitem.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <!--  登入鍵 --->
    <div>
      <VBtn v-for="item in navItems" :key="item.to" :to="item.to" :prepend-icon="item.icon"  class="buttonstyle">
        {{ item.text }}
        <v-dialog
        v-model="dialog"
        activator="parent"
        width="auto"
      >
        <v-card min-width="500">
          <v-tabs
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
    </div>
  </VContainer>
</VAppBar>
<VMain>
  <RouterView></RouterView>
</VMain>
<!-- <VFooter color="rgba(0,0,0,0.9)"></VFooter> -->
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { computed, ref } from 'vue'
import Register from '../components/UserRegister.vue'
import Login from '../components/UserLogin.vue'

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

const tab = ref(null)

const dialog = ref(false)

const navItems = [
  { to: '/login', text: '登入', icon: 'mdi-login' }
]


const menu = [
  { to: '/menu1', text: '酒鬼專區', list: [{ to: '/', text: '經典調酒' }, { to: '/', text: '超商酒單' }, { to: '/', text: '酒單分享' }] },
  { to: '/menu2', text: '喝酒必備', list: [{ to: '/', text: '酒桌遊戲' }, { to: '/', text: '調酒酒單' }] },
  { to: '/menu3', text: '活動專區' },
  { to: '/menu4', text: '購物車' },
  { to: '/menu5', text: '關於我們' }
]

</script>

<style scoped>

.fullcontainer{
  display: flex;
  align-items: center;
  color: white;
  justify-content: space-around;
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


</style>
