<template>
  <section>
    <base-card>
      <h2>동료를 모아 보세요!</h2>
      <article-form @save-data="saveData"></article-form>
    </base-card>
  </section>
</template>

<script>    
import ArticleForm from '../../components/articles/ArticleForm.vue'

export default {
  components:{
    ArticleForm
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