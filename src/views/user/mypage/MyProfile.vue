<template>
  <section>
    <div class="avatar" @click="imageUpload" ref="avatar">
      <img
        class="avatar__image"
        :src="getMyInfo.avatar ? getImage(getMyInfo.avatar) : defaultImg"
        alt="내 아바타"
      />
      <div class="avatar__overlay">
        <span><font-awesome-icon icon="camera" class="avatar__overlay-icon"/></span>
        <span class="avatar__overlay-text">아바타 변경</span>
      </div>
    </div>

    <div>
      <p><strong>이름 : </strong>{{ getMyInfo.name }}</p>
      <p><strong>이메일 : </strong>{{ getMyInfo.email }}</p>
      <p><strong>가입일 : </strong>{{ getMyInfo.createdAt }}</p>
    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue"
import { useStore } from "vuex"

export default {
  setup() {
    const store = useStore()
    const defaultImg = ref(require("../../../assets/avatar.jpg"))
    const avatar = ref(null)

    const getMyInfo = computed(() => {
      return store.getters.myInfo
    })

    const imageUpload = () => {
      const upload = document.createElement("input")
      upload.type = "file"
      upload.accept = "image/png, image/jpeg"

      upload.onchange = async (e) => {
        if (!upload.files) return

        const data = new FormData()
        const files = e.target.files
        const fileToUpload = files[0]
        data.append("avatar", fileToUpload)

        // 서버 로직
        await store.dispatch("uploadAvatar", data)
        avatar.value.blur()
      }
      upload.click()     
    }

    const getImage = (avatar) => {
      return `${process.env.VUE_APP_API_URL}/avatars/${avatar}`
    }

    return {
      avatar,
      defaultImg,
      getMyInfo,
      imageUpload,
      getImage
    }
  },
}
</script>

<style lang="scss" scoped>
p:not(:last-child) {
  margin: 0.8rem 0;
}

.avatar {
  position: relative;
  width: 30%;
  margin: 0 auto;
  margin-bottom: 2rem;

  &__image {
    width: 100%;
    transition: 0.5s ease;
    border-radius: 50%;
    cursor: pointer;
  }

  &__overlay {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    cursor: pointer;

    &-text {
      color: rgb(250, 250, 250);
      font-size: 15px;
      font-weight: 600;
    }

    &-icon {
      color: rgb(250, 250, 250);
      margin-right: 5px;
    }
  }

  &:hover &__image {
    opacity: 0.6;
  }

  &:hover &__overlay {
    opacity: 1;
  }
}
</style>
