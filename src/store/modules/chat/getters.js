export default {
  isRoomCreated(state) {
    return state.isRoomCreated;
  },
  messages(state) {
    return state.messages;
  },
  newMessage(state) {
    return state.newMessage;
  },
  roomList(state) {
    return state.roomList;
  },
  currentRoom(state) {
    return state.currentRoom;
  },
  getTotalChatRoom(state) {
    return state.total;
  },
  getNewChatRoomId(state) {
    return state.newChatRoomId;
  },
};
