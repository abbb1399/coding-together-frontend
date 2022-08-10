import moment from 'moment'

export default {
  setUser(state, {token, myInfo}){
    state.token = token
    state.myInfo.id = myInfo.id
    state.myInfo.email = myInfo.email
    state.myInfo.name = myInfo.name
    state.myInfo.avatar = myInfo.avatar
    state.myInfo.createdAt = moment(myInfo.createdAt).format('YYYY-MM-DD')

    state.didAutoLogout = false
  },
  setAutoLogout(state){
    state.didAutoLogout = true
  },
  // 내 정보 보기
  setMyInfo(state, payload){
    state.myInfo = payload
  },
  setMyAvatar(state, payload){
    state.myInfo.avatar = payload
  }
}