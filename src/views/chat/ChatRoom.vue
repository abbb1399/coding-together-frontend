<template>
  <div>
		<chat-window
      id="chat-room"
			height="calc(100vh - 5rem)"
			:current-user-id="currentUserId"
			:rooms="rooms"
			:rooms-loaded="true"
      :show-audio="false"
      :show-files="false"
      :single-room="true"
      :show-reaction-emojis="false"
      :room-id="roomId"
      :username-options="usernameOptions"
			:messages="messages"
			:messages-loaded="messagesLoaded"
      :text-messages="textMessages"
      :message-actions="messageActions"
			@send-message="sendMessage"
			@fetch-messages="fetchMessages"
      @delete-message="deleteMessage"
      @edit-message="editMessage"
		>
      <template #room-options>
        <font-awesome-icon icon="arrow-left-long" id="back-space" @click="backSpace"/>
      </template>
    </chat-window>
  </div>
</template>

<script>
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'
import chatUtil from '../../utilities/advanced-chat.js'
const { io } = require("socket.io-client");

export default {
  inject:['$moment'],
  components: {
		ChatWindow
	},
  props:{
    roomId:{
      type:String,
      requird:true
    }
  },
	data() {
		return {
      ...chatUtil,
			rooms: [],
			messages: [],
			currentUserId: '',
      currentUserName:'',
		}
	},
  async created(){
    const { id, name } = this.$store.getters.myInfo
    this.currentUserId =id
    this.currentUserName = name

    const socket = io("http://localhost:3000")

    // 방정보 불러오기
    await this.$store.dispatch('chat/fetchCurrentRoom', this.roomId)
    const enteredRoom = this.$store.getters['chat/currentRoom']
   
    this.rooms = [enteredRoom]

    // 소켓 Join
    socket.emit('join',{
      username: name, 
      room:enteredRoom.roomName, 
      userId: id, 
      roomId:enteredRoom.roomId
    },(error)=>{
      if(error){
        alert(error)
      }
    })

    // 메세지 받기 소켓
    socket.on('message', ({_id,content,senderId,username,date,timestamp,deleted,replyMessage}) => {
      this.messages = [
        ...this.messages,
        {
          _id,
          content,
          senderId,
          username,
          date: this.$moment(date).format('YYYY-MM-DD'),
          timestamp,
          deleted,
          replyMessage
        }
      ]
    })

    // 메세지 삭제
    socket.on('deleteMessage', (msgId)=> {
      const messageArray= [...this.messages]
      const index = messageArray.findIndex((message)=> message._id === msgId)
      if(index !== -1){
        this.messages[index].deleted = true
      }    
    })

    // 메세지 수정
    socket.on('updateMessage', (msgData) => {
      const messageArray= [...this.messages]
      const index = messageArray.findIndex((message)=> message._id === msgData.msgId)
      if(index !== -1){
        this.messages[index].content = msgData.content
        this.messages[index].edited = new Date()
      }  
    })

    this.socket = socket
  },
  unmounted(){
    // 소켓 해제
    this.socket.disconnect()
  },
	methods: {
    // 메세지 불러오기
		async fetchMessages() {
			await this.$store.dispatch('chat/fetchMessages',this.roomId)
      this.messages = [...this.$store.getters['chat/messages']]
      this.messagesLoaded = true
		},

    // 메세지 보내기
		async sendMessage({roomId, content, replyMessage}) {
      // 메세지 생성 -서버
      const msgData ={
        content,
        senderId: this.currentUserId,
        username: this.currentUserName,
        owner: roomId,
        replyMessage
      }
      await this.$store.dispatch('chat/registerMessage', msgData)
      const msg = this.$store.getters['chat/newMessage']
 
      // 메세지 보내기 소켓
      this.socket.emit('sendMessage', msg, (error)=>{
        if(error){
          return console.log(error)
        }
        console.log('메세지 전송됨')
      })
		},
    
    
    async deleteMessage({message}){
      await this.$store.dispatch('chat/deleteMessage', message._id)

      // 메세지 삭제 소켓
      this.socket.emit('deleteMessage', message._id, (error)=>{
        if(error){
          return console.log(error)
        }
        console.log('메세지 삭제됨')
      })
    },
    editMessage({newContent, messageId, replyMessage}){
      const msgData = {
        content : newContent,
        msgId: messageId,
        edited: new Date(),
        replyMessage
      }

      // 메세지 수정 서버
      this.$store.dispatch('chat/updateMessage', msgData)

      // 메세지 수정 소켓
      this.socket.emit('updateMessage', msgData, (error)=>{
        if(error){
          return console.log(error)
        }
        console.log('메세지 수정됨')
      })
    },
    backSpace(){
      this.$router.replace({name:'chatMain'})
    }

	}
}
</script>

<style lang="scss" scoped>
  #chat-room{
    max-width: 900px;
    margin: 0 auto;
  }

  #back-space{
    cursor: pointer;
    font-size: 1.4rem;
    padding: .5rem;
    border-radius: 50%;

    &:hover,
    &:active{
       background-color: $color-grey-light;
    }
  }
</style>