import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  state() {
    return {
      myInfo: {
        id: "",
        name: "",
        email: "",
        avatar: "",
        createdAt: null,
        inChatRoom: [],
      },
      token: null,
      didAutoLogout: false,
    };
  },
  mutations,
  actions,
  getters,
};
