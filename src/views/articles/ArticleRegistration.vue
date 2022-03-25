<template>
  <section>
    <base-card>
      <h2>동료를 모아 보세요!</h2>
      <article-form @save-data="saveData"></article-form>
    </base-card>
  </section>
</template>

<script>    
import {inject} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import ArticleForm from '../../components/articles/ArticleForm.vue'

export default {
  components:{
    ArticleForm
  },
  setup(){
    const store = useStore()
    const router = useRouter()
    const $swal = inject('$swal')

    const saveData = async (data) =>{
      await store.dispatch('articles/registerArticle',data)
      router.replace('/articles')
      $swal.fire({
        icon: "success",
        title: '글이 성공적으로 등록 되었습니다.',
        showConfirmButton: false,
        timer: 2000,
      })
    }

    return{
      saveData
    }
  }
}
</script>