import axios from "../../../plugins/axios";

export default {
  // 채팅방 생성하기
  async createRoom(context, roomInfo) {
    try {
      const { data } = await axios.post("/chatroom", roomInfo);

      context.commit("setNewChatRoomId", data._id);
    } catch (e) {
      console.log(e);
    }
  },

  // 채팅방 입장하기
  async enterRoom(context, roomId) {
    const token = context.rootGetters.token;

    try {
      await axios.patch(
        "/chatroom",
        { roomId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (e) {
      console.log(e);
    }
  },

  // 채팅방 리스트 불러오기
  async fetchChatRoomList(context, pageNum) {
    const token = context.rootGetters.token;

    try {
      const { data } = await axios.get(`/roomList/${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      context.commit("setRoomList", data);
    } catch (e) {
      console.log(e);
    }
  },

  // 입장한 방 정보 불러오기
  async fetchCurrentRoom(context, roomId) {
    try {
      const { data } = await axios.get(`/chatroom/${roomId}`);

      context.commit("setCurrentRoom", data);
    } catch (e) {
      console.log(e);
    }
  },

  // 메세지 생성하기
  async registerMessage(context, msgData) {
    try {
      const { data } = await axios.post("/chat-messages", msgData);

      context.commit("setNewlyAddedMessage", data);
    } catch (e) {
      console.log(e);
    }
  },

  // 메세지 삭제하기
  async deleteMessage(_, msgId) {
    try {
      await axios.patch(`/delete-message/${msgId}`);
    } catch (e) {
      console.log(e);
    }
  },

  // 메세지 수정하기
  async updateMessage(_, msgData) {
    try {
      await axios.patch("/update-message", msgData);
    } catch (e) {
      console.log(e);
    }
  },

  // 메세지 불러오기 - 방 아이디 별로
  async fetchMessages(context, roomNum) {
    try {
      const { data } = await axios.get(`/chat-messages/${roomNum}`);

      context.commit("setMessages", data);
    } catch (e) {
      console.log(e);
    }
  },
};
