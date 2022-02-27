export default {
  language: 'ko',
  timezone: {
    zones: [
      {
        timezoneName: 'Asia/Seoul',
        displayLabel: 'GMT+09:00',
        tooltip: 'Seoul'
      },
    ],
  },

  taskView: true,
  defaultView: 'month',
  week: {
    daynames: ['일', '월', '화', '수', '목', '금', '토'],
    hourStart: 7,
    hourEnd: 18,
  },
  month:{
    daynames: ['일', '월', '화', '수', '목', '금', '토'],
  },
  useCreationPopup : true,
  useDetailPopup: true,
  template:{
    popupSave: function() {
      return '저장';
    },
    popupDelete: function() {
      return '삭제';
    },
    popupEdit: function() {
      return '수정';
    },
    titlePlaceholder: function() {
      return '제목';
    },
    locationPlaceholder: function() {
      return '장소';
    },
    popupIsAllDay: function() {
      return '온 종일';
    },
    popupStateFree () {
      return 'Free'
    },
    popupStateBusy () {
      return 'Busy'
    },
  }
}