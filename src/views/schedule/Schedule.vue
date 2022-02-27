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

//  src/utilities/tui-calendar
import calendarOption from '../../utilities/tui-calendar/calendar-option'
// import dummyData from '../../utilities/tui-calendar/calendar-dummy-data'
import scheduleType from  '../../utilities/tui-calendar/schedule-type'

export default {
  inject:['$moment'],
  async mounted(){
    await this.$store.dispatch('schedules/fetchSchedules')
    console.log(this.$store.getters['schedules/schedules'])
  
    // 캘린더 인스턴스 생성
    this.calendarInstance = new Calendar(this.$refs.tuiCalendar, calendarOption)
    
    // 오늘 날짜설정
    this.calendarInstance.setDate(this.$moment().format('YYYY-MM-DD'))

    // 스케줄 Type
    this.calendarInstance.setCalendars(scheduleType)
  
    // 스케쥴 생성
    this.calendarInstance.createSchedules(this.$store.getters['schedules/schedules'])
  
    this.calendarInstance.on('beforeCreateSchedule', scheduleData => {
      const schedule = {
        calendarId: scheduleData.calendarId,
        id: String(Date.now()),
        title: scheduleData.title,
        // isAllDay: scheduleData.isAllDay,
        start: scheduleData.start,
        end: scheduleData.end,
        category: scheduleData.isAllDay ? 'allday' : 'time',
        location: scheduleData.location
      };
      
      // tui-calendar - Create
      this.calendarInstance.createSchedules([schedule])
      // 서버로직 - Create 
      this.$store.dispatch('schedules/resigerSchedule', schedule)
    })

    this.calendarInstance.on('beforeUpdateSchedule', event => {
      const {schedule, changes} = event
      
      // tui-calendar - Update
      this.calendarInstance.updateSchedule(schedule.id, schedule.calendarId, changes)
      // 서버로직 - Update
      delete changes.state
      const updateData = [schedule.id, changes]
      
      this.$store.dispatch('schedules/updateSchedule', updateData)
    })

    this.calendarInstance.on('beforeDeleteSchedule', scheduleData => {
      const {schedule} = scheduleData

      // tui-calendar - Delete
      this.calendarInstance.deleteSchedule(schedule.id, schedule.calendarId)
      // 서버로직 - Delete
      this.$store.dispatch('schedules/deleteSchedule', schedule)
    })
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
    max-width: $website-width;
    // max-width: 80%;
    margin: 0 auto;

  }
  
</style>