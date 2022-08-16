<template>
  <div class="add-btn">
    <transition name="add-btn" mode="out-in">
      <button
        v-if="addBtnStatus"
        class="add-btn__button"
        @click="openInputContainer"
        data-action="add-btn"
      >
        + 리스트 추가
      </button>
      <div class="add-btn__input-container" v-else v-click-outside="clickOutside">
        <input
          type="text"
          v-focus
          v-model="inputValue"
          @keydown.enter="submitNewBoard"
        />
        <span>
          <button @click="submitNewBoard">추가</button>
          <font-awesome-icon class="x-icon" icon="x" @click="openInputContainer" />
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref,inject } from "vue"
import { useStore } from "vuex"

export default {
  setup() {
    const store = useStore()
    const $swal = inject("$swal")

    const addBtnStatus = ref(true)
    const inputValue = ref("")

    const openInputContainer = () => {
      addBtnStatus.value = !addBtnStatus.value

      // 인풋값 초기화
      inputValue.value = ""
    }

     const clickOutside = () => {
      addBtnStatus.value = true
    }

    const submitNewBoard = () => {
      const kanbanCount = store.getters["kanbans/kanbans"].length

      if(kanbanCount> 11){
        $swal.fire({
          icon: "info",
          title: '최대 10개까지만 생성 가능합니다.',
          showConfirmButton: false,
          timer: 2000,
        })
        return 
      }

      const inputTitle = inputValue.value.trim()

      if (inputTitle.length === 0) {
        return
      }

      store.dispatch("kanbans/registerKanban", { title: inputTitle, order: kanbanCount})
      inputValue.value = ''
      addBtnStatus.value = true
    }

    return {
      addBtnStatus,
      inputValue,
      openInputContainer,
      clickOutside,
      submitNewBoard
    }
  },
}
</script>

<style lang="scss" scoped>
.add-btn {
  background-color: #ebecf0;
  border-radius: 5px;
  height: 2.5rem;
  min-width: 18rem;
  
  &__button {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: darken(#ebecf0, 3%);
    }
  }

  &__input-container {
    width: inherit;
    height: 4.5rem;
    background: #ebecf0;
    padding: 5px;

    input {
      width: 100%;
      height: 1.8rem;
      padding: 3px;
      border-radius: 5px;
      outline: none !important;
      border: 2px solid #0079bf;
    }

    button {
      display: inline-block;
      background-color: $primary-color;
      padding: 5px;
      border: none;
      border-radius: 5px;
      color: #fff;
      cursor: pointer;

      width: 3.75rem;
      height: 1.875rem;
    }

    span {
      display: flex;
      align-items: center;
      margin-top: 5px;

      .x-icon {
        cursor: pointer;
        margin-left: 0.8rem;
        height: 1.3rem;
      }
    }
  }
}

// Vue Transition css
.add-btn-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.add-btn-leave-active {
  transition: all 0.3s ease-in;
}
</style>
