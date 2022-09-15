<template>
  <section class="article">
    <img class="article__thumbnail" :src="articeImage" alt="썸내일" />
    <h1 class="article__title">{{ title }}</h1>
    <div class="article__meta">
      <small class="description">
        <font-awesome-icon icon="user" />&nbsp;
        <span>{{ owner.name }} - {{ updatedAt }}</span>
      </small>
      <base-badge
        class="bagde"
        v-for="area in areas"
        :key="area"
        :type="area"
        :title="area"
      />
    </div>

    <!-- TUI Viewer -->
    <div id="viewer" />

    <div class="article__btn-container">
      <base-button @click="sendRequest">같이 코딩하기</base-button>
    </div>
  </section>
</template>

<script>
import { ref, reactive, inject, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"

import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer"
import "@toast-ui/editor/dist/toastui-editor-viewer.css"

import useUnreadRequests from "../../hooks/use-unread-requests"

export default {
  props: {
    // router로 props(id) 넘김
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const store = useStore()
    const $moment = inject("$moment")
    const $swal = inject("$swal")
    const route = useRoute()
    const router = useRouter()

    const articleId = route.params.id
    const title = ref("")
    const areas = ref([])
    const updatedAt = ref("")
    const owner = reactive({ id: "", name: "" })
    const thumbnail = ref(null)
    const articleOwner = ref("")

    const { unreadRequestsCount } = useUnreadRequests()

    const articeImage = computed(() => {
      return `${process.env.VUE_APP_API_URL}/images/${thumbnail.value}`
    })

    const init = async () => {
      try {
        await store.dispatch("articles/loadArticleDetail", articleId)

        const article = store.getters["articles/article"]

        articleOwner.value = article.owner._id
        title.value = article.name
        areas.value = article.areas
        updatedAt.value = $moment(article.updatedAt).format("YYYY-MM-DD")
        owner.name = article.owner.name
        owner.id = article.owner._id
        thumbnail.value = article.thumbnail

        new Viewer({
          el: document.querySelector("#viewer"),
          initialValue: article.description,
        })

        // 안읽은 requests 갯수 불러오기
        unreadRequestsCount()
      } catch (error) {
        router.replace("/notfound")
        $swal.fire({
          icon: "error",
          title: error.message,
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }

    const sendRequest = async () => {
      if (!store.getters.isAuthenticated) {
        router.push("/auth")

        $swal.fire({
          icon: "info",
          title: `같이 코딩하기 위하여 로그인을 먼저하여 주세요.`,
          showConfirmButton: false,
          timer: 2000,
        })
        return
      }

      if (store.getters.myInfo.id === owner.id) {
        $swal.fire({
          icon: "info",
          title: `내가 작성한 공고 입니다.`,
          showConfirmButton: false,
          timer: 2000,
        })
        return
      }

      const result = await $swal.fire({
        title: "같이 코딩 하시겠습니까?",
        text: "해당 채팅방으로 이동합니다.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "네",
        cancelButtonText: "아니오",
      })

      if (result.isConfirmed) {
        const inRoom = store.getters.myInfo.inChatRoom.find((room) => room.articleId === articleId)

        if(!inRoom){
          // 채팅방 생성
          await store.dispatch("chat/createRoom", {
            roomName: title.value,
            avatar: thumbnail.value,
            users: [
              {
                _id: store.getters.myInfo.id,
                username: store.getters.myInfo.name,
              },
            ],
            articleOwner: articleOwner.value,
            
          })
          const newChatRoomId = store.getters['chat/getNewChatRoomId']

          // 내 아이디에 생성
          await store.dispatch("enterChatRoom", {articleId, chatRoomId: newChatRoomId } )
         
         // 상대방에게 인사 메세지
          await store.dispatch("chat/registerMessage", {
            content: `${owner.name}님 같이 코딩해요!`,
            senderId: store.getters.myInfo.id,
            username: store.getters.myInfo.name,
            roomId: newChatRoomId,
          })
          //상대방에게 요청도 생성
          await store.dispatch("requests/sendRequest", {
            userId: store.getters.myInfo.id,
            title: title.value,
            owner: owner.id,
            roomId: newChatRoomId,
          })
          router.push({ name: "chatRoom", params: { roomId: newChatRoomId }})
        }else{
          router.push({ name: "chatRoom", params: { roomId: inRoom.chatRoomId }})
        }
      }
    }

    init()

    return {
      title,
      areas,
      updatedAt,
      articeImage,
      owner,
      sendRequest,
    }
  },
}
</script>

<style lang="scss" scoped>
:deep(.toastui-editor-contents) {
  font: inherit;
}

.article {
  max-width: 43.5rem;
  margin: 1rem auto;

  @include respond(small-screen) {
    padding: 0 1rem;
  }

  &__title {
    font-size: 2rem;
    margin: 1rem 0 1rem 0;
  }

  &__thumbnail {
    height: 32rem;
    width: 100%;
    border-radius: 5px;

    @include respond(phone) {
      border-radius: 0;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    background: #eee;
    padding: 0.5rem;

    .description {
      margin-right: auto;
    }

    .badge {
      text-align: center;
      font-size: 12px;
      width: 4.8rem;

      @include respond(tab-land) {
        font-size: 10px;
        width: 5.5rem;
      }
    }
  }

  &__btn-container {
    display: flex;
    justify-content: center;
    margin: 1rem 0 2rem 0;

    & > *:first-child {
      font-size: 1.3rem;
      width: 13rem;
    }
  }

  #viewer {
    margin-top: 1.56rem;
    min-height: 10rem;
  }
}
</style>
