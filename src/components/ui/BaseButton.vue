<template>
  <router-link v-if="link" :to="to" :class="mode">
    <slot></slot>
  </router-link>
  <button v-else :class="mode">
    <slot></slot>
  </button>
  
</template>

<script>
export default {
  props:{
    mode:{
      type: String,
      required: false,
      default: null
    },
    link:{
      type: Boolean,
      required:false,
      default:false
    },
    to:{
      type: String,
      required:false,
      default:'/'
    }
  }
}
</script>

<style lang="scss" scoped>
  /* router-link는 a태그로 처리 됨 */
  button,
  a {
    display: inline-block;
    padding: 0.75rem 1.25rem;
    background-color: $primary-color;
    border: 1px solid $primary-color;
    cursor: pointer;
    border-radius: 30px;
    color: #fff;

    font-size: 0.75rem;
    font-weight: bold;


    &:hover,
    &:active{
      background-color: darken($primary-color, 3%);
    }

  }

  .secondary{
    background: $secondary-color;
    border: none;

    &:hover{
      background: darken($secondary-color, 3%);
    }
  }

  // .flat {
  //   background-color: transparent;
  //   color: $primary-color;
  //   border: none;
  // }

  // .outline {
  //   background-color: transparent;
  //   color: #000;
  //   border: 1px solid black;
  //   // border: 1px solid #000;
  // }

  // .flat:hover,
  // .flat:active,
  // .outline:hover,
  // .outline:active {
  //   background-color: $medium-color;
  //   border-color: lightgray;
  // }
</style>