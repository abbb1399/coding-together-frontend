<template>
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
</template>

<script>
import {ref, toRefs, onUnmounted} from 'vue'
import { useStore } from "vuex"
import { useRouter } from "vue-router"

import useChatOptions from '../../hooks/use-chat-options'
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'

import useUnreadRequests from '../../hooks/use-unread-requests'

export default {
  components: {
    ChatWindow
	},
  props:{
    roomId:{
      type:String,
      requird:true
    }
  },
  setup(props){
    const store = useStore()
    const router = useRouter()
   
    const { roomId } = toRefs(props)
    const { socket, textMessages, usernameOptions, messagesLoaded, messageActions} = useChatOptions()
    const rooms = ref([]) 
		const	messages = ref([])
		const	currentUserId = ref('') 
    const currentUserName = ref('')
    const { unreadRequestsCount } = useUnreadRequests()

    const chatInit = async () => {
      const { id, name } = store.getters.myInfo
      currentUserId.value = id
      currentUserName.value = name

      // 방정보 불러오기
      await store.dispatch('chat/fetchCurrentRoom', roomId.value)
      const enteredRoom = store.getters['chat/currentRoom']

      rooms.value = [enteredRoom]

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
        messages.value = [
          ...messages.value,
          {
            _id,
            content,
            senderId,
            username,
            date,
            timestamp,
            deleted,
            replyMessage
          }
        ]
      })

      // 메세지 삭제
      socket.on('deleteMessage', (msgId)=> {
        const index = messages.value.findIndex((message)=> message._id === msgId)
        if(index !== -1){
          messages.value[index].deleted = true
        }    
      })

      // 메세지 수정
      socket.on('updateMessage', ({msgId, content}) => {
        const index = messages.value.findIndex((message)=> message._id === msgId)
        if(index !== -1){
          messages.value[index].content = content
          messages.value[index].edited = new Date()
        }  
      })
    }

    // 메세지 불러오기
		const fetchMessages = async () => {
			await store.dispatch('chat/fetchMessages', roomId.value)
      messages.value = [...store.getters['chat/messages']]
      messagesLoaded.value = true
		}

    // 메세지 보내기
		const sendMessage = async({roomId, content, replyMessage}) => {
      // 메세지 생성 -서버
      const msgData ={
        content,
        senderId: currentUserId.value,
        username: currentUserName.value,
        roomId,
        replyMessage
      }
      
      await store.dispatch('chat/registerMessage', msgData)
      const msg = store.getters['chat/newMessage']
   
      // 메세지 보내기 소켓
      socket.emit('sendMessage', msg, (error)=>{
        if(error){
          return console.log(error)
        }
      })
		}

    const deleteMessage = async ({message}) => {
      await store.dispatch('chat/deleteMessage', message._id)

      // 메세지 삭제 소켓
      socket.emit('deleteMessage', message._id, (error)=>{
        if(error){
          return console.log(error)
        }
      })
    }

    const editMessage = ({newContent, messageId, replyMessage}) => {
      const msgData = {
        content : newContent,
        msgId: messageId,
        edited: new Date(),
        replyMessage
      }

      // 메세지 수정 서버
      store.dispatch('chat/updateMessage', msgData)

      // 메세지 수정 소켓
      socket.emit('updateMessage', msgData, (error)=>{
        if(error){
          return console.log(error)
        }
      })
    }
    
    const backSpace = () => {
      router.replace({name:'chatMain'})
    }
    
    onUnmounted(()=>{
      // 소켓 해제
      socket.disconnect()
    })

    // 채팅 세팅
    chatInit()

    // 안읽은 requests 갯수 불러오기
    unreadRequestsCount()

    return {
      textMessages,
      usernameOptions,
      messagesLoaded,
      messageActions,
      rooms,
      messages,
      currentUserId,
      currentUserName,
      fetchMessages,
      sendMessage,
      deleteMessage,
      editMessage,
      backSpace
    }
  }
}
</script>

<style lang="scss" scoped>
  #chat-room{
    max-width: 900px;
    margin: 0 auto;

    @include respond(phone) {
      height: 96vh !important;
    }

    @include respond(small-screen) {
      height: 94vh !important;
    }
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