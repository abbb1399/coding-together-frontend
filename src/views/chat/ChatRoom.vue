<template>
	<div>
		<chat-window
			height="calc(100vh - 5rem)"
			:current-user-id="currentUserId"
			:rooms="rooms"
			:rooms-loaded="true"
      :show-audio="false"
      :show-files="false"
      :username-options="usernameOptions"
			:messages="messages"
			:messages-loaded="messagesLoaded"
      :text-messages="textMessages"
			@send-message="sendMessage"
			@fetch-messages="fetchMessages"
		/>
	</div>
</template>

<script>
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'
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
      usernameOptions: {minUsers: 0, currentUser: false},
      messagesLoaded: false,
      textMessages: {
        // ROOMS_EMPTY: 'Aucune conversation',
        // ROOM_EMPTY: 'Aucune conversation sélectionnée',
        NEW_MESSAGES: '새로운 메세지',
        MESSAGE_DELETED: '삭제되었습니다.',
        MESSAGES_EMPTY: '메세지 없음',
        CONVERSATION_STARTED: '대화 시작일 :',
        TYPE_MESSAGE: '메세지를 입력하세요.',
        SEARCH: '검색',
        // IS_ONLINE: 'est en ligne',
        // LAST_SEEN: 'dernière connexion ',
        // IS_TYPING: 'est en train de taper...',
        // CANCEL_SELECT_MESSAGE: 'Annuler Sélection'
      },

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
      currentUserName:''
		}
	},
  async created(){
    await this.$store.dispatch('fetchMyInfo')

    const myInfo  = this.$store.getters.getMyInfo

    this.currentUserId = myInfo._id
    this.currentUserName = myInfo.name


    
    const socket = io("http://localhost:3000")

    // 방정보 불러오기
    await this.$store.dispatch('chat/fetchChatRoomList')
    console.log(this.$store.getters['chat/roomList'])
    const roomInfo = [...this.$store.getters['chat/roomList']]

    const enteredRoom = roomInfo.find(room => room.roomId === this.roomId) 
    console.log(enteredRoom)
    
    const room = enteredRoom.roomName
    const roomId = enteredRoom.roomId
    const userId = myInfo._id
    const username = myInfo.name
  

    // Join 소켓
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
      this.rooms = roomInfo
    })

    // 메세지 받기 소켓
    socket.on('message', (message) =>{
      const array = [
        {
          _id: message._id,
          content: message.text,
          senderId: message.senderId,
          username: message.username,
          date: this.$moment(message.date).format('YYYY-MM-DD'),
          timestamp: message.timestamp
        }
      ]
      this.messages = [...this.messages, ...array]
    })
    

    this.socket = socket
  },
  mounted(){
    

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
	}
}
</script>