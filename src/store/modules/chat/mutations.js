import moment from 'moment'

export default {
  setRoomList(state, chatRoomInfo){
    state.roomList = chatRoomInfo
  },
  setMessages(state,messages){
    messages.forEach(msg => {
      const date = msg.date
      msg.timestamp = moment(date).format('HH:mm')
      msg.date = moment(date).format('YYYY-MM-DD')
    })

    state.messages = messages
  },
  addMessage(state,payload){
    state.messages.push(payload)
  },
  setNewlyAddedMessage(state, newMsg){ 
    state.newMessage = newMsg
  },
  setCurrentRoom(state, currentRoomInfo){
    currentRoomInfo.avatar = `http://localhost:3000/images/${currentRoomInfo.avatar}`

    state.currentRoom = currentRoomInfo
  },
  setIsRoomCreated(state, isCreated){
    state.isRoomCreated = isCreated
  }
}