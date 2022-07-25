<template>
  <section>
    <div class="boards-container">
      <div
        class="boards-container__board"
        v-for="(board, index) in boardList"
        :key="index"
      >
        <draggable
          v-model="board.list"
          item-key="id"
          group="people"
          :animation="90"
          :multiDrag="true"
          class="test2"
          ghostClass="ghost"
          chosenClass="chosen"
          dragClass="drag"
          :forceFallback="true"
          :fallbackTolerance="3"
          @change="moveTask($event, board._id)"
          @start="dragStart($event)"
          @end="dragEnd($event)"
        >
          <template #header>
            <div class="boards-container__header">
              <input
                :value="board.title"
                class="header-input"
                maxlength="15"
                @blur="changeTitle($event, board)"
                @keydown.enter="$event.target.blur()"
                @focus="$event.target.select()"
              />

              <div class="header-control">
                <p>
                  <font-awesome-icon icon="tag" />&nbsp;{{ board.list.length }}
                </p>
                <button
                  class="boards-container__btn"
                  @click="openAddInput(board, index)"
                >
                  <font-awesome-icon icon="plus" />
                </button>
              </div>
            </div>

            <div
              class="boards-container__input"
              v-if="inputStatus && currIndex === index"
            >
              <base-spinner2 v-if="spinnerStatus" />
              <div v-else>
                <p>제목</p>
                <input
                  type="text"
                  v-model="inputValue"
                  @keydown.enter="addTask(board, index)"
                />
                <div class="btn__group">
                  <button
                    class="boards-container__btn"
                    @click="addTask(board, index)"
                    :disabled="inputValue.length === 0"
                  >
                    생성
                  </button>
                  <button
                    class="boards-container__btn"
                    @click="cancleAdding(index)"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </template>

          <template #item="{ element }">
            <div
              class="boards-container__card"
              :class="{ 'selected-task': element.id === selectedTask }"
              @click="clickTaskOpenSideBar(element, board._id)"
            >
              {{ element.name }} {{ element.date }}
            </div>
          </template>
        </draggable>
      </div>

      <div class="boards-container__add">
        <transition name="add-list" mode="out-in">
          <button
            v-if="addStatus"
            class="open-add"
            @click="openAddBoard"
            data-action="add-btn"
          >
            + 리스트 추가
          </button>
          <div class="add-group" v-else v-click-outside="clickOutside">
            <input type="text" v-focus v-model="addListValue" @keydown.enter="addList"/>
            <span>
              <button @click="addList">추가</button>
              <font-awesome-icon
                class="x-icon"
                icon="x"
                @click="openAddBoard"
              />
            </span>
          </div>
        </transition>
      </div>
    </div>

    <!-- 사이드바 -->
    <kanban-sidebar
      :sidebar="sidebar"
      :board-id="selectedBoardId"
      :task-name="taskName"
      :task-id="taskId"
      :due-date="dueDate"
      @close-sidebar="closeSideBar"
      @update-task="updateTask"
      @delete-task="deleteTask"
    />
  </section>
</template>

<script>
import draggable from "vuedraggable"
import KanbanSidebar from "../../components/kanban/KanbanSidebar.vue"

import { ref, computed } from "vue"
import { useStore } from "vuex"

export default {
  components: {
    draggable,
    KanbanSidebar,
  },
  setup() {
    const store = useStore()

    const spinnerStatus = ref(false)
    const taskId = ref(null)
    const taskName = ref("")
    const sidebar = ref(false)
    const inputValue = ref("")
    const currIndex = ref(null)
    const inputStatus = ref(false)
    const selectedBoardId = ref("")
    const selectedTask = ref("")
    const dueDate = ref("없음")
    const titleStatus = ref(true)
    const addStatus = ref(true)
    const addListValue = ref('')

    const addStstus = computed(() => {
      return inputStatus.value
    })

    const boardList = computed(() => {
      return store.getters["kanbans/kanbans"]
    })

    const closeSideBar = () => {
      sidebar.value = false
    }

    const moveTask = ({ added, removed, moved }, boardId) => {
      if (added) {
        store.dispatch("kanbans/moveTask", {
          status: "added",
          boardId: boardId,
          task: added.element,
          newIndex: added.newIndex
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

    const dragStart = (e) => {
      console.log(e)
      setDragCursor(true)
    }

    const dragEnd = (e) => {
      console.log(e)
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

    const clickTaskOpenSideBar = (element, boardId) => {
      dueDate.value = "없음"

      // 업무 클릭시 옅은파랑으로
      selectedTask.value = element.id

      sidebar.value = true
      selectedBoardId.value = boardId
      taskName.value = element.name
      taskId.value = element.id

      if (element.date) {
        dueDate.value = element.date
      }
    }

    const updateTask = (taskData) => {
      const selectedBoard = boardList.value.find(
        (board) => board._id === taskData.boardId
      )
      const selectedTask = selectedBoard.list.find(
        (data) => data.id === taskData.taskId
      )

      if (taskData.status === "NAME") {
        selectedTask.name = taskData.taskName
        taskName.value = taskData.taskName
      } else if (taskData.status === "DATE") {
        selectedTask.date = taskData.taskDate
        dueDate.value = taskData.taskDate
      }
    }

    const deleteTask = () => {
      console.log("ddd")
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

    const openAddBoard = () => {
      addStatus.value = !addStatus.value

      // 인풋값 초기화
      addListValue.value = ''
    }

    const clickOutside = () => {
      addStatus.value = true
    }

    const addList = () =>{
      const inputTitle = addListValue.value.trim()
      console.log(inputTitle.length)

      if(inputTitle.length === 0){
        return
      }

     

    }

    store.dispatch("kanbans/fetchKanbans")

    return {
      addListValue,
      inputValue,
      spinnerStatus,
      currIndex,
      selectedBoardId,
      titleStatus,
      inputStatus,
      addStatus,
      selectedTask,
      sidebar,
      taskName,
      taskId,
      addStstus,
      boardList,
      dueDate,
      closeSideBar,
      moveTask,
      dragStart,
      dragEnd,
      openAddInput,
      addList,
      clickOutside,
      cancleAdding,
      addTask,
      clickTaskOpenSideBar,
      updateTask,
      deleteTask,
      changeTitle,
      openAddBoard,
    }
  },
}
</script>

<style lang="scss" scoped>
.test2 {
  // background: red;
  height: 84vh;
  overflow-y: auto;
  overflow-x: hidden;
}

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

.boards-container {
  display: grid;
  grid-auto-columns: 17rem;
  grid-auto-flow: column;
  grid-gap: 10px;
  height: 100%;
  height: calc(100vh - 5rem);
  // overflow: auto;
  padding: 0.5rem;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;

  &__btn {
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

  &__board {
    background: #ebecf0;
    border-radius: 3px;
    display: grid;
    grid-auto-rows: max-content;
    grid-gap: 10px;
    padding: 0.625rem;
    height: 100% !important;
  }

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

    &.selected-task {
      background: #e9f3fc;
    }
  }

  &__spinner-box {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__add {
    background-color: #ebecf0;
    border-radius: 5px;
    height: 2.5rem;

    .open-add {
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

    .add-group {
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
}

// Vue Transition css
.add-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.add-list-leave-active {
  transition: all 0.3s ease-in;
}
</style>
