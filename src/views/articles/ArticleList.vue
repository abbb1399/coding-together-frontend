<template>
  <section class="articles">
    <!-- 에러 Dialog -->
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <article-header @change-type="changeType" />

    <ul class="articles__list">
      <article-item
        v-for="article in articleList"
        :key="article.id"
        :id="article.id"
        :title="article.name"
        :areas="article.areas"
        :thumbnail="article.thumbnail"
      />
    </ul>

    <infinite-loading @infinite="infiniteHandler" :identifier="infiniteId">
      <template #no-more>모든 데이터를 불러왔습니다.</template>
      <template #no-results>결과가 없습니다.</template>
    </infinite-loading>
  </section>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

import ArticleItem from "../../components/articles/ArticleItem.vue";
import ArticleHeader from "../../components/articles/ArticleHeader.vue";
import InfiniteLoading from "vue-infinite-loading";

import useUnreadRequests from "../../hooks/use-unread-requests";

export default {
  components: {
    ArticleItem,
    ArticleHeader,
    InfiniteLoading,
  },
  setup() {
    const store = useStore();

    const error = ref(null);
    const articleList = ref([]);
    const page = ref(0);
    const selectedType = ref("all");
    const infiniteId = ref(new Date().getTime());

    const { unreadRequestsCount } = useUnreadRequests();

    const infiniteHandler = async ($state) => {
      const payload = {
        pageNum: page.value,
        filter: selectedType.value,
      };
      try {
        await store.dispatch("articles/loadArticles", payload);
        const listArray = store.getters["articles/articles"];

        if (listArray.length) {
          $state.loaded();
          page.value += 4;
          articleList.value = [...articleList.value, ...listArray];
        } else {
          $state.complete();
        }
      } catch (e) {
        error.value = e.message;
      }
    };

    const changeType = (selectType) => {
      selectedType.value = selectType;
      page.value = 0;
      articleList.value = [];
      infiniteId.value += 1;
    };

    const handleError = () => {
      error.value = null;
    };

    // 안읽은 requests 갯수 불러오기
    unreadRequestsCount();

    return {
      error,
      articleList,
      infiniteId,
      handleError,
      infiniteHandler,
      changeType,
    };
  },
};
</script>

<style lang="scss" scoped>
.articles {
  max-width: 62.5rem;
  margin: 0 auto;
  min-height: calc(100vh - 2.5rem);

  @include respond(big-screen) {
    max-width: $website-width;
  }

  @media screen and (max-width: 860px) {
    margin: 0 1rem;
  }

  &__list {
    list-style: none;
    display: grid;
    /* dynamic columns */
    grid-template-columns: repeat(auto-fit, minmax(13.4rem, 1fr));
    gap: 1.6rem;

    /* 4columns */
    /* grid-template-columns: repeat(4, minmax(6rem, 1fr));
      @include respond(tab-port){
        grid-template-columns: repeat(3, 1fr);
      }
      @include respond(phone){
        grid-template-columns: repeat(2, 1fr);
      } */
  }
}
</style>
