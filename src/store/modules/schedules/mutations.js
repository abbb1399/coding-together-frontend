export default {
  addSchedule(state, payload) {
    state.schedules.push(payload);
  },
  setSchedules(state, payload) {
    state.schedules = payload;
  },
};
