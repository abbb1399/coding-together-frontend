const { io } = require("socket.io-client");
import {reactive, ref} from 'vue'

export default function useChatOptions() {
  // socket-io
  const socket = io("http://localhost:3000")
  
  // 채팅 옵션
  const textMessages = reactive({
    // ROOMS_EMPTY: '대화 없음',
    ROOM_EMPTY: '선택된 대화가 없습니다',
    NEW_MESSAGES: '새로운 메세지',
    MESSAGE_DELETED: '삭제되었습니다.',
    MESSAGES_EMPTY: '메세지 없음',
    CONVERSATION_STARTED: '대화 시작일 :',
    TYPE_MESSAGE: '메세지를 입력하세요.',
    SEARCH: '검색',
    // IS_ONLINE: '접속 중',
    // LAST_SEEN: '마지막 접속',
    // IS_TYPING: '입력 중입니다...',
    // CANCEL_SELECT_MESSAGE: '선택 취소'
  }) 
  const usernameOptions = reactive({minUsers: 0, currentUser: false}) 
  const messagesLoaded = ref(false) 
  const messageActions= reactive([
    // {
    //   name: 'addMessageToFavorite',
    //   title: '커스텀버튼1'
    // },
    {
      name: 'replyMessage',
      title: '답장'
    },
    {
      name: 'editMessage',
      title: '수정',
      onlyMe: true
    },
    {
      name: 'deleteMessage',
      title: '삭제',
      onlyMe: true
    }
  ]) 

  return {
    socket,
    textMessages,
    usernameOptions,
    messagesLoaded,
    messageActions
  }
}