<template>
  <section class="detail" v-if="!editMode">
    <header class="detail-header">
      <div class="detail-header__title">
        <h2>{{ articleTitle }}</h2>
        <span>
          <base-button mode="secondary" @click="editArticle">수정</base-button>
          <base-button mode="primary" @click="deleteArticle">삭제</base-button>
        </span>
      </div>
      
      <div class="detail-header__description">
        <p class="date">작성일 : {{ createdAt }}</p>
        <base-badge
          class="badge"
          v-for="area in areas"
          :key="area"
          :type="area"
          :title="area"
        />
      </div>
    </header>

    <img class="detail-image" :src="imgSrc" alt="글 이미지" />
    <div id="viewer" />
  </section>

  <section v-else>
    <h2>공고 수정</h2>
    <article-form id="article-form"></article-form>
  </section>
</template>

<script>
import { ref, inject, toRefs } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { useRoute } from "vue-router"

import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer"
import "@toast-ui/editor/dist/toastui-editor-viewer.css"
import ArticleForm from "../../../components/articles/ArticleForm.vue"
import {address} from '../../../../config/address'


export default {
  components: {
    ArticleForm,
  },
  props: {
    // router로 props(id) 넘김
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const $moment = inject("$moment")
    const $swal = inject("$swal")
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const {id} = toRefs(props)
    const articleTitle = ref("")
    const createdAt = ref("")
    const description = ref("")
    const areas = ref([])
    const imgSrc = ref(null)
    const editMode = ref(false)

    const init = async () => {
      await store.dispatch("articles/fetchMyArticleDetail", route.params.id)
      const myList = store.getters["articles/getMyListDetail"]

      articleTitle.value = myList.name
      createdAt.value = $moment(myList.createdAt).format("YYYY-MM-DD")
      // this.description = myList.description
      areas.value = myList.areas
      imgSrc.value = `${address}/images/${myList.thumbnail}`

      new Viewer({
        el: document.querySelector("#viewer"),
        initialValue: myList.description,
      })
    }

    const deleteArticle = async () => {
      const result = await $swal.fire({
        title: "삭제 하시겠습니까??",
        text: "해당 글을 삭제합니다.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "네",
        cancelButtonText: "아니오",
      })

      if (result.value) {
        await store.dispatch("articles/deleteMyArticle", id.value)
        router.replace({ name: "myList" })
        $swal.fire({
          icon: "success",
          title: `글 삭제에 성공 하였습니다.`,
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }

    const editArticle = () => {
      editMode.value = true
      // vuex로 article form에 데이터 전달
    }

    init()

    return {
      articleTitle,
      createdAt,
      description,
      areas,
      imgSrc,
      editMode,
      deleteArticle,
      editArticle,
    }
  },

}
</script>

<style lang="scss" scoped>
:deep(.toastui-editor-contents) {
  font: inherit;
}

.detail-header {
  &__description{
    display: flex;
    align-items: center;
    color: #555;
    margin: 0 1rem 1em 0;
    font-size: 1em;
    font-style: italic;
    border-top: 1px solid rgba(144, 144, 144, 0.25);
    border-bottom: 1px solid rgba(144, 144, 144, 0.25);
    padding: 5px 0;

    .date{
      margin-right: 1rem;
    }
  }

  &__title {
    display: flex;
    justify-content: space-between;
  }

  &__badge {
    margin-left: 0.3rem;
    height: 10px;
  }

  h2 {
    margin-bottom: 1rem;
    color: #555;
  }
}

.detail-image {
  width: 100%;
  margin-bottom: 1rem;
}

#article-form {
  width: 45vw;
}
</style>
