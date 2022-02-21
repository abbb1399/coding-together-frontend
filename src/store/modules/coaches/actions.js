const axios = require('axios');

export default {
  async registerCoach(context, data){
    const userId = context.rootGetters.userId

    const coachData = {
      name : data.name,
      description : data.desc,
      areas : data.areas,
      thumbnail: data.thumbnail
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
        const dataObj = {
          id: element._id,
          name: element.name,
          description: element.description,
          areas: element.areas,
          owner: element.owner,
          thumbnail: element.thumbnail,
          updatedAt: element.updatedAt
        }
        coaches.push(dataObj)
      });  
      
      context.commit('setCoaches', coaches)
      // context.commit('setFetchTimestamp')  
    }catch(e) {
      console.log(e)
    }
  },

  async moreLoadCoaches(context, payload){  
    // console.log(payload.filter)
    try{
      const { data } = await axios.get(`http://localhost:3000/more-coach-list/${payload.pageNum}`,{
        params: {
          filter: payload.filter
        }
      })

      const coaches = []

      data.forEach(element => {
        const dataObj = {
          id: element._id,
          name: element.name,
          description: element.description,
          areas: element.areas,
          owner: element.owner,
          thumbnail: element.thumbnail,
          updatedAt: element.updatedAt
        }
        coaches.push(dataObj)
      });  
      
      context.commit('setCoaches', coaches)
      // context.commit('setFetchTimestamp')
    }catch(e) {
      console.log(e)
    }
  },

  async fetchMyList(context){
    try{
      const token = context.rootGetters.token
      const { data } = await axios.get(`http://localhost:3000/my-list`,
       { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setMyList', data)
    }catch(e){
      console.log(e)
    }
  },

  async uploadImage(context,file){
    try{
      const {data} = await axios.post(
       'http://localhost:3000/images',
       file
      )
      context.commit('setUploadFileName', data)
    }catch(e){
      console.log(e)
    }
  },

  async fetchListImage(context, filename){
    try{
      await axios.get(
        `http://localhost:3000/images/${filename}`
      )
    }catch(e){
      console.log(e)
    }
  }
}