<template>
  <div>
    <section id="list">
      <!-- 에러 Dialog -->
      <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
        <p>{{ error }}</p>
      </base-dialog>
      
      <header class="page-heading">
        <h1>동료 찾기 </h1>
        <div class="filter">
          <div>
            <select v-model="selectType" @change="changeType">
              <option v-for=" (data,i) in selectArray" :value="data.value" :key="i">
                {{data.label}}
              </option>
            </select>
            <!-- <base-button id="refresh-btn" mode="secondary" @click="loadArticles(true)">
              <font-awesome-icon icon="rotate-right"/>
            </base-button> -->
          </div>

          <div>
            <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">로그인/공고 등록</base-button>
            <base-button v-if="isLoggedIn && !isLoading" link to="/register">공고 등록</base-button>
          </div>
        </div>
      </header>

      <div v-if="isLoading">
        <base-spinner></base-spinner>
      </div>
      
      <!-- <ul v-else-if="hasArticles"> -->
      <ul v-else>
        <article-item
          v-for="coach in list"
          :key="coach.id"
          :name="coach.name"
          :areas="coach.areas"
          :owner="coach.owner"
          :thumbnail="coach.thumbnail"
        >
        </article-item>
      </ul>
      <!-- <h3 v-else>목록이 없습니다.</h3> -->
      <infinite-loading @infinite="infiniteHandler" :identifier="infiniteId">
        <template #no-more>모든 데이터를 불러왔습니다.</template>
        <template #no-results>결과가 없습니다.</template>
      </infinite-loading>
    </section>
  </div>
</template>

<script>
import ArticleItem from '../../components/articles/ArticleItem.vue'
// import CoachFilter from '../../components/articles/CoachFilter.vue'
import InfiniteLoading from 'vue-infinite-loading'

export default {
   components:{
      ArticleItem,
      // CoachFilter,
      InfiniteLoading
   },
   data(){
     return{
      isLoading:false,
      error:null,
      list:[],
      page:0,
      selectType: 'all',
      selectArray: [
        {label: '전체', value: 'all'},
        {label: '프론트엔드', value: 'frontend'},
        {label: '백엔드',value: 'backend'},
        {label: '퍼블리셔', value: 'publisher'},
      ],
      infiniteId: +new Date(),
    }
  },
  computed:{
    isLoggedIn(){
      return this.$store.getters.isAuthenticated
    },
    isArticle(){
      // console.log(this.$store.getters['articles/isArticle'])
      console.log(this.list)
      return this.$store.getters['articles/isArticle']
    },
 
    hasArticles(){
      return !this.isLoading && this.$store.getters['articles/hasArticles']
    }
  },
  created(){
    this.loadArticles()
  },
  methods:{
    setFilters(updatedFilters){
      const array = []      
      Object.keys(updatedFilters).forEach(key => {
        let value = updatedFilters[key]
        if(key && value){
          array.push(key)
        }
      })
      console.log(array)

      // const payload = {
      //   pageNum:0,
      //   filter: array
      // }

      // this.$store.dispatch('articles/moreLoadCoaches', payload)
      // console.log(this.$store.getters['coaches/coaches'])
    },
    async loadArticles(refresh = false) { //default value
      this.isLoading = true
      try{
        await this.$store.dispatch('articles/loadArticles', { forceRefresh : refresh})
      }catch(error){
        this.error = error.message || '에러 발생!'
      }
      this.isLoading = false
    },
    handleError(){
      this.error = null
    },
    async infiniteHandler($state){
      const payload = {
        pageNum:this.page,
        filter: this.selectType
      }

      await this.$store.dispatch('articles/moreLoadArticles', payload)
      
      const listArray = this.$store.getters['articles/articles']

      if(listArray.length){
        this.page += 4
        this.list.push(...listArray)
        $state.loaded()
      }else{
        $state.complete()
      }
    },
    changeType(){
      this.page = 0;
      this.list = [];
      this.infiniteId += 1;
    }
  },
}
</script>

<style lang="scss" scoped>
  #list{
    max-width: 1100px;
    margin: auto;
  }

  select{
    border-radius: 5px;
    width: 130px;
    margin-right: 15px;
    font-weight: 700;
  }

  ul{
    list-style: none;;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.6rem;
  }

  .filter {
    display: flex;
    margin-top:0;
    /* justify-content: space-between; */
  }

  .page-heading{
    padding: 48px 0 20px 0;
  }

  .page-heading h1{
    font-size: 34px;
  }

  .filter{
    display: flex;

    justify-content: flex-end;
    margin-top: 1rem;
  }

  .filter > div:first-child{
    display: flex;
  }

  h1{
    text-align: center;
  }

</style>