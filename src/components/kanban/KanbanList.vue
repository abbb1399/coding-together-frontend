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
          <p><font-awesome-icon icon="tag" />&nbsp;{{ itemList.list.length }}</p>
          <button class="kanban__btn" @click="openAddInput(itemList, index)">
            <font-awesome-icon icon="plus" />
          </button>
          <!-- <button class="kanban__btn" >
            <font-awesome-icon icon="plus" />
          </button> -->
        </div>
      </div>

      <div class="list-item__input" v-if="inputStatus && currIndex === index">
        <base-spinner2 v-if="spinnerStatus" />
        <div v-else>
          <p>제목</p>
          <input
            type="text"
            v-model="inputValue"
            @keydown.enter="addTask(itemList, index)"
          />
          <div class="btn__group">
            <button
              class="kanban__btn"
              @click="addTask(itemList, index)"
              :disabled="inputValue.length === 0"
            >
              생성
            </button>
            <button class="kanban__btn" @click="cancleAdding(index)">
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
        {{ element.name }} {{ element.date }}
      </div>
    </template>
  </draggable>
</template>

<script>
import draggable from "vuedraggable"
import { ref, computed} from "vue"
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

    const spinnerStatus = ref(false)
    const inputValue = ref("")
    const currIndex = ref(null)
    const inputStatus = ref(false)
  
    const titleStatus = ref(true)
  
    const addStstus = computed(() => {
      return inputStatus.value
    })

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

    const openAddInput = (board, index) => {
      if (inputStatus.value && currIndex.value === index) {
        inputStatus.value = false
      } else {
        inputValue.value = ""
        inputStatus.value = true
      }
      currIndex.value = index
    }

    const cancleAdding = () => {
      inputStatus.value = false
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
      }, 1000)
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


    return {
      spinnerStatus,
      inputValue,
      currIndex,
      inputStatus,
      titleStatus,
      addStstus,
      moveTask,
      dragStart,
      dragEnd,
      openAddInput,
      cancleAdding,
      addTask,
      clickTaskOpenSideBar,
      changeTitle,
      mouseUp,
      focusIn
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
  padding: 10px;

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
      font-size: 14px;
      font-weight: 600;
      border-radius: 5px;
      background-color: transparent;
      cursor: pointer;
      margin-right: auto;
      width: 75%;

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

      p {
        font-size: 14px;
        margin-right: 5px;
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
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 3px;
      border-radius: 5px;
      margin-bottom: 5px;
      border: 1px solid;
    }

    button {
      width: 3rem;
    }
  }

  &__card {
    @include card;
    cursor: grab;
  }

  .selected-task {
    background: #e9f3fc !important;
  }
}

/* .kanban__spinner-box {
  width: 100%;
  display: flex;
  justify-content: center;
} */
</style>
