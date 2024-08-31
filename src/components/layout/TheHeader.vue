<template>
  <nav class="nav">
    <h1 class="nav__brand">
      <router-link to="/" class="logo">Coding Together</router-link>
      <font-awesome-icon icon="bars" class="icon" @click="display" />
    </h1>

    <ul class="nav__items" :class="{ hide: !show }">
      <li v-if="!isPhone">
        <router-link to="/kanban">칸반</router-link>
      </li>
      <li>
        <router-link to="/chat">채팅 목록</router-link>
      </li>
      <li>
        <router-link to="/schedule">나의 일정</router-link>
      </li>
      <li>
        <router-link to="/articles">공고 목록</router-link>
      </li>
      <li v-if="isLoggedIn">
        <div v-if="unReadRequestsCount > 0" :data-badge="unReadRequestsCount" />
        <router-link class="test" to="/requests">받은 요청</router-link>
      </li>
      <li v-else>
        <router-link to="/auth">로그인</router-link>
      </li>
      <!-- 아바타 -->
      <li v-if="isLoggedIn" :class="{ avatar: unReadRequestsCount > 0 }">
        <drop-down id="dropdown-wrapper">
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
</template>

<script>
import DropDown from "../../components/ui/BaseDropdown.vue";
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: {
    DropDown,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const isPhone = inject("$is-phone");
    const show = ref(false);

    const isLoggedIn = computed(() => {
      return store.getters.isAuthenticated;
    });

    const unReadRequestsCount = computed(() => {
      return store.getters["requests/getUnreadRequests"];
    });

    const logout = () => {
      store.dispatch("logout");
      router.replace("/articles");
    };

    const openMenu = () => {
      const menu = document.querySelector("ul");
      menu.classList.toggle("active");
    };

    const toUserInfo = () => {
      router.push({ name: "myProfile" });
    };

    const display = () => {
      show.value = !show.value;
    };

    return {
      show,
      isLoggedIn,
      isPhone,
      unReadRequestsCount,
      logout,
      openMenu,
      toUserInfo,
      display,
    };
  },
};
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 9.5rem;
  border-bottom: 1px $light-color solid;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;

  @include respond(tab-port) {
    flex-direction: column;
    padding: 1rem 0;
  }

  &__brand {
    // Coding Together 로고
    .logo {
      font-family: "Lobster", cursive;
      font-size: 1.5rem;
      color: $primary-color;
    }

    .icon {
      display: none;

      @include respond(tab-port) {
        display: block;
        cursor: pointer;
        /* font-size: 20px; */
        position: absolute;
        right: 30px;
        top: 15px;
      }
    }
  }

  // 공고목록,요청들,로그인,아바타.. 목록들
  &__items {
    display: flex;
    align-items: center;

    [data-badge] {
      position: relative;
      &:after {
        position: absolute;
        right: -0.625rem;
        top: -0.5rem;
        line-height: 0.6;
        padding: 0.25rem;

        background-color: #bf1f1f;
        border: solid 1px #c93a3a;

        font-size: 0.625rem;
        color: #fff;
        border-radius: 30px;
        content: attr(data-badge);

        @include respond(tab-port) {
          right: -0.9rem;
        }
      }
    }

    & > li {
      padding: 0 0.625rem;

      @include respond(tab-port) {
        margin-top: 10px;
      }

      a {
        color: $color-grey-dark-3;
        font-weight: 700;
        padding: 0.3rem;

        &:hover {
          border-bottom: 3px solid $medium-color;
        }

        &.router-link-active {
          border-bottom: 3px solid $primary-color;
        }
      }
    }

    .avatar {
      margin-left: 0.1rem;
    }
  }

  .hide {
    @include respond(tab-port) {
      display: none;
    }
  }

  // 아바타 dropdown 메뉴
  #dropdown-menu {
    li {
      padding: 0.5rem 1rem 0.5rem 1rem;
      font-size: 0.875rem;
      line-height: 1.5;

      &:hover {
        background: #0000001f;
      }
    }
  }
}
</style>
