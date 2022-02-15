<template>
  <div id="main">
    <the-header></the-header>

    <router-view v-slot="slotProps" style="flex:1;">
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
        this.$router.replace('/coaches')
      }
    } 
  },
  methods:{
  
  }
}
</script>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

  :root{
    --text-color: #f0f4f5;
    --background-color: #263343;
    --accent-color: pink;
    --dark-color: #333;
    --primary-color: #c72727;
    --secondary-color: #f99500;
    --light-color: #f3f3f3;
    --dark-color: #333;
    --max-width: 1100px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: "Roboto", sans-serif;
  }

  body {
    background: #edeef0;
  }

  #main{
    min-height: 100vh;
    display: flex; 
    flex-direction:column; 
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
