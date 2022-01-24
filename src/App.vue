<template>
  <the-header></the-header>
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>  
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue'

export default {
  components:{
    TheHeader
  },
  computed:{
    didAutoLogout(){
      return this.$store.getters.didAutoLogout
    }
  },
  // inject:['$moment'],
  created(){
    // const $moment = this.$moment
    // console.log($moment())
  
    // auto login
    this.$store.dispatch('tryLogin')
  },
  watch:{
    didAutoLogout(curValue, oldValue){
      // curval이 true고(autologout 한거고) 값이 변한거면
      if(curValue && curValue !== oldValue){
        this.$router.replace('/coaches')
      }
    } 
  }
}
</script>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

  :root{
    --text-color: #f0f4f5;
    --background-color: #263343;
    --accent-color: pink;
  }

  * {
    box-sizing: border-box;
  }

  html {
    font-family: "Roboto", sans-serif;
  }

  body {
    margin: 0;
  }
  
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
