<template>
  <ul class="pagination">
    <li class="pagination__item">
      <button
        class="btns"
        type="button"
        @click="onClickFirstPage"
        :disabled="isInFirstPage"
      >
        맨앞
      </button>
    </li>

    <li class="pagination__item">
      <button
        class="btns"
        type="button"
        @click="onClickPreviousPage"
        :disabled="isInFirstPage"
      >
        이전
      </button>
    </li>

    <!-- 숫자 버튼 시작-->
    <li v-for="page in pages" :key="page.name" class="pagination__item">
      <button
        type="button"
        @click="onClickPage(page.name)"
        :disabled="page.isDisabled"
        class="btns"
        :class="{ active: isPageActive(page.name) }"
      >
        {{ page.name }}
      </button>
    </li>
    <!--숫자 버튼 종료 -->

    <li class="pagination__item">
      <button
        class="btns"
        type="button"
        @click="onClickNextPage"
        :disabled="isInLastPage"
      >
        다음
      </button>
    </li>

    <li class="pagination__item">
      <button
        class="btns"
        type="button"
        @click="onClickLastPage"
        :disabled="isInLastPage"
      >
        맨끝
      </button>
    </li>
  </ul>
</template>

<script>
import { computed, toRefs } from "vue";

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
    const { maxVisibleButtons, totalPages, currentPage } = toRefs(props);

    const startPage = computed(() => {
      if (currentPage.value === 1) {
        return 1;
      }

      // 마지막 페이지일때
      if (currentPage.value === totalPages.value) {
        const start = totalPages.value - (maxVisibleButtons.value - 1);

        if (start === 0) {
          return 1;
        } else {
          return start;
        }
      }

      // 중간 페이지 일때
      return currentPage.value - 1;
    });

    const pages = computed(() => {
      const range = [];
      for (
        let i = startPage.value;
        i <=
        Math.min(
          startPage.value + maxVisibleButtons.value - 1,
          totalPages.value,
        );
        i++
      ) {
        range.push({
          name: i,
          isDisabled: i === currentPage.value,
        });
      }
      return range;
    });

    const isInFirstPage = computed(() => {
      return currentPage.value === 1;
    });

    const isInLastPage = computed(() => {
      return currentPage.value === totalPages.value;
    });

    const onClickFirstPage = () => {
      context.emit("pagechanged", 1);
    };

    const onClickPreviousPage = () => {
      context.emit("pagechanged", currentPage.value - 1);
    };

    const onClickPage = (page) => {
      context.emit("pagechanged", page);
    };

    const onClickNextPage = () => {
      context.emit("pagechanged", currentPage.value + 1);
    };

    const onClickLastPage = () => {
      context.emit("pagechanged", totalPages.value);
    };

    const isPageActive = (page) => {
      return currentPage.value === page;
    };

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
    };
  },
};
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style-type: none;

  &__item {
    display: inline-block;

    .btns {
      cursor: pointer;
      width: 3rem;
      height: 2rem;
      margin: 0 3px;

      border: 1px solid #4aae9b;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0);
      color: #4aae9b;
      font-weight: 600;
      padding: 5px;

      @include respond(tab-port) {
        font-size: 10px;
        height: 2.7rem;
      }
    }
  }

  .active {
    background-color: #4aae9b;
    color: #ffffff;
  }
}
</style>
