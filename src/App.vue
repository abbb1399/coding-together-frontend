<template>
  <div id="app-main">    
    <the-header></the-header>

    <router-view v-slot="slotProps" >
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component" :class="{'flex-one':!$route.meta.hideFooter}"></component>
      </transition>
    </router-view>  

    <the-footer v-if="!$route.meta.hideFooter"></the-footer>
  </div>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'

export default {
  components:{
    TheHeader,
    TheFooter
  },
  computed:{
    didAutoLogout(){
      return this.$store.getters.didAutoLogout
    }
  },
  watch:{
    didAutoLogout(curValue, oldValue){
      // curval이 true고(autologout 한거고) 값이 변한거면
      if(curValue && curValue !== oldValue){
        this.$router.replace('/articles')
      }
    } 
  },
  async created(){
    // try login
    await this.$store.dispatch('tryLogin')
  },
  methods:{
  
  }
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
