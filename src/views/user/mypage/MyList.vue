<template>
  <section>
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <div class="my-list">
      <header class="my-list__header">
        <h2>내가 쓴 공고</h2>
      </header>
      <base-spinner v-if="isLoading"></base-spinner>
      <ul class="my-list__list" v-else-if="hasLists && !isLoading">
        <my-request-list
          v-for="list in myList"
          :key="list._id"
          :id="list._id"
          :title="list.name"
          :description="list.description"
          :areas="list.areas"
          :thumbnail="list.thumbnail"
          :createdAt="list.createdAt"
          :completed="list.completed"
        />
      </ul>
      <h3 class="my-list__no-request" v-else>내가 쓴 글이 없습니다.</h3>
    </div>
  </section>
</template>

<script>
import {ref, computed} from 'vue'
import { useStore } from "vuex"
import MyRequestList from '../../../components/mypage/MyRequestList.vue'

export default {
  components: {
    MyRequestList,
  },
  setup() {
    const store = useStore()

    const isLoading = ref(false)
    const error = ref(null)

    const hasLists = computed(() => {
      return store.getters["articles/getMyPageList"].length > 0
    })

    const myList = computed(() => {
      return store.getters["articles/getMyPageList"]
    })

    const init = (async () =>{
      isLoading.value = true
      await store.dispatch("articles/fetchMyArticle")
      isLoading.value = false
    })


    const handleError = () => {
      error.value = null
    }

    init()

    return{
      isLoading,
      error,
      hasLists,
      myList,
      handleError
    }
  }
}
</script>

<style lang="scss" scoped>
.my-list {
  margin-top: 1rem;

  &__header {
    text-align: center;
  }

  &__list {
    list-style: none;
    margin: 2rem auto;
    padding: 0;
    max-width: 50rem;
  }

  &__no-request {
    margin-top: 1rem;
    text-align: center;
  }
}
</style>
