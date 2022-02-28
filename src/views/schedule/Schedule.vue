<template>
  <section class="calendar">
    <div class="calendar__header">
      <div>
        <!-- selectedView - watch속성으로 선택한 값을 감지 후, mode변경 -->
        <select v-model="selectedView" class="calendar__select">
          <option v-for="(options, index) in viewModeOption" :value="options.value" :key="index">
            {{options.title}}
          </option>
        </select>
        <span @click="onClickNavi($event)">
          <button type="button" class="btn move-day" data-action="move-today">오늘</button>
          <button type="button" class="btn move-day" data-action="move-prev">이전</button>
          <button type="button" class="btn move-day" data-action="move-next">다음</button>
        </span>
      </div>
      <span class="calendar__render-range">{{dateRange}}</span>
    </div>
    
    <!-- 캘린더 컨테이너 요소 작성 -->
    <div ref="tuiCalendar"></div>
  </section>
</template>

<script>
import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

// 유틸 요소 길어서 따로 빼놓음 - src/utilities/tui-calendar
import calendarOption from '../../utilities/tui-calendar/calendar-option'
// import dummyData from '../../utilities/tui-calendar/calendar-dummy-data'
import scheduleType from  '../../utilities/tui-calendar/schedule-type'

export default {
  inject:['$moment'],
  data(){
    return{
      dateRange: `${this.$moment().format('YYYY-MM')} 월`,
      viewModeOption: [
        {
          title: '월간 뷰',
          value: 'month'
        },
        {
          title: '주간 뷰',
          value: 'week'
        },
        {
          title: '일간 뷰',
          value: 'day'
        }
      ],
      selectedView: 'month',
    }
  },
  watch:{
    // 좌측상단의 select가 변경시 watch('일간', '주간', '월간')
    selectedView (newValue) {
      this.calendarInstance.changeView(newValue, true);
      this.setRenderRangeText()
    }
  },
  async mounted(){
    // 글 불러오기 - server
    await this.$store.dispatch('schedules/fetchSchedules')
   
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
        isAllDay: scheduleData.isAllDay,
        start: scheduleData.start,
        end: scheduleData.end,
        category: scheduleData.isAllDay ? 'allday' : 'time',
        location: scheduleData.location,
        state:scheduleData.state
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
    onClickNavi (event) {
      if (event.target.tagName === 'BUTTON') {
        const { target } = event
        let action = target.dataset ? target.dataset.action : target.getAttribute('data-action')
        action = action.replace('move-', '')
        if(action === 'today'){
           this.calendarInstance.today()
        }else if(action === 'prev'){
          this.calendarInstance.prev()
        }else if(action === 'next'){
          this.calendarInstance.next()
        }
        this.setRenderRangeText()
      }
    },
    // 날짜를 세팅 해주는 method ex)2021년 5월(monthly)
    setRenderRangeText () {
      const view = this.calendarInstance.getViewName()
      const calDate = this.calendarInstance.getDate()
      const rangeStart = this.calendarInstance.getDateRangeStart()
      const rangeEnd = this.calendarInstance.getDateRangeEnd()
      let year = calDate.getFullYear()
      let month = calDate.getMonth() + 1
      let date = calDate.getDate()
      let dateRangeText = ''
      let endMonth, endDate, start, end
      switch (view) {
        case 'month':
          dateRangeText = `${year}년 ${month}월`
          break
        case 'week':
          year = rangeStart.getFullYear()
          month = rangeStart.getMonth() + 1
          date = rangeStart.getDate()
          endMonth = rangeEnd.getMonth() + 1
          endDate = rangeEnd.getDate()
          start = `${year}-${month}-${date}`
          end = `${endMonth}-${endDate}`
          dateRangeText = `${start} ~ ${end}`
          break
        default:
          dateRangeText = `${year}-${month}-${date}`
      }
      this.dateRange = dateRangeText
    },
  },
}
</script>

<style lang="scss" scoped>
  :deep(#tui-full-calendar-schedule-private){
    display: none;
  }

  :deep(.tui-full-calendar-section-title){
    width: 100%;
  }

  :deep(#tui-full-calendar-schedule-title){
    width:96.3%
  }

  .calendar{
    max-width: $website-width;
    margin: 0 auto;

    &__header{
      display: flex;
      padding: .5rem 0;
      align-items: center;
    }

    &__select{
      padding: 5px 15px 5px 5px;
      margin-right: 8px;
      border-radius: 4px;
      width: 90.8px;
      height: 2rem;
    }

    &__render-range{
      font-size: 1.2rem;
      font-weight: 500;
      margin-left: 20px;
    }
  }  

  .btn {
    border-radius: 25px;
    background-color: #fff;
    border: solid 1px #bbb;

    &:hover{
      border: solid 1px grey;
      // background-color: #fff;
    }

    &:active{
      background-color: #f9f9f9;
      border: solid 1px #bbb;
      outline: none;
    }

    &:disabled{
      background-color: #f9f9f9;
      border: solid 1px #ddd;
      color: #bbb;
    }

    &:focus{
      outline: none;
    }
  }

  .move-day {
    padding: .4rem .8rem;
    line-height: 1.1rem;
  }

  
  @media screen and (max-width: 980px) {
      
  }  
</style>