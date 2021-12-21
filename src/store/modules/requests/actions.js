import axios from "axios"

export default {
  async contactCoach(context, payload){
    const newRequest = {
      email: payload.email,
      message: payload.message,
      coachId: payload.coachId
    }
    
    try{
      const response = await axios.post(
        'http://localhost:3000/requests', 
        newRequest,
      )
      newRequest.id = response._id
      // newRequest.coachId = payload.coachId

      context.commit('addRequest', newRequest)
    }catch(e){
      console.log(e)
    }
  },

  async fetchRequests(context){
    // 로그인한사람의 유저 아이디
    const userId = context.rootGetters.userId
    // const token = context.rootGetters.token

    try{
      const response = await axios.get(`http://localhost:3000/requests/${userId}`)
      context.commit('setRequests', response)
    }catch(e){
      console.log(e)
    }
  }
}