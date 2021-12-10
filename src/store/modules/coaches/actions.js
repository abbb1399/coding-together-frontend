const axios = require('axios');

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

    try{
      await axios.post(
        'http://localhost:3000/coaches', 
        coachData,
        { headers: { Authorization: `Bearer ${token}` }}
      )   

      context.commit('registerCoach',{
        ...coachData,
        id:userId
      })
    }catch(e){
      console.log(e)
    }
    
    // const response = await fetch(
    //   `https://coach-finder-a904f-default-rtdb.asia-southeast1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`,{
    //   method: 'PUT',
    //   body: JSON.stringify(coachData)
    // })

     //const responseData = await response.json()  //json메소드도 promise함유기때문에 await 쓸수 있다.

    //  if(!response.ok){
      // error
    //  }    
  },

  async loadCoaches(context, payload){
    if(!payload.forceRefresh && !context.getters.shouldUpdate){
      return
    }

    // const token = localStorage.getItem('token')
    // console.log(token)
    
    try{
      const responseData = await axios.get('http://localhost:3000/coach-list')

      // console.log(responseData);
      const coaches = []

      responseData.data.forEach(element => {
        const obj = {
          id: element._id,
          name: element.name,
          description: element.description,
          hourlyRate: 10,
          areas: element.areas,
          owner: element.owner
        }
        coaches.push(obj)
      });  
      
      context.commit('setCoaches', coaches)
      context.commit('setFetchTimestamp')  
    }catch(e) {
      console.log(e)
    }
         
    // const response = await fetch(`https://coach-finder-a904f-default-rtdb.asia-southeast1.firebasedatabase.app/coaches.json`)
    
    // const responseData = await response.json()

    // if(!response.ok){
    //   const error = new Error(responseData.message || '불러오기 실패!')
    //   throw error
    // }

    // const coaches = []

    // for(const key in responseData){
    //   const coach = {
    //     id:key,
    //     name: responseData[key].name,
    //     description: responseData[key].description,
    //     hourlyRate: responseData[key].hourlyRate,
    //     areas: responseData[key].areas
    //   }
    //   coaches.push(coach)
    // }
    // context.commit('setCoaches', coaches)
    // context.commit('setFetchTimestamp')
  }
}