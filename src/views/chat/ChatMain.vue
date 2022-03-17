<template>
  <section>
    <div class="chat">
      <h2 class="chat__caption">채팅 목록</h2>
      <div v-if="roomList.length">
        <li class="chat__list" @click="enterChatRoom(room)" v-for="room in roomList" :key="room.roomId">
          <img class="chat__img" alt="유저 프로필" :src="room.avatar ? room.avatar : noImg"/>
          <div class="chat__group">
            <h2>{{ room.roomName }}</h2>
            <div class="content__group">
              <p class="content__name" v-for="user in room.users" :key="user._id">
                {{ user.username }}
              </p>
              <span>님의 채팅방</span>
            </div>
          </div>
        </li>
      </div>
      <h3 v-else>채팅 방 목록이 없습니다.</h3>
    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const noImg = ref(require("../../assets/avatar.jpg"))
      
    store.dispatch("chat/fetchChatRoomList")

    const roomList = computed(() => {
      return store.getters["chat/roomList"]
    })
    
    const enterChatRoom = (roomInfo) => {
      router.push({ name: "chatRoom", params: { roomId: roomInfo.roomId } })
    }
    
    return {
      noImg,
      roomList,
      enterChatRoom,
    }
  },
}
</script>

<style lang="scss" scoped>
.chat {
  max-width: 1000px;
  margin: 0 auto;

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

    .content__group {
      display: inline-flex;
      margin-bottom: 5px;

      .content__name {
        font-weight: 600;

        &:not(:first-child) {
          margin-left: 0.3rem;
        }
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
</style>