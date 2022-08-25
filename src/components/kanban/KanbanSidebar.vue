<template>
  <transition name="side" mode="out-in">
    <div class="sidebar" v-if="sidebar">
      <a class="closebtn" @click="close">&times;</a>

      <div class="sidebar__group">
        <div v-if="!nameEditStatus" class="sidebar__content">
          <p>{{ taskName }}</p>
          <button class="kanban-btn" @click="editName">수정</button>
        </div>
        <div v-else class="sidebar__input">
          <base-spinner2 v-if="spinner" />
          <div v-else>
            <input type="text" v-model="nameInputValue" ref="editInput" />
            <div class="btn-group">
              <button
                class="kanban-btn"
                @click="confrimEditName"
                :disabled="nameInputValue.length === 0"
              >
                수정
              </button>
              <button class="kanban-btn" @click="cancleEditName">취소</button>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar__group">
        <div class="sidebar__content">
          <p>기한</p>
          <button class="kanban-btn" @click="editDate">수정</button>
        </div>
        <div class="sidebar__input">
          <p v-if="!dateEditStatus" class="date-paragraph">{{ dueDateValue }}</p>
          <input
            v-else
            @change="changeDate"
            type="date"
            :value="dueDate"
            class="date-input"
          />
        </div>
      </div>

      <div class="sidebar__group delete-task">
        <button class="kanban-btn" @click="deleteTask">업무 삭제</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, toRefs, computed, watch, nextTick, inject } from "vue"
import { useStore } from "vuex"

export default {
  emit: ["close-sidebar", "update-name", "delete-task", "update-date"],
  props: {
    sidebar: {
      type: Boolean,
      default: false,
    },
    boardId: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
    },
    dueDate: {
      type: String,
    },
  },
  setup(props, context) {
    const store = useStore()
    const $swal = inject('$swal')

    const nameEditStatus = ref(false)
    const nameInputValue = ref("")
    const spinner = ref(false)
    const dateEditStatus = ref(false)
    const editInput = ref()

    const { taskName, boardId, taskId, dueDate } = toRefs(props)

    watch(taskName, () => {
      nameEditStatus.value = false
    })

    const loadingStatus = computed(() => {
      return spinner.value
    })

    const dueDateValue = computed(() => {
      return dueDate.value
    })

    const close = () => {
      context.emit("close-sidebar")
    }

    const editName = () => {
      nameInputValue.value = taskName.value
      nameEditStatus.value = true

      nextTick(() => {
        editInput.value.focus()
      })
    }

    const confrimEditName = () => {
      // 같은이름 수정일시
      if (taskName.value === nameInputValue.value) {
        return (nameEditStatus.value = false)
      }

      spinner.value = true

      setTimeout(async () => {
        const nameData = {
          status: "NAME",
          boardId: boardId.value,
          taskId: taskId.value,
          taskName: nameInputValue.value,
        }
        context.emit("update-task", nameData)
        await store.dispatch("kanbans/updateTask", nameData)

        spinner.value = false
        nameEditStatus.value = false
      }, 500)
    }

    const cancleEditName = () => {
      nameEditStatus.value = false
    }

    const editDate = () => {
      dateEditStatus.value = !dateEditStatus.value
    }

    const changeDate = async (e) => {
      const dateData = {
        status: "DATE",
        boardId: boardId.value,
        taskId: taskId.value,
        dueDate: e.target.value,
      }
      context.emit("update-task", dateData)
      await store.dispatch("kanbans/updateTask", dateData)

      dateEditStatus.value = false
    }

    const deleteTask = async () => {
      const result = await $swal.fire({
        title: "삭제 하시겠습니까?",
        text: "해당 업무를 삭제합니다.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "네",
        cancelButtonText: "아니오",
      })

      if (result.isConfirmed) {
        await store.dispatch("kanbans/deleteTask", {boardId: boardId.value, taskId: taskId.value})
        $swal.fire({
          icon: "success",
          title: `삭제에 성공 하였습니다.`,
          showConfirmButton: false,
          timer: 2000,
        })
        context.emit("close-sidebar")
      }
    }

    return {
      nameEditStatus,
      nameInputValue,
      spinner,
      dateEditStatus,
      loadingStatus,
      dueDateValue,
      editInput,
      close,
      editName,
      confrimEditName,
      cancleEditName,
      editDate,
      changeDate,
      deleteTask,
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  width: 23vw;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  background-color: #fafafa;
  overflow-x: hidden;
  padding-top: 60px;
  box-shadow: -4px 0 8px #bfbfbf;

  &__group {
    width: 90%;
    margin: 0 auto;
    padding: 1rem 0 1rem 0;
    border-bottom: 1px solid #dbdbdb;
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-weight: 600;
    }
  }

  &__input {
    input {
      width: 100%;
      border-radius: 5px;
      border: 1px solid black;
      padding: 5px;
    }

    .btn-group {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }

    .date-paragraph {
      margin-top: 0.7rem;
    }

    .date-input {
      margin-top: 0.7rem;
    }
  }

  .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
    cursor: pointer;
  }

  .kanban-btn {
    background: #fff;
    border-radius: 5px;
    border: 1px solid gray;
    font-size: .7rem;
    padding: 5px;
    cursor: pointer;
    width: 3.5rem;

    &:hover,
    &:active {
      background: darken(#fff, 5%);
    }
  }

  .delete-task{
    button{
      width: 5rem;
    }
  }
}


// Vue Transition css
.side-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.side-leave-active {
  transition: all 0.2s ease-in;
}

// .side-enter-to,
// .side-leave-from{
//   opacity: 1;
//   transform: translateX(0);
// }
</style>
