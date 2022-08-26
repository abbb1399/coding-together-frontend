<template>
  <section class="dropDownMenuWrapper">
    <slot name="content">
      <img
        :src="avatar ? getImage(avatar) : defaultImg"
        style="border-radius:20px;"
        ref="menu"
        @click="openClose"
      />
    </slot>

    <section class="dropdownMenu" v-if="isOpen">
      <slot></slot>
    </section>
  </section>
</template>

<script>
import { ref,computed } from "vue"
import { useStore } from "vuex"

export default {
  setup() {
    const store = useStore()
    const isOpen = ref(false)
    const defaultImg = ref(require("../../assets/avatar.jpg"))
    const menu = ref()

    const avatar = computed(() => {
      return store.getters.myInfo.avatar
    })

    const openClose = () => {
      const closeListerner = (e) => {
        if (catchOutsideClick(e, menu.value)){
          window.removeEventListener("click", closeListerner)
          isOpen.value = false
        }
      }
      window.addEventListener("click", closeListerner)

      isOpen.value = !isOpen.value
    }

    const catchOutsideClick = (event, dropdown) => {
      // 메뉴를 클릭할시는 아무일도 안생기게
      if (dropdown === event.target) {
        return false
      }

      // 메뉴 바깥을 눌렀을때 메뉴가 닫히게
      if (isOpen.value && dropdown !== event.target) {
        return true
      }
    }

    const getImage =(avatar) =>{
      return `${process.env.VUE_APP_API_URL}/avatars/${avatar}`
    } 

    return {
      isOpen,
      defaultImg,
      menu,
      avatar,
      openClose,
      catchOutsideClick,
      getImage
    }
  }
}
</script>

<style lang="scss" scoped>
.dropDownMenuWrapper {
  // position: relative;
  // border-radius: 8px;
  // box-shadow: 10px 10px 0 0 rgba(black,.03);
  // -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  // * {
  //   box-sizing: border-box;
  //   text-align: left;
  // }

  img {
    width: 40px;
    height: 40px;
    cursor: pointer;

    @include respond(tab-port) {
      height: 25px;
      width: 25px;
    }
  }

  .dropdownMenu {
    position: fixed;
    // right: 50px;
    background: white;
    z-index: 999;
    outline: none;
    box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%),
      0 3px 1px -2px rgb(0 0 0 / 12%);
    border-radius: 4px;
    cursor: pointer;
    width: 180px;

    @include respond(tab-port) {
      width: 80px;
      font-size: 10px;
    }

    
    @include respond(phone){
      transform: translateX(-3.5rem);
    }
  }
}
</style>
