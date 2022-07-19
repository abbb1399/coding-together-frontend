<template>
  <ul class="pagination">
    <li class="pagination__item">
      <button type="button" @click="onClickFirstPage" :disabled="isInFirstPage">
        First
      </button>
    </li>

    <li class="pagination__item">
      <button
        type="button"
        @click="onClickPreviousPage"
        :disabled="isInFirstPage"
      >
        Previous
      </button>
    </li>

    <!-- 숫자 버튼 시작-->
    <li v-for="page in pages" :key="page.name" class="pagination__item">
      <button
        type="button"
        @click="onClickPage(page.name)"
        :disabled="page.isDisabled"
        :class="{ active: isPageActive(page.name) }"
      >
        {{ page.name }}
      </button>
    </li>

    <!--숫자 버튼 종료 -->

    <li class="pagination__item">
      <button type="button" @click="onClickNextPage" :disabled="isInLastPage">
        Next
      </button>
    </li>

    <li class="pagination__item">
      <button type="button" @click="onClickLastPage" :disabled="isInLastPage">
        Last
      </button>
    </li>
  </ul>
</template>

<script>
import { computed, toRefs } from "vue"

export default {
  emits: ["pagechanged"],
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
    const { maxVisibleButtons, totalPages, currentPage } = toRefs(props)

    const startPage = computed(() => {
      if (currentPage.value === 1) {
        return 1
      }

      // 마지막 페이지일때
      if (currentPage.value === totalPages.value) {
        const start = totalPages.value - (maxVisibleButtons.value - 1)

        if (start === 0) {
          return 1
        } else {
          return start
        }
      }

      // 중간 페이지 일때
      return currentPage.value - 1
    })

    const pages = computed(() => {
      const range = []
      for (
        let i = startPage.value;
        i <=
        Math.min(
          startPage.value + maxVisibleButtons.value - 1,
          totalPages.value
        );
        i++
      ) {
        range.push({
          name: i,
          isDisabled: i === currentPage.value,
        })
      }
      return range
    })

    const isInFirstPage = computed(() => {
      return currentPage.value === 1
    })

    const isInLastPage = computed(() => {
      return currentPage.value === totalPages.value
    })

    const onClickFirstPage = () => {
      context.emit("pagechanged", 1)
    }

    const onClickPreviousPage = () => {
      context.emit("pagechanged", currentPage.value - 1)
    }

    const onClickPage = (page) => {
      context.emit("pagechanged", page)
    }

    const onClickNextPage = () => {
      context.emit("pagechanged", currentPage.value + 1)
    }

    const onClickLastPage = () => {
      context.emit("pagechanged", totalPages.value)
    }

    const isPageActive = (page) => {
      return currentPage.value === page
    }

    return {
      startPage,
      pages,
      isInFirstPage,
      isInLastPage,
      onClickFirstPage,
      onClickPreviousPage,
      onClickPage,
      onClickNextPage,
      onClickLastPage,
      isPageActive,
    }
  },
}
</script>

<style scoped lang="scss">
.pagination {
  list-style-type: none;

  &__item {
    display: inline-block;
  }

  .active {
    background-color: #4aae9b;
    color: #ffffff;
  }
}
</style>
