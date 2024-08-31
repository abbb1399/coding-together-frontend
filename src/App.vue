<template>
  <div
    id="app-main"
    :class="{ 'phone-auth': $route.path === '/auth' && isPhone }"
  >
    <the-header />

    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component" />
      </transition>
    </router-view>
  </div>

  <the-footer v-if="!$route.meta.hideFooter" />
</template>

<script>
import { computed, watch, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";

export default {
  components: {
    TheHeader,
    TheFooter,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isPhone = inject("$is-phone");

    // auto login
    store.dispatch("tryLogin");

    const didAutoLogout = computed(() => {
      return store.getters.didAutoLogout;
    });

    watch(didAutoLogout, (curValue, oldValue) => {
      // 로그인 시간이 만료되면, 로그아웃되면서 articles 페이지로 이동
      // curval이 true고(autologout 한거고) 값이 변한거면
      if (curValue && curValue !== oldValue) {
        router.replace("/articles");
      }
    });

    return {
      isPhone,
    };
  },
};
</script>

<style lang="scss">
#app-main {
  min-height: 90vh;
}

.phone-auth {
  min-height: 0 !important;
}

// Vue Transition css
.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
