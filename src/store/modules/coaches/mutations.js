export default {
  registerCoach(state, payload){
    state.coaches.push(payload)
  },
  setCoaches(state, payload){
    state.coaches = payload
  },
  // setMoreCoaches(state,payload){
  //   state.coaches.push(...payload)
  // },
  setFetchTimestamp(state){
    state.lastFetch = new Date().getTime()
  }
}