import axios from "../../../plugins/axios"

export default {
  // Kanban 생성
  async registerKanban(context, kanbanData) {
    const token = context.rootGetters.token

    try {
      const { data } = await axios.post(
        '/kanbans',
        kanbanData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      context.commit("addKanban", data)
    } catch (e) {
      console.log(e)
    }
  },

  // Kanban 불러오기
  async fetchKanbans(context) {
    const token = context.rootGetters.token

    try {
      const { data } = await axios.get('/kanbans', {
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
      axios.patch('/kanbans', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (e) {
      console.log(e)
    }
  },

  // Kanban 순서 변경
  moveBoard(context, data) {
    const token = context.rootGetters.token

    try {
      axios.patch('/move-kanban', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (e) {
      console.log(e)
    }
  },

  // kanban 삭제
  async deleteKanban(context, boardId){
    const token = context.rootGetters.token

    try {
      const {data} = await axios.delete(`/kanban/${boardId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      )
      context.commit("subtractKanban", data)
    } catch (e) {
      console.log(e)
    }
  },

  // Task 생성
  async registerTask(context, taskData) {
    try {
      await axios.patch('/tasks', taskData)
      context.commit("addTask", taskData)
    } catch (e) {
      console.log(e)
    }
  },

  // Task 이동
  moveTask(_, taskData) {
    try {
      axios.patch('/move-task', taskData)
    } catch (e) {
      console.log(e)
    }
  },

  // Task 업데이트
  updateTask(_, taskData) {
    try {
      axios.patch('/update-task', taskData)
    } catch (e) {
      console.log(e)
    }
  },
  // Task 순서 변경
  changeTaskOrder(_, data) {
    try {
      axios.patch('/change-task-order', data)
    } catch (e) {
      console.log(e)
    }
  },
  async deleteTask(context, taskData){
    try {
      const {data} = await axios.delete('/delete-task', {data:taskData})
      
      context.commit("deleteTask", data)
    } catch (e) {
      console.log(e)
    }
  }
}
