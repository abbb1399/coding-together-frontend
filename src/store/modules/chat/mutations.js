import moment from 'moment'

export default {
  setRooms(state, payload){
    state.rooms = payload
  },
  setMessages(state,messages){
    messages.forEach(msg => {
      const date = msg.date
      msg.timestamp = date.substring(11,16)
      msg.date = moment(date).format('YYYY-MM-DD')
    })

    state.messages = messages
  },
  addMessage(state,payload){
    state.messages.push(payload)
  },
  setNewlyAddedMessage(state, newMsg){ 
    state.newMessage = newMsg
  }

}