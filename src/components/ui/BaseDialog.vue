<template>
  <teleport to="body">
    <div v-if="show" @click="tryClose" class="backdrop"></div>
    <transition name="dialog">
      <dialog open v-if="show" class="base-dialog">
        <header class="base-dialog__header">
          <slot name="header">
            <h2>{{title}}</h2>
          </slot>
        </header>

        <section class="base-dialog__section">
          <slot></slot>
        </section>
        
        <menu v-if="!fixed" class="base-dialog__menu">
          <base-button @click="tryClose">닫기</base-button>
          <slot name="actions"></slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>

<script>
import { toRefs } from 'vue'

export default {
  props:{
    show:{
      type:Boolean,
      required: true
    },
    title:{
      type:String,
      required: false
    },
    fixed:{
      type:Boolean,
      required:false,
      default:false
    }
  },
  emits:['close'],
  setup(props, context){
    const {fixed} = toRefs(props)

    const tryClose = () => {
      if(fixed.value){
        return
      }
      context.emit('close')
    }
    return{
      tryClose
    }
  }
}
</script>

<style lang="scss" scoped>
  .backdrop{
    position: fixed;
    top:0;
    left:0;
    height: 100vh;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }

  .base-dialog{
    position: fixed;
    top: 15vh;
    left: 10%;
    width: 80%;
    z-index: 100;
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 0;
    margin: 0;
    overflow: hidden;
    background-color: white;


    &__header{
      background-color: $primary-color;
      color: white;
      width: 100%;
      padding: 1rem;

       h2{
        margin: 0;
      }
    }

    &__section{
      padding: 1rem;
    }

    &__menu{
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
      margin: 0;
    }
  }

  .dialog-enter-from,
  .dialog-leave-to{
    opacity: 0;
    transform: scale(0.8);
  }

  .dialog-enter-active{
    transition: all 0.3s ease-out;
  }

  .dialog-leave-active{
    transition: all 0.3s ease-in;
  }

  .dialog-enter-to,
  .dialog-leave-from{
    opacity: 1;
    transform: scale(1);
  }

  @media(min-width: 768px){
    .base-dialog{
      left: calc(50% - 20rem);
      width: 40rem;
    }
  }
</style>