import axios from "axios"

export default {
  async contactCoach(context, request){
    try{
      const response = await axios.post(
        'http://localhost:3000/requests', 
        request,
      )
      request.id = response._id
      // newRequest.coachId = payload.coachId

      context.commit('addRequest', request)
    }catch(e){
      console.log(e)
    }
  },

  async fetchRequests(context){
    // 로그인한사람의 유저 아이디
    // const userId = context.rootGetters.userId
    const token = context.rootGetters.token

    try{
      const {data} = await axios.get(
        `http://localhost:3000/requests`,
        { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setRequests', data)
    }catch(e){
      console.log(e)
    }
  },

  haveRequestRead(_,id){
    try{
      axios.patch(`http://localhost:3000/requests/${id}`)
    }catch(e){
      console.log(e)
    }
  }
}