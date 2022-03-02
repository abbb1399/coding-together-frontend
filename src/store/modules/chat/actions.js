const axios = require('axios')

export default {
  // 방 불러오기
  async fetchRooms(context){
    const id = '621df5782cc718fc05268417'

    try{
      const {data}  = await axios.get(
        `http://localhost:3000/chatroom/${id}`,
      )

      context.commit('setRooms', data)
    }catch(e){
      console.log(e)
    }
  },

  // 메세지 생성하기
  async registerMessage(context, payload){
    const id = '621df5782cc718fc05268417'

    const messageData = {

      content : payload.content,
      senderId: payload.senderId,
      username: payload.username,
      owner: id
    }

    try{
      const {data} = await axios.post(
        'http://localhost:3000/chatMessages', 
        messageData
      )   

      context.commit('addMessage', data)
      context.commit('setNewlyAddedMessage', data)
    }catch(e){
      console.log(e)
    } 
  },

  // 메세지 불러오기 - 방 아이디 별로
  async fetchMessages(context){
    const id = '621df5782cc718fc05268417'

    try{
      const {data} = await axios.get(`http://localhost:3000/chatMessages/${id}`)

      context.commit('setMessages', data)
    }catch(e){
      console.log(e)
    }

  }
}