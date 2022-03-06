const axios = require('axios')

export default {
  // 채팅방 생성하기
  async createRoom(context, roomInfo){
    try{
      const {data} = await axios.post(
        'http://localhost:3000/chatroom',
        roomInfo
      )

      context.commit('addRoom', data)
    }catch(e){
      console.log(e)
    }
  },

  // 채팅방 입장하기
  async enterRoom(context, roomId){
    const token = context.rootGetters.token

    try{
      await axios.patch(
        `http://localhost:3000/chatroom`,  
        {roomId},
        { headers: { Authorization: `Bearer ${token}` }}
      )

    }catch(e){
      console.log(e)
    }
  },


  // 채팅방 리스트 불러오기
  async fetchChatRoomList(context){
    const token = context.rootGetters.token

    try{
      const {data} = await axios.get(
        'http://localhost:3000/roomList',
        { headers: { Authorization: `Bearer ${token}` }}
      )


      context.commit('setRoomList', data)
    }catch(e){
      console.log(e)
    }
  },



  // 메세지 생성하기
  async registerMessage(context, msgData){
    try{
      const {data} = await axios.post(
        'http://localhost:3000/chatMessages', 
        msgData
      )   

      context.commit('addMessage', data)
      context.commit('setNewlyAddedMessage', data)
    }catch(e){
      console.log(e)
    } 
  },

  // 메세지 삭제하기
  deleteMessage(_, msgId){
    try{
      axios.patch(`http://localhost:3000/chatMessages/${msgId}`)

    }catch(e){
      console.log(e)
    }
  },

  // 메세지 불러오기 - 방 아이디 별로
  async fetchMessages(context, roomNum){
    try{
      const {data} = await axios.get(`http://localhost:3000/chatMessages/${roomNum}`)

      context.commit('setMessages', data)
    }catch(e){
      console.log(e)
    }

  }
}