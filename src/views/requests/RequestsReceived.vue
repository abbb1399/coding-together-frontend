<template>
  <div>
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{error}}</p>
    </base-dialog>
    <section>
      <base-card>
        <header>
          <h2>받은 요청들</h2>
        </header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-else-if="hasRequests && !isLoading">
          <request-item
            v-for="req in receivedRequests"
            :key="req.id"
            :email="req.userEmail"
            :message="req.message"
          >
          </request-item>
        </ul>
        <h3 v-else>받은 요청이 없습니다.</h3>
      </base-card>
    </section>


  </div>
</template>


<script>
import RequestItem from '../../components/requests/RequestItem.vue'

export default {
  components: { 
    RequestItem
  },
  data(){
    return{
      isLoading:false,
      error:null
    }
  },
  computed:{
    receivedRequests(){
      return this.$store.getters['requests/requests']
    },
    hasRequests(){
      return this.$store.getters['requests/hasRequests']
    }
  },
  created(){
    this.loadRequests()
  },
  methods:{
    async loadRequests(){
      this.isLoading = true
      try{
        await this.$store.dispatch('requests/fetchRequests')
      }catch(error){
        this.error = error.message || 'Something Failed'
      }
      this.isLoading= false
    },
    handleError(){
      this.error = null
    }
  }
}
</script>


<style scoped>
  header {
    text-align: center;
  }

  ul {
    list-style: none;
    margin: 2rem auto;
    padding: 0;
    max-width: 30rem;
  }

  h3 {
    text-align: center;
  }
</style>