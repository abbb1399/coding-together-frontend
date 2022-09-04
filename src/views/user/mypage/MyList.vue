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
      <ul class="my-list__list" v-else-if="total > 0 && !isLoading">
        <my-list-item
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
    <pagination
      v-if="myList.length"
      class="pagination"
      :total-pages="totalPages"
      :total="total"
      :per-page="perPage"
      :current-page="currentPage"
      @pagechanged="onPageChange"
    />
  </section>
</template>

<script>
import { ref, computed } from "vue"
import { useStore } from "vuex"
import MyListItem from "../../../components/mypage/MyListItem.vue"
import Pagination from "../../../components/ui/Pagination.vue"

export default {
  components: {
    MyListItem,
    Pagination
  },
  setup() {
    const store = useStore()

    const isLoading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const perPage = ref(5)

    const myList = computed(() => {
      return store.getters["articles/getMyPageList"]
    })

    const total = computed(() => {
      return store.getters["articles/getTotalMyListCount"]
    })

    const totalPages = computed(() => {
      return Math.ceil(store.getters["articles/getTotalMyListCount"] / perPage.value)
    })

    const init = async () => {
      isLoading.value = true
      await store.dispatch("articles/fetchMyArticle", currentPage.value)

      isLoading.value = false
    }

    const handleError = () => {
      error.value = null
    }

    const onPageChange = (page) => {
      store.dispatch("articles/fetchMyArticle", page)
      currentPage.value = page
    }

    init()

    return {
      perPage,
      currentPage,
      isLoading,
      error,
      total,
      totalPages,
      myList,
      handleError,
      onPageChange,
    }
  },
}
</script>

<style lang="scss" scoped>
section {
  .my-list {
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

  .pagination{
    margin-top: 2rem;
  }
}
</style>
