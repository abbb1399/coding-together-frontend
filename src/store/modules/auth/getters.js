export default {
  // userId(state){
  //   return state.userId
  // },
  myInfo(state){
    return state.myInfo
  },
  token(state){
    return state.token
  },
  isAuthenticated(state){
    return !!state.token
  },
  didAutoLogout(state){
    return state.didAutoLogout
  },
  // 내 정보 가져오기
  // getMyInfo(state){
  //   return state.myInfo
  // }
}