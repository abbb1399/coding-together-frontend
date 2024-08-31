export default {
  addRequest(state, payload) {
    state.requests.push(payload);
  },
  setRequests(state, { requests, total }) {
    state.requests = requests;
    state.total = total;
  },
  setUnreadReqestsCount(state, { unreadRequests }) {
    state.unreadRequests = unreadRequests;
  },
};
