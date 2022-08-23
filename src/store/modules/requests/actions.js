import axios from "../../../plugins/axios"

export default {
  async sendRequest(context, request){
    try{
      const response = await axios.post(
        '/requests', 
        request,
      )
      request.id = response._id

      context.commit('addRequest', request)
    }catch(e){
      console.log(e)
    }
  },

  async fetchRequests(context,page){
    // 로그인한사람의 유저 아이디
    // const userId = context.rootGetters.userId
    const token = context.rootGetters.token

    try{
      const {data} = await axios.get(
        `/requests/${page}`,
        { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setRequests', data)
    }catch(e){
      console.log(e)
    }
  },

  haveRequestRead(_,id){
    try{
      axios.patch(`/requests/${id}`)
    }catch(e){
      console.log(e)
    }
  }
}