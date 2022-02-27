const axios = require('axios');

export default {
  // 스케줄 생성
  async resigerSchedule(context, payload){
    const token = context.rootGetters.token
    
    const scheduleData = {
      id: payload.id,
      calendarId: payload.calendarId,
      title: payload.title,
      category: payload.category,
      start: payload.start._date,
      end: payload.end._date
    }

    try{
      await axios.post(
        'http://localhost:3000/schedules', 
        scheduleData,
        { headers: { Authorization: `Bearer ${token}` }}
      )
 
      context.commit('addSchedule', scheduleData)
    }catch(e){
      console.log(e)
    }
  },

  // 스케쥴 불러오기
  async fetchSchedules(context){
    const token = context.rootGetters.token

    try{
      const {data}  = await axios.get(
        'http://localhost:3000/schedules',
        { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setSchedules', data)
    }catch(e){
      console.log(e)
    }
  },

  // 스케쥴 업데이트
  async updateSchedule(context,payload){
    const token = context.rootGetters.token  
    const [id, changes] = payload
   
    try{
      axios.patch(
        `http://localhost:3000/schedules/${id}`,
        changes,
        { headers: { Authorization: `Bearer ${token}` }}
      )
    }catch(e){
      console.log(e)
    }
  },

  // 스케쥴 삭제
  async deleteSchedule(context,payload){
    const token = context.rootGetters.token
    const {id, calendarId} = payload

    try{
      await axios.delete(
        `http://localhost:3000/schedules/${calendarId}/${id}`,
        { headers: { Authorization: `Bearer ${token}` }}
      )
    }catch(e){
      console.log(e)
    }
  }
}