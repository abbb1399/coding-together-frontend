<template>
  <div id="app-main">    
    <the-header/>

    <router-view v-slot="slotProps" >
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component" :class="{'flex-one':!$route.meta.hideFooter}"/>
      </transition>
    </router-view>  

    <the-footer v-if="!$route.meta.hideFooter"/>
  </div>
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
  },
}
</script>

<style lang="scss">
  // Loboto, Lobster 폰트
  @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Roboto:wght@400;500;700;900&display=swap');
  
  #app-main{
    display: flex; 
    flex-direction:column; 
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
