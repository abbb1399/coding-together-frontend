export default {
  async registerCoach(context, data){
    const userId = context.rootGetters.userId
    const coachData = {
      name : data.name,
      description : data.desc,
      hourlyRate  : data.rate,
      areas : data.areas
    }

    const token = context.rootGetters.token

    // fetch는 기본으로 promise 내장
    const response = await fetch(
      `https://coach-finder-a904f-default-rtdb.asia-southeast1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`,{
      method: 'PUT',
      body: JSON.stringify(coachData)
    })

     //const responseData = await response.json()  //json메소드도 promise함유기때문에 await 쓸수 있다.

     if(!response.ok){
      // error
     }

     context.commit('registerCoach',{
      ...coachData,
      id:userId
     })
  },

  async loadCoaches(context, payload){
    if(!payload.forceRefresh && !context.getters.shouldUpdate){
      return
    }
    
    const response = await fetch(`https://coach-finder-a904f-default-rtdb.asia-southeast1.firebasedatabase.app/coaches.json`)
    
    const responseData = await response.json()

    if(!response.ok){
      const error = new Error(responseData.message || '불러오기 실패!')
      throw error
    }

    const coaches = []

    for(const key in responseData){
      const coach = {
        id:key,
        name: responseData[key].name,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas
      }
      coaches.push(coach)
    }
    context.commit('setCoaches', coaches)
    context.commit('setFetchTimestamp')
  }
}