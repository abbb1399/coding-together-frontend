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
      :menu-actions="menuActions"
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
      type:String
    }
  },
	data() {
		return {
      ...chatUtil,
			currentUserId: '',
			rooms: [
				// {
				// 	roomId: 1,
				// 	roomName: 'Room 1',
				// 	avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
				// 	users: [
				// 		{ _id: '1234', username: 'John Doe' },
				// 		{ _id: '4321', username: 'John Snow' }
				// 	],
        // }
			],
			messages: [],
      currentUserName:'',
      
		}
	},
  async created(){
    await this.$store.dispatch('fetchMyInfo')
    const myInfo  = this.$store.getters.getMyInfo

    this.currentUserId = myInfo._id
    this.currentUserName = myInfo.name

    const socket = io("http://localhost:3000")

    // 방정보 불러오기
    await this.$store.dispatch('chat/fetchCurrentRoom', this.roomId)
    const enteredRoom = this.$store.getters['chat/currentRoom']
    
    const room = enteredRoom.roomName
    const roomId = enteredRoom.roomId
    const userId = myInfo._id
    const username = myInfo.name
  
    // 소켓 Join
    socket.emit('join',{username, room, userId, roomId},(error)=>{
      if(error){
        alert(error)
        // location.href='/'
      }
    })

    // 방정보 불러오기 소켓
    // socket.on('roomData',({room,users})=>{
    socket.on('roomData',()=>{
      // console.log(users)
      // console.log(room)
      this.rooms = [enteredRoom]
    })

    // 메세지 받기 소켓
    socket.on('message', (message) => {
      const array = [
        {
          _id: message._id,
          content: message.text,
          senderId: message.senderId,
          username: message.username,
          date: this.$moment(message.date).format('YYYY-MM-DD'),
          timestamp: message.timestamp,
          deleted: message.deleted
        }
      ]
      this.messages = [...this.messages, ...array]
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
		async fetchMessages({ options = {} }) {
			await this.$store.dispatch('chat/fetchMessages',this.roomId)
      // console.log(this.$store.getters['chat/messages'])

      setTimeout(() => {
        // 방이 처음 열렸을때 reset:true
				if (options.reset) {
					this.messages = [...this.$store.getters['chat/messages']]
				} else {
          // this.messages = [...this.addMessages(), ...this.messages]
				}
        this.messagesLoaded = true
			})
		},

    // 메세지 보내기
		async sendMessage(message) {
      // 메세지 생성 -서버
      const msgData ={
        content: message.content,
        senderId: this.currentUserId,
        username: this.currentUserName,
        owner: this.roomId
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
    editMessage({messageId, newContent, replyMessage}){
      console.log(replyMessage)
      
      const msgData = {
        content : newContent,
        msgId: messageId,
        edited: new Date()
      }

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