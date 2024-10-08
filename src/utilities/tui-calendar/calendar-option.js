export default {
  taskView: false,
  defaultView: "month",
  week: {
    daynames: ["일", "월", "화", "수", "목", "금", "토"],
    hourStart: 7,
    hourEnd: 18,
  },
  month: {
    daynames: ["일", "월", "화", "수", "목", "금", "토"],
  },
  useCreationPopup: true,
  useDetailPopup: true,
  template: {
    popupSave() {
      return "저장";
    },
    popupDelete() {
      return "삭제";
    },
    popupEdit() {
      return "수정";
    },
    popupUpdate() {
      return "수정 완료";
    },
    titlePlaceholder() {
      return "제목";
    },
    locationPlaceholder() {
      return "장소";
    },
    popupIsAllDay() {
      return "온 종일";
    },
    popupStateFree() {
      return "한가함";
    },
    popupStateBusy() {
      return "바쁨";
    },
    startDatePlaceholder() {
      return "시작일";
    },
    endDatePlaceholder() {
      return "종료일";
    },
    popupDetailState(schedule) {
      return "상태 : " + schedule.state || "바쁨";
    },
  },
};
