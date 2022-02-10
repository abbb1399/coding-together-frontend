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
          <select v-model="selectType" @change="changeType">
            <option v-for=" (data,i) in selectArray" :value="data" :key="i">
              {{data}}
            </option>
          </select>
          <base-button mode="outline" @click="loadCoaches(true)">새로고침</base-button>
          
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">로그인/공고 등록</base-button>
          <base-button v-if="isLoggedIn && !isCoach && !isLoading" link to="/register">공고 등록</base-button>
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <!-- <ul v-else-if="hasCoaches"> -->
        <ul v-else>
          <coach-item
            v-for="coach in list"
            :key="coach.id"
            :name="coach.name"
            :areas="coach.areas"
            :owner="coach.owner"
          >
          </coach-item>
        </ul>
        <!-- <h3 v-else>목록이 없습니다.</h3> -->
        <infinite-loading @infinite="infiniteHandler" :identifier="infiniteId">
          <template #no-more>모든 데이터를 불러왔습니다.</template>
        </infinite-loading>
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
      selectType: 'all',
      selectArray: ['all','frontend','backend','publisher'],
      infiniteId: +new Date(),
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
  created(){
  
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

      // this.$store.dispatch('coaches/moreLoadCoaches', payload)
      // console.log(this.$store.getters['coaches/coaches'])
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
    async infiniteHandler($state){
      const payload = {
        pageNum:this.page,
        filter: this.selectType
      }

      await this.$store.dispatch('coaches/moreLoadCoaches', payload)
      
      const listArray = this.$store.getters['coaches/coaches']

      if(listArray.length){
        this.page += 2
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
    /* justify-content: space-between; */
  }
</style>