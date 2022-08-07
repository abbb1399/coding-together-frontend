<template>
  <section>
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <div class="requests">
      <header class="requests__header">
        <h2>받은 요청들</h2>
      </header>
      <base-spinner v-if="isLoading"></base-spinner>
      <ul class="requests__list" v-else-if="hasRequests && !isLoading">
        <request-item
          v-for="req in receivedRequests"
          :key="req._id"
          :room-id="req.roomId"
          :request-id="req._id"
          :title="req.title"
          :from-name="req.userId.name"
          :from-email="req.userId.email"
          :from-img-src="req.userId.avatar"
          :created-at="req.createdAt"
          :is-read="req.isRead"
        >
        </request-item>
      </ul>
      <h3 class="requests__no-request" v-else>받은 요청이 없습니다.</h3>
    </div>

    <pagination
      v-if="receivedRequests.length"
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
import RequestItem from "../../components/requests/RequestItem.vue"
import Pagination from "../../components/ui/Pagination.vue"

export default {
  components: {
    RequestItem,
    Pagination,
  },
  setup() {
    const store = useStore()
    const isLoading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const perPage = ref(5)

    const receivedRequests = computed(() => {
      return store.getters["requests/requests"]
    })

    const total = computed(() => {
      return store.getters["requests/getTotalRequest"]
    })

    const totalPages = computed(() => {
      return Math.ceil(store.getters["requests/getTotalRequest"] / perPage.value)
    })

    const hasRequests = computed(() => {
      return store.getters["requests/hasRequests"]
    })

    const loadRequests = async () => {
      isLoading.value = true
      // requests 불러오기
      await store.dispatch("requests/fetchRequests", currentPage.value)

      isLoading.value = false
    }

    const handleError = () => {
      error.value = null
    }

    const onPageChange = (page) => {
      // store.dispatch("chat/fetchChatRoomList", page)
      currentPage.value = page
    }

    loadRequests()

    return {
      total,
      totalPages,
      currentPage,
      perPage,
      isLoading,
      error,
      receivedRequests,
      hasRequests,
      handleError,
      onPageChange,
    }
  },
}
</script>

<style lang="scss" scoped>
.requests {
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

.pagination{
  margin-top: 2rem;
}
</style>
