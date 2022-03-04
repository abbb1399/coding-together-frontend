<template>
  <div>
    <base-dialog :show="!!error" title="에러 발생!" @close="handleError">
      <p>{{error}}</p>
    </base-dialog>
    
    <section class="requests">
      <header class="requests__header">
        <h2>받은 요청들</h2>
      </header>
      <base-spinner v-if="isLoading"></base-spinner>
      <ul class="requests__list" v-else-if="hasRequests && !isLoading">
        <request-item
          v-for="req in receivedRequests"
          :key="req._id"
          :email="req.email"
          :message="req.message"
          :name="req.owner.name"
          :img-src="req.owner.avatar"
        >
        </request-item>
      </ul>
      <h3 class="request__no-request" v-else>받은 요청이 없습니다.</h3>
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
      error:null,
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
      await this.$store.dispatch('requests/fetchRequests')
      console.log(this.$store.getters['requests/requests'])

      this.isLoading= false
    },
    handleError(){
      this.error = null
    }
  }
}
</script>


<style lang="scss" scoped>
  .requests{
    &__header{
      text-align: center;
    }

    &__list{
      list-style: none;
      margin: 2rem auto;
      padding: 0;
      max-width: 50rem;
    }
  }

  h3{
    text-align: center;
  }
</style>