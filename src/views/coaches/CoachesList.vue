<template>
  <div>
    <!-- 에러 Dialog -->
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    
    <!-- 검색 필터 -->
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>
  
    <!-- 공고 list -->
    <section>
      <base-card>
        <div class="controls"> 
          <button @click="test22">테스트</button>
          <base-button mode="outline" @click="loadCoaches(true)">새로고침</base-button>
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">로그인/공고 등록</base-button>
          <base-button v-if="isLoggedIn && !isCoach && !isLoading" link to="/register">공고 등록</base-button>
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item
            v-for="coach in list"
            :key="coach.id"
            :name="coach.name"
            :areas="coach.areas"
            :owner="coach.owner"
          >
          </coach-item>
        </ul>
        <h3 v-else>목록이 없습니다.</h3>
        <infinite-loading @infinite="infiniteHandler"></infinite-loading>
      </base-card>
    </section>
  </div>
          
         
</template>


<script>
import CoachItem from '../../components/coaches/CoachItem.vue'
import CoachFilter from '../../components/coaches/CoachFilter.vue'
import InfiniteLoading from 'vue-infinite-loading'

export default {
   components:{
      CoachItem,
      CoachFilter,
      InfiniteLoading
   },
   data(){
     return{
       isLoading:false,
       error:null,
       activeFilters:{
        frontend:true,
        backend:true,
        publisher:true
      },
      list:[],
      page:0,
    }
  },
  computed:{
    isLoggedIn(){
      return this.$store.getters.isAuthenticated
    },
    isCoach(){
      return this.$store.getters['coaches/isCoach']
    },
    filteredCoaches(){
      const coaches =  this.$store.getters['coaches/coaches']
      // console.log(coaches)
      return coaches.filter(coach => {
        // 내가 fronteend를 체크했고, 선생도 frontend를 가지고 있는 경우
        if(this.activeFilters.frontend && coach.areas.includes('frontend')){
          return true;
        }
        if(this.activeFilters.backend && coach.areas.includes('backend')){
          return true;
        }
        if(this.activeFilters.publisher && coach.areas.includes('publisher')){
          return true;
        }
        return false
      })
    },
    hasCoaches(){
      return !this.isLoading && this.$store.getters['coaches/hasCoaches']
    }
  },
  async created(){
    // await this.loadCoaches()
    // this.test22()
    // console.log(this.filteredCoaches)
  },
  methods:{
    setFilters(updatedFilters){
      this.activeFilters = updatedFilters
    },
    async loadCoaches(refresh = false) { //default value
      this.isLoading = true
      try{
        await this.$store.dispatch('coaches/loadCoaches', { forceRefresh : refresh})
      }catch(error){
        this.error = error.message || '에러 발생!'
      }
      this.isLoading = false
    },
    handleError(){
      this.error = null
    },
    async test22(){
      await this.$store.dispatch('coaches/moreLoadCoaches', this.page)
    
      this.list.push(...this.$store.getters['coaches/coaches'])
      this.page += 2
    },
    async infiniteHandler($state){
      console.log('infinite')
      await this.$store.dispatch('coaches/moreLoadCoaches', this.page)
      const array = this.$store.getters['coaches/coaches']
      console.log(array)
      // console.log('배열 갯수 : '+array)

      if(array.length){
        this.list.push(...array)
        $state.loaded()
        this.page += 2
      }else{
        $state.complete()
      }
    }
  },
}
</script>

<style scoped>
  ul{
    /* 초기화 */
    list-style: none;;
    margin: 0;
    padding: 0;

    /* 그리드 */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
  }

  .controls {
    display: flex;
    justify-content: space-between;
  }
</style>