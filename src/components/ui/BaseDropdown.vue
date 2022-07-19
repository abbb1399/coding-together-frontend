<template>
  <section class="dropDownMenuWrapper">
    <slot name="content">
      <img
        :src="imgSrc"
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
import { ref } from "vue"
import { useStore } from "vuex"

export default {
  setup() {
    const store = useStore()

    const isOpen = ref(false)
    const imgSrc = ref(require("../../assets/avatar.jpg"))
    const menu = ref()

    const openClose = () => {
      const closeListerner = (e) => {
        if (catchOutsideClick(e, menu.value))
          window.removeEventListener("click", closeListerner),
            (isOpen.value = false)
      }

      window.addEventListener("click", closeListerner)

      isOpen.value = !isOpen.value
    }

    const catchOutsideClick = (event, dropdown) => {
      // 메뉴를 클릭할시는 아무일도 안생기게
      if (dropdown === event.target) return false

      // 메뉴 바깥을 눌렀을때 메뉴가 닫히게
      if (isOpen.value && dropdown !== event.target) return true
    }

    if (store.getters.myInfo.avatar) {
      imgSrc.value = `http://localhost:3000/avatars/${store.getters.myInfo.avatar}`
    }

    return {
      isOpen,
      imgSrc,
      menu,
      openClose,
      catchOutsideClick,
    }
  },

  // data(){
  //   return{
  //     isOpen: false,
  //     imgSrc:require("../../assets/avatar.jpg")
  //   }
  // },
  // created(){
  //   if(this.$store.getters.myInfo.avatar){
  //     this.imgSrc = `http://localhost:3000/avatars/${this.$store.getters.myInfo.avatar}`
  //   }
  // },
  // methods:{
  //   openClose(){
  //     const closeListerner = (e) => {
  //       if ( this.catchOutsideClick(e, this.$refs.menu ))
  //       window.removeEventListener('click', closeListerner) , this.isOpen = false
  //     }

  //     window.addEventListener('click', closeListerner)

  //     this.isOpen = !this.isOpen
  //   },
  //   catchOutsideClick(event, dropdown)  {
  //     // 메뉴를 클릭할시는 아무일도 안생기게
  //     if( dropdown === event.target )
  //       return false

  //     // 메뉴 바깥을 눌렀을때 메뉴가 닫히게
  //     if( this.isOpen && dropdown !== event.target )
  //       return true
  //   }
  // },
}
</script>

<style lang="scss" scoped>
.dropDownMenuWrapper {
  cursor: pointer;
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
      width: 70px;
      font-size: 10px;
    }

    
    @include respond(phone){
      transform: translateX(-3.5rem);
    }
  }
}
</style>
