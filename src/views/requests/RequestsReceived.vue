<template>
  <section class="requests">
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <header class="requests__header">
      <h2>받은 요청들</h2>
    </header>

    <div v-if="receivedRequests.length">
      <ul class="requests__list">
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
        />
      </ul>
    </div>
    <h3 v-else class="requests__no-list">받은 요청이 없습니다.</h3>

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
import useUnreadRequests from "../../hooks/use-unread-requests"

export default {
  components: {
    RequestItem,
    Pagination,
  },
  setup() {
    const store = useStore()
    const error = ref(null)
    const currentPage = ref(1)
    const perPage = ref(5)
    const { unreadRequestsCount } = useUnreadRequests()

    const receivedRequests = computed(() => {
      return store.getters["requests/requests"]
    })

    const total = computed(() => {
      return store.getters["requests/getTotalRequest"]
    })

    const totalPages = computed(() => {
      return Math.ceil(
        store.getters["requests/getTotalRequest"] / perPage.value
      )
    })

    const init = async () => {
      // requests 불러오기
      store.dispatch("requests/fetchRequests", currentPage.value)
      unreadRequestsCount()
    }

    const handleError = () => {
      error.value = null
    }

    const onPageChange = (page) => {
      store.dispatch("requests/fetchRequests", page)
      currentPage.value = page
    }

    init()

    return {
      total,
      totalPages,
      currentPage,
      perPage,
      error,
      receivedRequests,
      handleError,
      onPageChange,
    }
  },
}
</script>

<style lang="scss" scoped>
.requests {
  max-width: 62.5rem;
  margin: 2rem auto;
  /* margin-top: 1rem; */

  &__header {
    text-align: center;
  }

  &__no-request {
    margin-top: 1rem;
    text-align: center;
  }

  &__no-list {
    text-align: center;
    margin-top: 1.5rem;
  }
}

.pagination {
  margin-top: 2rem;
}
</style>
