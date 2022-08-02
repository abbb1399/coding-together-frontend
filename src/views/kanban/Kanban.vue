<template>
  <section>
    <div class="kanban">
      <draggable 
        :list="boardList" itemKey="_id" class="kanban__board" group="board"
        :animation="90" :forceFallback="true" :fallbackTolerance="3"
        ghostClass="ghost" chosenClass="chosen" dragClass="drag" handle=".handle"
        @change="moveBoard($event)"
      >
        <template #item="{element, index}">
          <kanban-list 
            :item-list="element" 
            :index="index"
            :selected-task-id="selectedTaskId"
            @open-sidebar="openSidebar"
          />
        </template>
      </draggable>
      <kanban-add-btn />
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
import KanbanAddBtn from "../../components/kanban/KanbanAddBtn.vue"
import KanbanList from "../../components/kanban/KanbanList.vue"

import { ref, computed } from "vue"
import { useStore } from "vuex"

export default {
  components: {
    draggable,
    KanbanSidebar,
    KanbanAddBtn,
    KanbanList,
  },
  setup() {
    const store = useStore()

    const taskId = ref(null)
    const taskName = ref("")
    const sidebar = ref(false)
    const dueDate = ref("없음")
    const selectedBoardId = ref("")
    const selectedTaskId = ref('')

    const boardList = computed(() => {
      return store.getters["kanbans/kanbans"]
    })

    const closeSideBar = () => {
      sidebar.value = false
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
        selectedTask.dueDate = taskData.dueDate
        dueDate.value = taskData.dueDate
      }
    }

    const openSidebar = ({element, boardId}) => {
      dueDate.value = "없음"

      selectedTaskId.value = element.id
      sidebar.value = true
      selectedBoardId.value = boardId
      taskName.value = element.name
      taskId.value = element.id

      if (element.dueDate) {
        dueDate.value = element.dueDate
      }
    }

    const deleteTask = () => {
      console.log("ddd")
    }

    const moveBoard = async ({moved}) => {
      const data ={
        boardId: moved.element._id,
        newIndex: moved.newIndex,
        oldIndex: moved.oldIndex
      }
    
      store.dispatch("kanbans/moveBoard", data)
    }

    store.dispatch("kanbans/fetchKanbans")

    return {
      selectedBoardId,
      selectedTaskId,
      sidebar,
      taskName,
      taskId,
      boardList,
      dueDate,
      closeSideBar,
      updateTask,
      deleteTask,
      openSidebar,
      moveBoard
    }
  },
}
</script>

<style lang="scss" scoped>
.kanban {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;

  &__board {
    border-radius: 3px;
    display: flex;

    gap: 1rem;
  }
}

</style>
