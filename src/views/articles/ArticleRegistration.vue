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
      await this.$store.dispatch('articles/registerArticle',data)
      this.$router.replace('/articles')
    }
  }
}
</script>

<style scoped> 
 
</style>