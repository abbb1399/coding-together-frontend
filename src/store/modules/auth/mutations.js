import moment from 'moment'

export default {
  setUser(state, {token, myInfo}){
    state.token = token
    state.myInfo.id = myInfo.id
    state.myInfo.email = myInfo.email
    state.myInfo.name = myInfo.name
    state.myInfo.avatar = myInfo.avatar
    state.myInfo.createdAt = moment(myInfo.createdAt).format('YYYY-MM-DD')
    state.myInfo.inChatRoom = myInfo.inChatRoom

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
  },
  setUnAuthenticated(state){
    state.token = null
  },

  setInChatRoom(state,{articleId, chatRoomId}){
    const inUse = state.myInfo.inChatRoom.find(info => info.articleId === articleId)
    
    if(!inUse){
      state.myInfo.inChatRoom.push({articleId, chatRoomId})

      const info = JSON.parse(localStorage.getItem("myInfo"))
      
      localStorage.setItem(
        "myInfo",
        JSON.stringify({
          ...info,
          inChatRoom: info.inChatRoom.concat({articleId, chatRoomId}),
        })
      )
    }    
  }
}