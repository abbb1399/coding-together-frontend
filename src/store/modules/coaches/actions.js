const axios = require('axios');

export default {
  async registerCoach(context, data){
    const userId = context.rootGetters.userId

    const coachData = {
      name : data.name,
      description : data.desc,
      // hourlyRate  : data.rate,
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
  },

  async loadCoaches(context){
    // console.log(payload.forceRefresh)
    // console.log(context.getters.shouldUpdate)

    // if(!payload.forceRefresh && !context.getters.shouldUpdate){
    //   console.log('여기임??')
    //   return
    // }

  
    try{
      const { data } = await axios.get('http://localhost:3000/coach-list')

      const coaches = []

      data.forEach(element => {
        const obj = {
          id: element._id,
          name: element.name,
          description: element.description,
          // hourlyRate: 10,
          areas: element.areas,
          owner: element.owner
        }
        coaches.push(obj)
      });  
      
      context.commit('setCoaches', coaches)
      // context.commit('setFetchTimestamp')  
    }catch(e) {
      console.log(e)
    }
  }
}