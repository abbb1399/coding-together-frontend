import axios from "../../../plugins/axios";

export default {
  // 스케줄 생성
  async resigerSchedule(context, payload) {
    const token = context.rootGetters.token;

    const scheduleData = {
      id: payload.id,
      calendarId: payload.calendarId,
      title: payload.title,
      category: payload.category,
      isAllDay: payload.isAllDay,
      start: payload.start._date,
      end: payload.end._date,
      state: payload.state,
      location: payload.location,
    };

    try {
      await axios.post("/schedules", scheduleData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      context.commit("addSchedule", scheduleData);
    } catch (e) {
      console.log(e);
    }
  },

  // 스케쥴 불러오기
  async fetchSchedules(context) {
    const token = context.rootGetters.token;

    try {
      const { data } = await axios.get("/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });

      context.commit("setSchedules", data);
    } catch (e) {
      console.log(e);
    }
  },

  // 스케쥴 업데이트
  async updateSchedule(context, payload) {
    const token = context.rootGetters.token;
    const [id, changes] = payload;

    if (changes.start) {
      changes.start = changes.start._date;
    }
    if (changes.end) {
      changes.end = changes.end._date;
    }
    if (changes.calendarId) {
      delete changes.bgColor;
      delete changes.borderColor;
      delete changes.color;
      delete changes.dragBgColor;
    }

    try {
      axios.patch(`/schedules/${id}`, changes, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.log(e);
    }
  },

  // 스케쥴 삭제
  async deleteSchedule(context, { id, calendarId }) {
    const token = context.rootGetters.token;

    try {
      await axios.delete("/schedules", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id, calendarId },
      });
    } catch (e) {
      console.log(e);
    }
  },
};
