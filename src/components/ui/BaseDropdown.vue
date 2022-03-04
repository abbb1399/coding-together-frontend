<template>
  <section class="dropDownMenuWrapper" > 
    <slot name="content">
      <img :src="imgSrc" height="40" width="40" style="border-radius:20px;"  ref="menu" @click="openClose"/>
    </slot>

    <section class="dropdownMenu" v-if="isOpen" >
      <slot></slot>
    </section>

  </section>
</template>

<script>
export default {
  data(){
    return{
      isOpen: false,
      imgSrc:require("../../assets/avatar.jpg")
    }
  },
  created(){
    setTimeout(() => {
      if(this.$store.getters.getMyInfo.avatar){
        this.imgSrc = `http://localhost:3000/avatars/${this.$store.getters.getMyInfo.avatar}`  
      }
    }, 100);
  },
  methods:{
    openClose(){
      const closeListerner = (e) => {
        if ( this.catchOutsideClick(e, this.$refs.menu ))
        window.removeEventListener('click', closeListerner) , this.isOpen = false
      }

      window.addEventListener('click', closeListerner)

      this.isOpen = !this.isOpen
    },
    catchOutsideClick(event, dropdown)  {
      // 메뉴를 클릭할시는 아무일도 안생기게
      if( dropdown === event.target )
        return false

      // 메뉴 바깥을 눌렀을때 메뉴가 닫히게
      if( this.isOpen && dropdown !== event.target )
        return true
    }
  },
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

    .dropdownMenu {
      position: fixed;
      // right: 50px;
      background: white;
      z-index: 999;
      outline: none;
      box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
      border-radius: 4px;
      cursor: pointer;
      width: 180px;
    }
}
</style>