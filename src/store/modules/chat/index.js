import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      messages: [],
      newMessage: {},
      roomList: [],
      currentRoom: {},
      isRoomCreated: null,
      total: null,
      newChatRoomId: null,
    };
  },
  mutations,
  actions,
  getters,
};
