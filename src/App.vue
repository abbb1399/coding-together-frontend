<template>
  <div id="app-main">
    <the-header></the-header>

    <router-view v-slot="slotProps" style="flex:1;" >
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>  
    
    <the-footer></the-footer>
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
  async created(){
    // auto login
    await this.$store.dispatch('tryLogin')
    // await this.$store.dispatch('fetchMyInfo')
  
  },
  watch:{
    didAutoLogout(curValue, oldValue){
      // curval이 true고(autologout 한거고) 값이 변한거면
      if(curValue && curValue !== oldValue){
        this.$router.replace('/articles')
      }
    } 
  },
  methods:{
  
  }
}
</script>

<style lang="scss">
  // Loboto, Lobster 폰트
  @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Roboto:wght@400;500;700;900&display=swap');
  
  #app-main{
    min-height: 100vh;
    display: flex; 
    flex-direction:column; 
  }
  
  // Vue Transitoin css
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
