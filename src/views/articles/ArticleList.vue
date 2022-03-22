<template>
  <section class="article">
    <!-- 에러 Dialog -->
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <article-header :is-loading="isLoading" @change-type="changeType" />

    <div v-if="isLoading">
      <base-spinner />
    </div>

    <ul class="article__list" v-else>
      <article-item
        v-for="coach in list"
        :key="coach.id"
        :name="coach.name"
        :areas="coach.areas"
        :owner="coach.owner"
        :thumbnail="coach.thumbnail"
      />
    </ul>

    <infinite-loading @infinite="infiniteHandler" :identifier="infiniteId">
      <template #no-more>모든 데이터를 불러왔습니다.</template>
      <template #no-results>결과가 없습니다.</template>
    </infinite-loading>
  </section>
</template>

<script>
import {ref} from 'vue'
import {useStore} from 'vuex'

import ArticleItem from "../../components/articles/ArticleItem.vue"
import ArticleHeader from "../../components/articles/ArticleHeader.vue"
import InfiniteLoading from "vue-infinite-loading"

export default {
  components: {
    ArticleItem,
    ArticleHeader,
    InfiniteLoading,
  },
  setup(){
    const store = useStore()

    const isLoading = ref(false)
    const error = ref(null)
    const list = ref([])
    const page= ref(0)
    const selectedType = ref('all')
    const infiniteId = ref(new Date().getTime())

    const loadArticles = async (refresh = false) =>{
      isLoading.value = true
      try{
        await store.dispatch("articles/loadArticles", {
          forceRefresh: refresh,
        })
      }catch(error){
        error.value = error.message || '에러 발생!'
      }
      isLoading.value = false
    }

    const handleError = () =>{
      error.value = null
    }

    const infiniteHandler = async ($state) =>{
      const payload ={
        pageNum: page.value,
        filter: selectedType.value
      }
      await store.dispatch("articles/moreLoadArticles", payload)
      const listArray = store.getters["articles/articles"]

       if (listArray.length) {
        page.value += 4
        list.value.push(...listArray)
        $state.loaded()
      } else {
        $state.complete()
      }
    }

    const changeType = (selectType) => {
      selectedType.value = selectType
      page.value = 0
      list.value = []
      infiniteId.value += 1
    }

    loadArticles()
    
    return{
      isLoading,
      error,
      list,
      infiniteId,
      handleError,
      infiniteHandler,
      changeType
    }
  }
}
</script>

<style lang="scss" scoped>
  .article{
    max-width: $website-width;
    margin: auto;

    &__list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.6rem;
    }
  }
</style>
