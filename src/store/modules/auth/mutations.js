export default {
  setUser(state,payload){
    state.token = payload.token
    state.userId = payload.userId
    state.email = payload.email
    state.didAutoLogout = false
  },
  setAutoLogout(state){
    state.didAutoLogout = true
  },
  // 모든 유저 정보 가져오기
  setUsersInfo(state, payload){
    state.usersInfo = payload
  },
  // 내 정보 보기
  setMyInfo(state, payload){
    state.myInfo = payload
  },
  setMyAvatar(state, payload){
    state.myAvatar = payload
  }
}