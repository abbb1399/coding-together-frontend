export default {
  addKanban(state, payload){
    state.kanbans.push(payload)
  },
  setKanbans(state, payload){
    state.kanbans = payload
  },
  addTask(state, payload){
    state.tasks.push(payload)
  },
}