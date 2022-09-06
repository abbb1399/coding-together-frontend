export default {
  addKanban(state, payload){
    state.kanbans.push(payload)
  },
  subtractKanban(state, board){
    const index = state.kanbans.findIndex((kanban) => kanban._id === board._id)

    if(index !== -1){
      state.kanbans.splice(index, 1)
    }  
  },
  setKanbans(state, payload){
    state.kanbans = payload
  },
  addTask(state, payload){
    state.tasks.push(payload)
  },
  deleteTask(state, {_id, list}){
    const selectedKanban = state.kanbans.find((kanban) => kanban._id === _id)
    selectedKanban.list = list
  }
}