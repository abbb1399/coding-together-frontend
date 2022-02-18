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
              <ul id="dropdown-menu">
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
      const menu = document.querySelector('ul');
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
    height: 8rem;
    border-bottom: 1px $light-color solid;
    display: flex;

    nav {
      width: 80%;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      // Coding Together 로고
      h1 {
        a{
          font-family: 'Lobster', cursive;
          font-size: 2.4rem;
          color: $primary-color;

          // &:hover,
          // &:active,
          // &.router-link-active{
          //   border-color: transparent;
          // }
        }
      }


      // 공고목록,요청들,로그인,아바타.. 목록들
      .navbar-menu {
        display: flex;
        align-items: center;

        li {
          padding: 0 1rem;

          a{
            color: #333;
            font-size: 1.6rem;
            font-weight: 700;
            padding: .5rem;
          
            &:hover{
              border-bottom: 3px solid $medium-color;
            }

            &.router-link-active {
              border-bottom: 3px solid $primary-color;
            }
          }
        }
      }
    }
  }



  // 아바타 dropdown 메뉴
  #dropdown-menu{
    li{
      padding: .8rem 1.6rem .8rem 1.6rem;
      font-size: 1.4rem;
      line-height: 1.5;

      &:hover{
         background: #0000001f;
      }
    }
  }
</style>