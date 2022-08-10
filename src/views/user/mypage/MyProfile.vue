<template>
  <section>
    <img
      @click="imageUpload"
      id="myImage"
      alt="내 이미지"
      :src="getMyInfo.avatar ? getImage(getMyInfo.avatar) : defaultImg"
    />
    <p><strong>이름 : </strong>{{ getMyInfo.name }}</p>
    <p><strong>이메일 : </strong>{{ getMyInfo.email }}</p>
    <p><strong>가입일 : </strong>{{ getMyInfo.createdAt}}</p>
  </section>
</template>

<script>
import { ref, computed } from "vue"
import { useStore } from "vuex"

export default {
  setup() {
    const store = useStore()
    const defaultImg = ref(require("../../../assets/avatar.jpg"))

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
      }
      upload.click()
    }

    const getImage = (avatar) =>{
      return `${process.env.VUE_APP_API_URL}/avatars/${avatar}`
    }

    // const deleteAccount = async ()=>{
    //   await this.$store.dispatch('deleteAccount')
    //   this.$router.push('/')
    // }

    return {
      defaultImg,
      getMyInfo,
      imageUpload,
      getImage
    }
  },
}
</script>

<style lang="scss" scoped>
  p {
    margin: 0.8rem 0;
  }

  #myImage {
    display: block;
    height: 150px;
    border-radius: 50%;
    margin: 0 auto;
    cursor: pointer;
    margin-bottom: 2rem;
  }
</style>
