<template>
  <section>
    <div class="chat">
      <h2 class="chat__caption">채팅 목록</h2>
      <div v-if="roomList.length">
        <li
          class="chat__list"
          @click="enterChatRoom(room)"
          v-for="room in roomList"
          :key="room.roomId"
        >
          <img
            class="chat__img"
            alt="유저 프로필"
            :src="getImage(room.avatar)"
          />
          <div class="chat__group">
            <div class="content__group--1">
              <h2>{{ room.roomName }}</h2>
              <p class="writer">
                작성자: {{ room.articleOwner.name }}({{
                  room.articleOwner.email
                }})
              </p>
              <p class="createdat">{{ room.updatedAt }}</p>
            </div>
            <div class="content__group--2">
              <p
                class="content__name"
                v-for="user in room.users"
                :key="user._id"
              >
                {{ user.username }}
              </p>
              <span>님의 채팅방</span>
              <p v-if="room.users.length < 2" class="content__waiting">
                &nbsp; - 상대방이 들어오길 기다리고 있습니다.
              </p>
            </div>
          </div>
        </li>
      </div>
      <h3 v-else>채팅 방 목록이 없습니다.</h3>
    </div>
    <pagination
      v-if="roomList.length"
      class="pagination"
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
  margin: 0 auto;

  h3 {
    margin-top: 1.5rem;
    text-align: center;
  }

  &__caption {
    text-align: center;
    margin-top: 1rem;
  }

  &__list {
    display: flex;
    border-bottom: 1px solid $color-grey-light;
    border-radius: 5px;
    padding: 0.8rem;
    cursor: pointer;
  }

  &__img {
    width: 85px;
    height: 85px;
    border-radius: 5px;
  }

  &__group {
    margin-left: 0.9rem;
    width: 100%;

    .content__group--1 {
      display: flex;
      align-items: center;
      margin-bottom: 0.6rem;

      @include respond(phone) {
        flex-direction: column;
        align-items: flex-start;
      }

      .writer {
        font-size: 0.9rem;
        font-weight: 600;
        color: $color-grey-dark-2;
        margin-left: 10px;
        margin-right: auto;

        @include respond(phone) {
          margin-top: 4px;
          margin-left: 0;
        }
      }
    }

    .content__group--2 {
      display: inline-flex;
      margin-bottom: 5px;

      .content__name {
        font-weight: 600;

        &:not(:first-child) {
          margin-left: 0.3rem;
        }
      }

      .content__waiting {
        color: $secondary-color;
      }

      .content__email {
        color: $primary-color;
        font-weight: bold;
        margin-left: 0.4rem;
      }

      span {
        margin-left: 5px;
      }
    }
  }
}

.pagination{
  margin-top: 2rem;
}
</style>
