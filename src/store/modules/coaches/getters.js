export default {
  coaches(state){
    return state.coaches
  },
  hasCoaches(state){
    return state.coaches && state.coaches.length > 0
  },
  // state,getters,rootState,rootGetters
  isCoach(_,getters,_2,rootGetters){
    const coaches = getters.coaches
    const userId = rootGetters.userId

    // console.log(coaches)
    // console.log(userId)
    return coaches.some(coach => coach.owner === userId)
  },
  shouldUpdate(state){
    const lastFetch = state.lastFetch
    if(!lastFetch){
      return true
    }
    const currentTimeStamp = new Date().getTime()
    return (currentTimeStamp - lastFetch) / 1000 > 60 // 1분 보단 길게
  },
  getUploadFileName(state){
    return state.fileName
  },
  getMyPageList(state){
    return state.myList
  }
}