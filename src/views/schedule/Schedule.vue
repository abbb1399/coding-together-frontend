<template>
  <div id="calendar-section">
    <h1>TOAST UI Calendar</h1>
    <button id="prevBtn" @click="prev">이전</button>
    <button id="nextBtn" @click="next">다음</button>
    <button id="dayViewBtn" @click="dayView">일간</button>
    <button id="weekViewBtn" @click="weekView">주간</button>
    <button id="monthViewBtn" @click="monthView">월간</button>

    <!-- 캘린더 컨테이너 요소 작성 -->
    <div ref="tuiCalendar"></div>
  </div>
</template>

<script>
import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

import tuiCalendarOption from '../../utilities/tui-calendar-option'

export default {
  inject:['$moment'],
  mounted(){
    // 캘린더 인스턴스 생성
    this.calendarInstance = new Calendar(this.$refs.tuiCalendar, tuiCalendarOption)
    // 날짜설정
    this.calendarInstance.setDate(this.$moment().format('YYYY-MM-DD'))

    // 스케줄 Type
    this.calendarInstance.setCalendars([
      {
        id: 'Major Subject',
        name: '전공 필수',
        color: '#ffffff',
        bgColor: '#ff5583',
        dragBgColor: '#ff5583',
        borderColor: '#ff5583'
      },
      {
        id: 'Elective Subject',
        name: '전공 선택',
        color: '#ffffff',
        bgColor: '#ffbb3b',
        dragBgColor: '#ffbb3b',
        borderColor: '#ffbb3b'
      },
      {
        id: 'General Subject',
        name: '일반 교양',
        color: '#ffffff',
        bgColor: '#03bd9e',
        dragBgColor: '#03bd9e',
        borderColor: '#03bd9e'
      }
    ]);
  
    // 스케쥴 생성
    this.calendarInstance.createSchedules([

    ]);
  
    this.calendarInstance.on('beforeCreateSchedule', scheduleData => {
      const schedule = {
        calendarId: scheduleData.calendarId,
        id: String(Math.random() * 100000000000000000),
        title: scheduleData.title,
        isAllDay: scheduleData.isAllDay,
        start: scheduleData.start,
        end: scheduleData.end,
        category: scheduleData.isAllDay ? 'allday' : 'time',
        location: scheduleData.location
      };

      this.calendarInstance.createSchedules([schedule]);

      alert('일정 생성 완료');
    });

    this.calendarInstance.on('beforeUpdateSchedule', event => {
      const {schedule, changes} = event;

      this.calendarInstance.updateSchedule(schedule.id, schedule.calendarId, changes);
    });

    this.calendarInstance.on('beforeDeleteSchedule', scheduleData => {
      const {schedule} = scheduleData;

      this.calendarInstance.deleteSchedule(schedule.id, schedule.calendarId);
    });
  },
  methods:{
    prev(){
      this.calendarInstance.prev()
    },
    next(){
      this.calendarInstance.next()
    },
    today(){
      this.calendarInstance.today()
    },
    dayView(){
       this.calendarInstance.changeView('day', true);
    },
    weekView(){
       this.calendarInstance.changeView('week', true);
    },
    monthView(){
       this.calendarInstance.changeView('month', true);
    }
  },
}
</script>

<style lang="scss" scoped>
  #calendar-section{
    width: $website-width;
    margin: 10px auto;
  }
  
</style>