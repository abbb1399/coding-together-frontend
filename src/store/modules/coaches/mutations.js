export default {
  registerCoach(state, payload){
    state.coaches.push(payload)
  },
  setCoaches(state, payload){
    state.coaches = payload
  },
  setFetchTimestamp(state){
    state.lastFetch = new Date().getTime()
  },
  setUploadFileName(state, fileName){
    state.fileName = fileName
  },
  setMyList(state, myList){
    state.myList = myList
  }

}