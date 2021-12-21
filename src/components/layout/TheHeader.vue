<template>
  <header>
    <nav>
      <h1><router-link to="/">Coding Together</router-link></h1>
      <ul class="navbar_menu">
        <li>
          <router-link to="/coaches">공고 목록</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/requests">요청들</router-link>
        </li>
        <li v-else>
          <router-link to="/auth">로그인</router-link>
        </li>
        <li v-if="isLoggedIn">
          <base-button @click="logout">로그아웃</base-button>
        </li>
      </ul>

      <a href="#" class="navbar_togleBtn" @click="openMenu">
        <i class="fas fa-bars"></i>
      </a>
    </nav>
  </header>
</template>

<script>
export default {
  computed:{
    isLoggedIn(){
      return this.$store.getters.isAuthenticated
    }
  },
  created(){

  },
  methods:{ 
    logout(){
      this.$store.dispatch('logout')
      this.$router.replace('/coaches')
    },
    openMenu(){
      const menu = document.querySelector('.navbar_menu');
      menu.classList.toggle('active');
    }
  }
}
</script>

<style scoped>
  header {
    width: 100%;
    height: 5rem;
    background-color: #3d008d;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  header a {
    text-decoration: none;
    color: #f391e3;
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: 1px solid transparent;
  }

  a:active,
  a:hover,
  a.router-link-active {
    border: 1px solid #f391e3;
  }

  h1 {
    margin: 0;
  }

  h1 a {
    color: white;
    margin: 0;
  }

  h1 a:hover,
  h1 a:active,
  h1 a.router-link-active {
    border-color: transparent;
  }

  header nav {
    width: 90%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  li {
    margin: 0 0.5rem;
  }

  .navbar_togleBtn{
    display: none;
    position: absolute;
    right: 32px;
    font-size: 24px;
    color: #d49466
  }

  @media screen and (max-width: 768px){
    header nav{
      flex-direction: column;
      align-items: flex-start;
      padding: 8px 24px;
      background-color: #3d008d;
      width:100%;
      overflow: overlay;
    }

    .navbar_menu{
      display: none;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    
    .navbar_menu li{
      width: 100%;
      text-align: center;
    }

    /* .navbar_menu li:hover{
      background-color: #7e36d6;
      border-radius: 4px;
    } */



    .navbar_togleBtn{
      display: block;
    }

    .navbar_menu.active{
      display:flex;
    }
  }
</style>