<template>
  <section class="registration">
    <h2>공고 등록</h2>
    <article-form @save-data="saveData"/>
  </section>
</template>

<script>
import { inject } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import ArticleForm from "../../components/articles/ArticleForm.vue"
import useUnreadRequests from '../../hooks/use-unread-requests'

export default {
  components: {
    ArticleForm,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const $swal = inject("$swal")
    const { unreadRequestsCount } = useUnreadRequests()

    const saveData = async (data) => {
      await store.dispatch("articles/registerArticle", data)
      router.replace("/articles")
      $swal.fire({
        icon: "success",
        title: "글이 성공적으로 등록 되었습니다.",
        showConfirmButton: false,
        timer: 2000,
      })
    }

    // 안읽은 requests 갯수 불러오기
    unreadRequestsCount()

    return {
      saveData,
    }
  },
}
</script>

<style lang="scss" scoped>
.registration {
  max-width: 43.5rem;;
  margin: 0 auto;
  
  h2{
    text-align: center;
    margin-top: 1rem;
  }
}
</style>
