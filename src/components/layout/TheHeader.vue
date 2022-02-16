<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">Coding Together</router-link>
      </h1>
      <ul class="navbar-menu">
        <li>
          <router-link to="/coaches">공고 목록</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/requests">요청들</router-link>
        </li>
        <li v-else>
          <router-link to="/auth">로그인</router-link>
        </li>
        <!-- 아바타 -->
        <li v-if="isLoggedIn">
          <drop-down>
            <template #content></template>
            <template #default>
              <ul class="dropdown-menu">
                <li @click="toUserInfo">내 정보</li>
                <li @click="logout">로그아웃</li>
              </ul>
            </template>
          </drop-down>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import DropDown from '../../components/ui/BaseDropdown.vue'

export default {
  components:{
    DropDown
  },
  computed:{
    isLoggedIn(){
      return this.$store.getters.isAuthenticated
    }
  },
  async created(){
  },
  methods:{ 
    logout(){
      this.$store.dispatch('logout')
      this.$router.replace('/coaches')
    },
    openMenu(){
      const menu = document.querySelector('.navbar-menu');
      menu.classList.toggle('active');
    },
    toUserInfo(){
      this.$router.push('user-info')
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    width: 100%;
    height: 5rem;
    background-color: $primary-color;
    display: flex;
    justify-content: center;
    align-items: center;
  
    a{
      text-decoration: none;
      color: #f391e3;
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border: 1px solid transparent;
    
      &:active,
      &:hover,
      &.router-link-active {
        border: 1px solid #f391e3;
      }
    }

    nav {
      width: 90%;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    
    li {
      margin: 0 0.5rem;
    }
  }


  h1 {
    margin: 0;
  
    a{
      color: white;
      margin: 0;

      &:hover,
      &:active,
      &.router-link-active{
        border-color: transparent;
      }
    }
  }

  .navbar-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dropdown-menu{
    list-style: none;
    margin: 0px;
    padding: 0px;
    max-width: 250px;
    width: 100%;

    li{
      padding: 8px 16px 8px 16px;
      margin-bottom: 5px;
      font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      margin:0;

      &:hover{
         background: #0000001f;
      }
    }
  }
</style>