<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
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
    text-decoration: none;
    padding: 1.2rem 2.4rem;
    font: inherit;
    background-color: $secondary-color;
    border: 1px solid $secondary-color;
    color: white;
    cursor: pointer;
    border-radius: 30px;
    margin-right: .8rem;
    display: inline-block;
  }

  a:hover,
  a:active,
  button:hover,
  button:active {
    background-color: #270041;
    border-color: #270041;
  }

  .flat {
    background-color: transparent;
    color: $secondary-color;
    border: none;
  }

  .outline {
    background-color: transparent;
    border-color: #270041;
    color: #270041;
  }

  .flat:hover,
  .flat:active,
  .outline:hover,
  .outline:active {
    background-color: #edd2ff;
  }
</style>