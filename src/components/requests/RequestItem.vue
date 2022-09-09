<template>
  <li class="request" :class="{ read: isRead }" @click="enterChatRoom">
    <img class="request__img" alt="유저 프로필" :src="img" />
    <div class="request__group">
      <div class="request__content--1">
        <h3>{{ title }}</h3>
        <p>{{ momentCreatedAt }}</p>
      </div>
      <div class="request__content--2">
        <p class="request__content--2-name">{{ fromName }}</p>
        <p class="request__content--2-email">{{ fromEmail }}</p>
        <p>&nbsp; 님이 요청을 보냄</p>
      </div>
      <p class="request__is-read">{{ isRead ? "읽음" : "읽지 않음" }}</p>
    </div>
  </li>
</template>

<script>
import { toRefs, computed, inject } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

export default {
  props: {
    roomId: {
      type: String,
    },
    requestId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    fromName: {
      type: String,
      required: true,
    },
    fromEmail: {
      type: String,
      required: true,
    },
    fromImgSrc: {
      type: String,
    },
    createdAt: {
      type: String,
    },
    isRead: {
      type: Boolean,
    },
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const { fromImgSrc, roomId, createdAt, requestId } = toRefs(props)
    const $moment = inject("$moment")

    const img = computed(() => {
      if (fromImgSrc.value) {
        return `${process.env.VUE_APP_API_URL}/avatars/${fromImgSrc.value}`
      } else {
        return require("../../assets/avatar.jpg")
      }
    })

    const momentCreatedAt = computed(() => {
      return $moment(createdAt.value).format("YYYY-MM-DD")
    })

    const enterChatRoom = async () => {
      // 채팅룸 입장
      await store.dispatch("chat/enterRoom", roomId.value)
      // 요청 읽음 표시
      if (requestId.value) {
        await store.dispatch("requests/haveRequestRead", requestId.value)
      }

      router.push({ name: "chatRoom", params: { roomId: roomId.value } })
    }

    return {
      img,
      momentCreatedAt,
      enterChatRoom,
    }
  },
}
</script>

<style lang="scss" scoped>
.request {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  border-bottom: 1px solid $color-grey-light;
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;

  &__img {
    width: 4.75rem;
    height: 5rem;
    border-radius: 5px;
  }

  &__group {
    margin-left: 0.9rem;
    width: 100%;
    line-height: 1.6;
  }

  &__content--1 {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3{
      flex:.9;
      white-space:nowrap; 
      overflow:hidden;
      text-overflow:ellipsis; 
    }
  }

  &__content--2 {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
   
    &-name {
      font-weight: 600;
    }

    &-email {
      color: $primary-color;
      font-weight: bold;
      margin-left: 0.4rem;
    }
  }

  &__is-read {
    font-size: 0.9rem;
  }
}

.read {
  color: rgb(177, 174, 174);
}
</style>
