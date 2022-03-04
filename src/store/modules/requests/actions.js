import axios from "axios"

export default {
  async contactCoach(context, payload){
    const newRequest = {
      email: payload.email,
      message: payload.message,
      owner: payload.owner
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
    const ownerId = context.rootGetters.userId
    const token = context.rootGetters.token

    try{
      const {data} = await axios.get(
        `http://localhost:3000/requests/${ownerId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setRequests', data)
    }catch(e){
      console.log(e)
    }
  }
}