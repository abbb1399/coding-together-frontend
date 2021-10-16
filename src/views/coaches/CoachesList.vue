<template>
  <div>
     <!-- String truthy value를 boolean으로 만들기 위해 !! -->
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>
    <section>
      <base-card>
        <div class="controls"> 
          <base-button mode="outline" @click="loadCoaches(true)">새로고침</base-button>
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">로그인/코치 등록</base-button>
          <base-button v-if="isLoggedIn && !isCoach && !isLoading" link to="/register">코치 등록</base-button>
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :name="coach.name"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          >
          </coach-item>
        </ul>
        <h3 v-else>코치가 없습니다.</h3>
      </base-card>
    </section>
  </div>
</template>


<script>
import CoachItem from '../../components/coaches/CoachItem.vue'
import CoachFilter from '../../components/coaches/CoachFilter.vue'

export default {
   components:{
      CoachItem,
      CoachFilter 
   },
   data(){
     return{
       isLoading:false,
       error:null,
       activeFilters:{
        frontend:true,
        backend:true,
        career:true
      }
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
      const coaches = this.$store.getters['coaches/coaches']
      return coaches.filter(coach => {
        // 내가 FronteEnd를 체크했고, 선생도 Frontend를 가지고 있는 경우
        if(this.activeFilters.frontend && coach.areas.includes('frontend')){
          return true
        }
        if(this.activeFilters.backend && coach.areas.includes('backend')){
          return true
        }
        if(this.activeFilters.career && coach.areas.includes('career')){
          return true
        }
        return false
      })
    },
    hasCoaches(){
      return !this.isLoading && this.$store.getters['coaches/hasCoaches']
    }
  },
  created(){
    this.loadCoaches()
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
    }
  }
}
</script>

<style scoped>
  ul{
    list-style: none;;
    margin: 0;
    padding: 0;
  }

  .controls {
    display: flex;
    justify-content: space-between;
  }
</style>