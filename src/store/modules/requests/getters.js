export default {
  requests(state){
    return state.requests

    // const userId = rootGetters.userId
    // return state.requests.filter(req => req._id === userId)
  },
  hasRequests(_,getters){
    return getters.requests &&  getters.requests.length > 0
  },
  getTotalRequest(state){
    return state.total
  },
  getUnreadRequests(state){
    return state.unreadRequests
  }
}