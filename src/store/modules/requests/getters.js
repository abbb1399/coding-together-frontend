export default {
  requests(state){
    return state.requests
  },
  // hasRequests(_,getters){
  //   return getters.requests &&  getters.requests.length > 0
  // },
  getTotalRequest(state){
    return state.total
  },
  getUnreadRequests(state){
    return state.unreadRequests
  }
}