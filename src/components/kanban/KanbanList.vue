<template>
  <draggable
    class="list-item" :list="itemList.list" item-key="_id" group="list" 
    :animation="90" :forceFallback="true" :fallbackTolerance="3"
    ghostClass="ghost" chosenClass="chosen" dragClass="drag"
    @change="moveTask($event, itemList._id)" @start="dragStart" @end="dragEnd"
  >
    <template #header>
      <div class="list-item__header handle">
        <input
          class="header-input" :value="itemList.title" maxlength="15"         
          @blur="changeTitle($event, itemList)"
          @keydown.enter="$event.target.blur()"
          @mouseup="mouseUp($event)"
          @focusin="focusIn($event)"
        />
        <div class="header-control">
          <span>
            <font-awesome-icon icon="tag" />&nbsp;{{ itemList.list.length }}
          </span>
          <button class="kanban__btn" @click="deleteBoard(itemList._id)">
            <font-awesome-icon icon="trash"/>
          </button>
          <button class="kanban__btn" @click="toggleAddInput">
            <font-awesome-icon icon="plus" />
          </button>
        </div>
      </div>

      <div class="list-item__input" v-if="inputStatus">
        <base-spinner2 v-if="spinnerStatus"/>
        <div v-else>
          <p>제목</p>
          <input
            type="text"
            v-model="inputValue"
            @keydown.enter="addTask(itemList)"
          />
          <div class="btn__group">
            <button
              class="kanban__btn"
              @click="addTask(itemList)"
              :disabled="inputValue.length === 0"
            >
              생성
            </button>
            <button class="kanban__btn" @click="toggleAddInput">
              취소
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #item="{ element }" tag="div">
      <div
        class="list-item__card"
        :class="{'selected-task': element.id === selectedTaskId }"
        @click="clickTaskOpenSideBar(element, itemList._id)"
      >
        <p>{{ element.name }}</p> 
        <div v-if="element.dueDate">
          <font-awesome-icon icon="calendar"/>&nbsp;
          <span class="hovertext" data-hover="만료일">{{ element.dueDate }}</span> 
        </div>
      </div>
    </template>
  </draggable>
</template>

<script>
import draggable from "vuedraggable"
import { ref, inject} from "vue"
import { useStore } from "vuex"

export default {
  emits:['open-sidebar'],
  props: {
    itemList:{
      type: Object,
      required: true
    },
    selectedTaskId:{
      type: String
    }
  },
  components: {
    draggable,
  },
  setup(_, context) {
    const store = useStore()
    const $swal = inject("$swal")

    const spinnerStatus = ref(false)
    const inputValue = ref("")
    const inputStatus = ref(false)
  
    const moveTask = ({ added, removed, moved }, boardId) => {
      if (added) {
        store.dispatch("kanbans/moveTask", {
          status: "added",
          boardId: boardId,
          task: added.element,
          newIndex: added.newIndex,
        })
      } else if (removed) {
        store.dispatch("kanbans/moveTask", {
          status: "removed",
          boardId: boardId,
          task: removed.element,
        })
      } else if (moved) {
        store.dispatch("kanbans/changeTaskOrder", {
          ...moved,
          boardId: boardId,
        })
      }
    }

    const dragStart = () => {
      setDragCursor(true)
    }

    const dragEnd = () => {
      setDragCursor(false)
    }

    const setDragCursor = (value) => {
      const html = document.getElementsByTagName("html").item(0)
      html.classList.toggle("grabbing", value)
    }

    const toggleAddInput = () => {
      inputStatus.value = !inputStatus.value
      inputValue.value = ""
    }

    const addTask = (board) => {
      if (inputValue.value.length === 0) return
      spinnerStatus.value = true

      setTimeout(() => {
        const data = {
          id:
            "TA" +
            Date.now().toString(36) +
            Math.random()
              .toString(36)
              .substr(2),
          name: inputValue.value,
        }

        board.list.push(data)
        store.dispatch("kanbans/registerTask", {
          ...data,
          boardId: board._id,
        })

        // 초기화
        inputValue.value = ""
        spinnerStatus.value = false
      }, 500)
    }

    const changeTitle = (e, board) => {
      const inputValue = e.target.value.trim()

      if (inputValue === "") {
        e.target.value = board.title
        return
      }

      if (board.title === inputValue) {
        return
      }

      board.title = inputValue

      store.dispatch("kanbans/updateBoardName", {
        title: inputValue,
        boardId: board._id,
      })
    }

    const clickTaskOpenSideBar = (element, boardId) => {
      context.emit("open-sidebar", {element, boardId})
    }

    const mouseUp = (e) => {
      if(e.target.attributes.readonly){
        e.target.removeAttribute('readonly')
        e.target.select()
      }
    }
 
    const focusIn = (e) =>{
      if(!e.target.attributes.readonly){
        e.target.setAttribute('readonly', true) 
      }
    }

    const deleteBoard = async (boardId) =>{
      const result = await $swal.fire({
        title: "삭제 하시겠습니까?",
        text: "관련 업무들도 모두 삭제 됩니다.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "네",
        cancelButtonText: "아니오",
      })

      if (result.isConfirmed) {
        await store.dispatch("kanbans/deleteKanban", boardId)
        $swal.fire({
          icon: "success",
          title: `삭제에 성공 하였습니다.`,
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }

    return {
      spinnerStatus,
      inputValue,
      inputStatus,
      moveTask,
      dragStart,
      dragEnd,
      toggleAddInput,
      addTask,
      clickTaskOpenSideBar,
      changeTitle,
      mouseUp,
      focusIn,
      deleteBoard
    }
  },
}
</script>

<style lang="scss" scoped>
.grabbing * {
  cursor: move !important; /* fallback: no `url()` support or images disabled */
  cursor: -webkit-grabbing !important; /* Chrome 1-21, Safari 4+ */
  cursor: -moz-grabbing !important; /* Firefox 1.5-26 */
  cursor: grabbing !important; /* W3C standards syntax, should come least */
}

.ghost {
  opacity: 0.5;
}

.chosen {
  // color: #fff;
  /* background-color: #c8ebfb !important; */
}

.drag {
  transform: rotate(3deg);
  -moz-transform: rotate(3deg);
  -webkit-transform: rotate(3deg);
}

.kanban__btn {
  background: #fff;
  border-radius: 5px;
  border: 1px solid gray;
  font-size: 10px;
  padding: 5px;
  cursor: pointer;

  &:hover,
  &:active {
    background: darken(#fff, 5%);
  }
}

.list-item {
  width: 18rem;
  background: #ebecf0;
  padding: .625rem;

  height: calc(100vh - 6rem);
  overflow-y: auto;
  overflow-x: hidden;

  &__header {
    display: flex;
    margin-bottom: 12px;
    cursor: pointer;

    .header-input {
      word-break: break-all;
      border: 2px solid transparent;
      padding: 4px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 5px;
      background-color: transparent;
      cursor: pointer;
      margin-right: auto;
      width: 70%;

      &:focus {
        outline: none !important;
        border: 2px solid #0079bf;
        background-color: #fff;
        height: 100%;
      }

      &:read-only{
        background-color: inherit;
        border: 2px solid #ebecf0;
      }
    }

    .header-control {
      display: flex;
      align-items: center;
      gap:3px;
      /* flex: 0 0 50%; */

      span {
        font-size: .8rem;
        width: 1.5rem;

      }

      button{
        font-size: .8rem;
      }
    }
  }

  &__input {
    @include card;

    .btn__group {
      display: flex;
      justify-content: space-between;
    }

    p {
      font-weight: 600;
      margin-bottom: .4rem;
      font-size: .875rem;
    }

    input {
      width: 100%;
      padding: .3rem;
      border-radius: 5px;
      margin-bottom: .5rem;
      border: 1px solid;

      @include respond(phone) {
        font-size: 10px;
      }
    }

    button {
      padding: .3rem .7rem;
      font-weight: 600;

      @include respond(big-screen) {
        padding: .35rem .9rem;
      }

      @include respond(phone) {
        padding: .23rem .6rem;
        font-weight: 500;
      }
    }
  }

  &__card {
    @include card;
    cursor: grab;
 
    div{
      margin-top: 7px;
      font-size: .9rem;
      color: #dd2b02;
    }
  }

  .selected-task {
    background: #e9f3fc !important;
  }

  .hovertext {
    position: relative;

    &:before {
      content: attr(data-hover);
      visibility: hidden;
      opacity: 0;
      width: 3.875rem;
      background-color: black;
      color: #fff;
      text-align: center;
      border-radius: 5px;
      padding: 5px 0;
      transition: opacity 1s ease-in-out;

      position: absolute;
      z-index: 1;
      left: 0;
      top: 110%;
    }

    &:hover:before {
      opacity: 1;
      visibility: visible;
    }
  }
}

/* .kanban__spinner-box {
  width: 100%;
  display: flex;
  justify-content: center;
} */
</style>
