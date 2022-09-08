<template>
  <section class="chat">
    <div>
      <h2 class="chat__caption">채팅 목록</h2>
      <div v-if="roomList.length">
        <li
          class="chat__list"
          @click="enterChatRoom(room)"
          v-for="room in roomList"
          :key="room.roomId"
        >
          <img class="chat__img" alt="유저 프로필" :src="getImage(room.avatar)" />
          <div class="chat__group">
            <div class="content">
              <h3>{{ room.roomName }}</h3>
              <p class="writer">작성자: {{ room.articleOwner.name }}</p>
              <p>{{ room.createdAt }}</p>
            </div>
            <div class="message">
              <p class="sender" >
                {{ 
                  $store.getters.myInfo.id === room.articleOwner._id ?
                  room.users[0].username :
                  room.articleOwner.name
                }}
              </p>
              <p class="latest-message">{{room.latestMsg}}</p>
            </div>
          </div>
        </li>
      </div>
      
      <h3 v-else class="chat__no-list">채팅 방 목록이 없습니다.</h3>
    </div>

    <pagination
      class="chat__pagination"
      v-if="roomList.length"
      :total-pages="totalPages"
      :total="total"
      :per-page="perPage"
      :current-page="currentPage"
      @pagechanged="onPageChange"
    />
  </section>
</template>

<script>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import Pagination from "../../components/ui/Pagination.vue"
import useUnreadRequests from '../../hooks/use-unread-requests'

export default {
  components: { Pagination },
  setup() {
    const store = useStore()
    const router = useRouter()
  
    const noImg = ref(require("../../assets/avatar.jpg"))
    const currentPage = ref(1)
    const perPage = ref(5)

    const { unreadRequestsCount } = useUnreadRequests()

    const roomList = computed(() => {
      return store.getters["chat/roomList"]
    })

    const total = computed(() => {
      return store.getters["chat/getTotalChatRoom"]
    })

    const totalPages = computed(() => {
      return Math.ceil(store.getters["chat/getTotalChatRoom"] / perPage.value)
    })

    const enterChatRoom = (roomInfo) => {
      router.push({ name: "chatRoom", params: { roomId: roomInfo.roomId } })
    }

    const onPageChange = (page) => {
      store.dispatch("chat/fetchChatRoomList", page)
      currentPage.value = page
    }

    const getImage = (roomAvatar) =>{
      return `${process.env.VUE_APP_API_URL}/images/${roomAvatar}`
    }

    // 나의 채팅방 정보 불러오기
    store.dispatch("chat/fetchChatRoomList", currentPage.value)

    // 안읽은 requests 갯수 불러오기
    unreadRequestsCount()
  
    return {
      currentPage,
      perPage,
      noImg,
      total,
      totalPages,
      roomList,
      enterChatRoom,
      onPageChange,
      getImage
    }
  },
}
</script>

<style lang="scss" scoped>
.chat {
  max-width: 62.5rem;
  margin: 2rem auto;

  &__caption {
    text-align: center;
  }

  &__list {
    display: flex;
    border-bottom: 1px solid $color-grey-light;
    border-radius: 5px;
    padding: 0.8rem;
    cursor: pointer;
  }

  &__img {
    width: 5.5rem;
    border-radius: 5px;
  }

  &__group {
    margin-left: 0.9rem;
    width: 100%;

    .content {
      display: flex;
      align-items: center;
      margin-bottom: 0.6rem;
      
      h3{
        white-space:nowrap; 
        overflow:hidden;
        text-overflow:ellipsis;
      }
     
      .writer {
        font-size: 0.9rem;
        font-weight: 600;
        color: $color-grey-dark-2;
        margin-left: 10px;
        margin-right: auto;
      }
    }

    .message{
      line-height: 1.7;

      .sender{
        font-weight: 600;
      }

      .latest-message{
        color:$color-grey-dark-2;
      }
    }
  }

  &__pagination{
    margin-top: 2rem;
  }

  &__no-list{
    text-align:center; 
    margin-top: 1.5rem;
  }
}
</style>
