import moment from 'moment'

export default {
  setRoomList(state, chatRoomInfo){
    const roomInfo = chatRoomInfo.roomlist.map(element => {
      return {
        ...element,
        updatedAt: moment(element.updatedAt).format('YYYY-MM-DD') 
      }
    }); 
    
    state.roomList = roomInfo
    state.total = chatRoomInfo.total
  },
  setMessages(state,messages){
    messages.forEach(msg => {
      const date = msg.date
      msg.timestamp = moment(date).format('HH:mm')
      msg.date = moment(date).format('YYYY-MM-DD')
    })

    state.messages = messages
  },
  setNewlyAddedMessage(state, newMsg){ 
    state.newMessage = newMsg
  },
  setCurrentRoom(state, currentRoomInfo){
    currentRoomInfo.avatar = `${process.env.VUE_APP_API_URL}/images/${currentRoomInfo.avatar}`
    currentRoomInfo.roomId = currentRoomInfo._id

    state.currentRoom = currentRoomInfo
  },
  setIsRoomCreated(state, isCreated){
    state.isRoomCreated = isCreated
  },
  setNewChatRoomId(state, newChatRoomId){
    state.newChatRoomId = newChatRoomId
  }
}