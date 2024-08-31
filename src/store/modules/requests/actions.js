import axios from "../../../plugins/axios";

export default {
  async sendRequest(context, request) {
    try {
      const response = await axios.post("/requests", request);
      request.id = response._id;

      context.commit("addRequest", request);
    } catch (e) {
      console.log(e);
    }
  },

  async fetchRequests(context, page) {
    // 로그인한사람의 유저 아이디
    // const userId = context.rootGetters.userId
    const token = context.rootGetters.token;

    try {
      const { data } = await axios.get(`/requests/${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      context.commit("setRequests", data);
    } catch (e) {
      console.log(e);
    }
  },

  // 요청 읽음 처리
  haveRequestRead(_, id) {
    try {
      axios.patch(`/requests/${id}`);
    } catch (e) {
      console.log(e);
    }
  },

  // 안읽은 요청 갯수 불러오기
  async fetchUnreadRequests(context) {
    const token = context.rootGetters.token;

    try {
      const { data } = await axios.get("/unread-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      context.commit("setUnreadReqestsCount", data);
    } catch (e) {
      console.log(e);
    }
  },
};
