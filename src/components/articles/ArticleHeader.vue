<template>
  <header class="article-header">
    <h1>동료 찾기</h1>
    <div class="article-header__filter">
      <div>
        <select
          class="article-header__select"
          v-model="selectType"
          @change="changeType"
        >
          <option v-for="(list, index) in selectArray" :value="list.value" :key="index">
            {{ list.label }}
          </option>
        </select>
      </div>

      <div>
        <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">
          로그인/공고 등록
        </base-button>
        <base-button v-if="isLoggedIn && !isLoading" link to="/register">
          공고 등록
        </base-button>
      </div>
    </div>
  </header>
</template>

<script>
import { reactive, ref, computed } from "vue"
import { useStore } from "vuex"

export default {
  emits: ["change-type"],
  props: {
    isLoading: {
      type: Boolean,
      required:true
    },
  },
  setup(_, context) {
    const store = useStore()

    const selectType = ref("all")
    const selectArray = reactive(
      [
        { label: "전체", value: "all" },
        { label: "프론트엔드", value: "frontend" },
        { label: "백엔드", value: "backend" },
        { label: "퍼블리셔", value: "publisher" }
      ]
    )

    const isLoggedIn = computed(() => {
      return store.getters.isAuthenticated
    })

    const changeType = () => {
      context.emit("change-type", selectType.value)
    }

    return {
      selectArray,
      selectType,
      isLoggedIn,
      changeType,
    }
  },
}
</script>

<style lang="scss" scoped>
  .article-header {
    padding: 48px 0 20px 0;
    margin: inherit;

    h1 {
      font-size: 34px;
      text-align: center;
    }

    &__filter {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;

      & > div:first-child {
        display: flex;
      }
    }

    &__select {
      border-radius: 5px;
      width: 130px;
      margin-right: 15px;
      font-weight: 700;
    }
  }
</style>