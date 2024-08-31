<template>
  <section>
    <div class="detail" v-if="!editMode">
      <header class="detail__header">
        <h2>{{ articleTitle }}</h2>
        <div class="description">
          <div class="group-1">
            <p class="date">작성일 : {{ createdAt }}</p>
            <base-badge
              v-for="area in areas"
              :key="area"
              :type="area"
              :title="area"
            />
          </div>
          <div class="group-2">
            <base-button mode="secondary" @click="editArticle"
              >수정</base-button
            >
            <base-button mode="primary" @click="deleteArticle"
              >삭제</base-button
            >
          </div>
        </div>
      </header>

      <img class="detail__image" :src="imgSrc" alt="글 이미지" />
      <div id="viewer" />
    </div>

    <div class="edit" v-else>
      <header class="edit__header">
        <h2>공고 수정</h2>
      </header>
      <article-form class="edit__form" />
    </div>
  </section>
</template>

<script>
import { ref, inject, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import ArticleForm from "../../../components/articles/ArticleForm.vue";

import useUnreadRequests from "../../../hooks/use-unread-requests";

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
    const $moment = inject("$moment");
    const $swal = inject("$swal");
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const { id } = toRefs(props);
    const articleTitle = ref("");
    const createdAt = ref("");
    const description = ref("");
    const areas = ref([]);
    const imgSrc = ref(null);
    const editMode = ref(false);

    const { unreadRequestsCount } = useUnreadRequests();

    const init = async () => {
      await store.dispatch("articles/fetchMyArticleDetail", route.params.id);
      const myList = store.getters["articles/getMyListDetail"];

      articleTitle.value = myList.name;
      createdAt.value = $moment(myList.createdAt).format("YYYY-MM-DD");
      // this.description = myList.description
      areas.value = myList.areas;
      imgSrc.value = `${process.env.VUE_APP_API_URL}/images/${myList.thumbnail}`;

      new Viewer({
        el: document.querySelector("#viewer"),
        initialValue: myList.description,
      });

      // 안읽은 requests 갯수 불러오기
      unreadRequestsCount();
    };

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
      });

      if (result.isConfirmed) {
        await store.dispatch("articles/deleteMyArticle", id.value);
        router.replace({ name: "myList" });
        $swal.fire({
          icon: "success",
          title: `글 삭제에 성공 하였습니다.`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    };

    const editArticle = () => {
      editMode.value = true;
      // vuex로 article form에 데이터 전달
    };

    init();

    return {
      articleTitle,
      createdAt,
      description,
      areas,
      imgSrc,
      editMode,
      deleteArticle,
      editArticle,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.toastui-editor-contents) {
  font: inherit;
}

.detail {
  &__header {
    .description {
      display: flex;
      justify-content: space-between;
      align-items: center;

      color: #555;
      margin: 0.5rem 0;
      font-size: 1em;
      font-style: italic;
      border-top: 1px solid rgba(144, 144, 144, 0.25);
      border-bottom: 1px solid rgba(144, 144, 144, 0.25);
      padding: 5px 0;

      .group-1 {
        display: flex;
        align-items: center;

        .date {
          margin-right: 0.5rem;
        }
      }

      .group-2 {
        button {
          padding: 0.28rem 0.8rem;
          border-radius: 5px;

          &:first-child {
            margin-right: 3px;
          }
        }
      }
    }
  }

  &__image {
    width: 100%;
    margin-bottom: 1rem;
  }
}

.edit {
  &__header {
    text-align: center;
  }
}
</style>
