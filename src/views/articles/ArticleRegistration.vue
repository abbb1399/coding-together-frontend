<template>
  <section>
    <base-card>
      <h2>동료를 모아 보세요!</h2>
      <coach-form @save-data="saveData"></coach-form>
    </base-card>
  </section>
</template>

<script>    
import CoachForm from '../../components/articles/ArticleForm.vue'

export default {
  components:{
    CoachForm
  },
  methods:{
    async saveData(data){
      await this.$store.dispatch('coaches/registerCoach',data)
      this.$router.replace('/coaches')
    }
  }
}
</script>

<style scoped> 
 
</style>