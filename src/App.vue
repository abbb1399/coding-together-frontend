<template>
  <div id="app-main">    
    <the-header/>

    <router-view v-slot="slotProps" :class="{ 'articles-height': $route.path === '/articles' }">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"/>
      </transition>
    </router-view>
  </div>

  <the-footer v-if="!$route.meta.hideFooter"/>
</template>

<script>
import { computed, watch} from 'vue'
import { useStore } from "vuex"
import { useRouter } from "vue-router"

import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'

export default {
  components:{
    TheHeader,
    TheFooter
  },
  setup(){
    const store = useStore()
    const router = useRouter()
    
    // auto login
    store.dispatch('tryLogin')
 
    const didAutoLogout = computed(() => {
      return store.getters.didAutoLogout
    })

    watch(didAutoLogout, (curValue, oldValue) => {
      // curval이 true고(autologout 한거고) 값이 변한거면
      if(curValue && curValue !== oldValue){
        router.replace('/articles')
      }
    })
  }
}
</script>

<style lang="scss">
  #app-main{
    min-height: 90vh;
  }
  
  .articles-height{
    min-height: 100vh;
  }

  // Vue Transition css
  .route-enter-from{
    opacity: 0;
    transform: translateY(-30px);
  }

  .route-leave-to{
    opacity: 0;
    transform: translateY(30px);
  }

  .route-enter-active{
    transition: all 0.3s ease-out;
  }

  .route-leave-active{
    transition: all 0.3s ease-in;
  }

  .route-enter-to,
  .route-leave-from{
    opacity: 1;
    transform: translateY(0);
  }
</style>
