export default { 
  textMessages : {
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
  usernameOptions : {minUsers: 0, currentUser: false},
  messagesLoaded: false,
  messageActions: [
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
  ],
}
