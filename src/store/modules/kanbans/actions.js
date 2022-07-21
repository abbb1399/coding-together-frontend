const axios = require("axios")

export default {
  // Kanban 생성
  async registerKanban(context, kanbanData) {
    const token = context.rootGetters.token

    try {
      await axios.post("http://localhost:3000/kanbans", kanbanData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      context.commit("addKanban", kanbanData)
    } catch (e) {
      console.log(e)
    }
  },

  // Kanban 불러오기
  async fetchKanbans(context) {
    const token = context.rootGetters.token

    try {
      const { data } = await axios.get("http://localhost:3000/kanbans", {
        headers: { Authorization: `Bearer ${token}` },
      })

      context.commit("setKanbans", data)
    } catch (e) {
      console.log(e)
    }
  },

  // Kanban 이름 변경
  updateBoardName(context, data) {
    const token = context.rootGetters.token

    try {
      axios.patch(`http://localhost:3000/kanbans`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (e) {
      console.log(e)
    }
  },

  // Task 생성
  async registerTask(context, taskData) {
    try {
      await axios.patch(`http://localhost:3000/tasks`, taskData)
      context.commit("addTask", taskData)
    } catch (e) {
      console.log(e)
    }
  },

  // Task 이동
  moveTask(_, taskData) {
    try {
      axios.patch(`http://localhost:3000/move-task`, taskData)
    } catch (e) {
      console.log(e)
    }
  },

  // Task 업데이트
  updateTask(_, taskData) {
    try {
      axios.patch("http://localhost:3000/update-task", taskData)
    } catch (e) {
      console.log(e)
    }
  },
  // Task 순서 변경
  changeTaskOrder(_, data) {
    try {
      axios.patch("http://localhost:3000/change-task-order", data)
    } catch (e) {
      console.log(e)
    }
  },
}
